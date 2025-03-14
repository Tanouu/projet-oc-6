describe('Register Component Tests', () => {

  // Test 1 : Inscription réussie
  describe('Register - Success', () => {
    beforeEach(() => {
      // Mock de la requête POST pour l'inscription
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 200,
        body: {
          token: 'fakeToken123',
          user: {
            id: 1,
            username: 'newUser',
          }
        },
      }).as('registerRequest');

      // Mock des requêtes GET après l'inscription
      cy.intercept('GET', '/api/user/me', {
        statusCode: 200,
        body: { id: 1, name: 'newUser', email: 'newuser@test.com' },
      }).as('getUser');

      cy.intercept('GET', '/api/topics', {
        statusCode: 200,
        body: [{ id: 1, name: 'Tech' }, { id: 2, name: 'Gaming' }],
      }).as('getTopics');

      cy.intercept('GET', '/api/user/profile', {
        statusCode: 200,
        body: { id: 1, subscriptions: [] },
      }).as('getProfile');

      cy.visit('/register');
    });

    it('should register successfully with valid data', () => {
      // Remplir les champs du formulaire
      cy.get('input#email').type('user@test.com');
      cy.get('input#password').type('Password123!'); // Mot de passe valide
      cy.get('input#name').type('User Name');
      cy.get('button[type=submit]').click();

      // Attendre les réponses mockées
      cy.wait('@registerRequest');
      cy.wait('@getUser');
      cy.wait('@getTopics');
      cy.wait('@getProfile');

      // Vérifier la redirection vers /topics
      cy.url({ timeout: 10000 }).should('include', '/topics');
    });
  });

  // Test 2 : Erreur de mot de passe invalide côté backend
  describe('Register - Invalid Password', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 400,
        body: { message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.' },
      }).as('registerRequestFail');

      cy.visit('/register');
    });

    it('should show an error message if the password does not meet the requirements', () => {
      cy.get('input#email').type('user@test.com');
      cy.get('input#password').type('password'); // Mot de passe invalide
      cy.get('input#name').type('User Name');
      cy.get('button[type=submit]').click();

      // Attendre que la requête échoue et vérifier que l'erreur est bien interceptée
      cy.wait('@registerRequestFail');

      // Vérifier l'affichage du message d'erreur venant du backend
      cy.contains('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.').should('be.visible');
    });
  });

  // Test 3 : Vérifier le bouton retour
  describe('Return Button', () => {
    it('should navigate to home when the back button is clicked', () => {
      // Visite la page d'inscription
      cy.visit('/register');

      // Vérifie que l'utilisateur est bien sur la page /register au départ
      cy.url().should('include', '/register');

      // Clic sur le bouton retour pour revenir à la page d'accueil
      cy.get('button').contains('←').click();

      // Vérifie que l'utilisateur est redirigé vers la page d'accueil
      cy.url().should('include', '/');
    });
  });
});
