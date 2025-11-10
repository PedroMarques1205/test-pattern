export class UserMother {
  static umUsuarioPadrao() {
    return {
      nome: "Usuário Comum",
      email: "comum@email.com",
      isPremium: () => false
    };
  }

  static umUsuarioPremium() {
    return {
      nome: "Usuário Premium",
      email: "premium@email.com",
      isPremium: () => true
    };
  }
}
