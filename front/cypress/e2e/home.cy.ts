describe('Home Component Tests', () => {

  // Test 1 : Vérifier le contenu après le chargement
  describe('Home - Content Loaded', () => {
    beforeEach(() => {
      // Simuler la visite de la page d'accueil
      cy.visit('/');
    });

    it('should display the content after loading', () => {
      // Vérifier que le logo est visible
      cy.get('img').should('be.visible');

      // Vérifier que les boutons sont visibles
      cy.get('button').should('have.length', 2).and('be.visible');
      cy.get('button').contains('Se connecter').should('be.visible');
      cy.get('button').contains("S'inscrire").should('be.visible');
    });
  });
});
