import { UserMother } from "./builder/UserMother";


jest.mock('../src/domain/Pedido.js', () => ({
  Pedido: jest.fn().mockImplementation((id, carrinho, total, status) => ({
    id,
    carrinho,
    total,
    status
  }))
}));

describe('CheckoutService', () => {
  describe('quando o pagamento falha', () => {
    it('deve retornar null e não persistir o pedido', async () => {
      const carrinho = new CarrinhoBuilder().build();
      const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: false }) };
      const repositoryDummy = { salvar: jest.fn() };
      const emailDummy = { enviarEmail: jest.fn() };

      const checkoutService = new CheckoutService(gatewayStub, repositoryDummy, emailDummy);

      // Act
      const resultado = await checkoutService.processarPedido(carrinho, "1234-5678");

      expect(resultado).toBeNull();
      expect(repositoryDummy.salvar).not.toHaveBeenCalled();
      expect(emailDummy.enviarEmail).not.toHaveBeenCalled();
    });
  });

  describe('quando um cliente Premium finaliza a compra', () => {
    it('deve aplicar desconto, salvar pedido e enviar e-mail', async () => {
      const usuarioPremium = UserMother.umUsuarioPremium();
      const carrinho = new CarrinhoBuilder()
        .comUser(usuarioPremium)
        .comItens([{ nome: "Notebook", preco: 200 }])
        .build();

      const gatewayStub = { cobrar: jest.fn().mockResolvedValue({ success: true }) };
      const pedidoSalvo = { id: 10, status: "PROCESSADO", total: 180 };
      const repositoryStub = { salvar: jest.fn().mockResolvedValue(pedidoSalvo) };
      const emailMock = { enviarEmail: jest.fn().mockResolvedValue() };

      const checkoutService = new CheckoutService(gatewayStub, repositoryStub, emailMock);

      const resultado = await checkoutService.processarPedido(carrinho, "9999-8888");

      expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, "9999-8888");
      expect(repositoryStub.salvar).toHaveBeenCalled();
      expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
      expect(emailMock.enviarEmail).toHaveBeenCalledWith(
        "premium@email.com",
        "Seu Pedido foi Aprovado!",
        expect.stringContaining("Pedido 10")
      );

      expect(resultado).toEqual(pedidoSalvo);
    });
  });
});