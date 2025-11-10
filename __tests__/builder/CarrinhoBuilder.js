export class CarrinhoBuilder {
  constructor() {
    this._user = {
      nome: "Usuário Padrão",
      email: "user@email.com",
      isPremium: () => false
    };
    this._itens = [{ nome: "Item Padrão", preco: 100 }];
  }

  comUser(user) {
    this._user = user;
    return this;
  }

  comItens(itens) {
    this._itens = itens;
    return this;
  }

  vazio() {
    this._itens = [];
    return this;
  }

  build() {
    return {
      user: this._user,
      itens: this._itens,
      calcularTotal: () => this._itens.reduce((acc, i) => acc + i.preco, 0)
    };
  }
}
