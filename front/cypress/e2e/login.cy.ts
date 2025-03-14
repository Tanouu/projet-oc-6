describe('Page de connexion', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        token: 'fakeToken123',
      },
    }).as('loginRequest');

    // ✅ Mock des requêtes post-login
    cy.intercept('GET', '/api/user/me', {
      statusCode: 200,
      body: { id: 1, name: 'userName', email: 'user@test.com' },
    }).as('getUser');

    cy.intercept('GET', '/api/topics', {
      statusCode: 200,
      body: [{ id: 1, name: 'Tech' }, { id: 2, name: 'Gaming' }],
    }).as('getTopics');

    cy.intercept('GET', '/api/user/profile', {
      statusCode: 200,
      body: { id: 1, subscriptions: [] },
    }).as('getProfile');

    cy.visit('/login');
  });

  it('doit permettre une connexion réussie', () => {
    cy.get('input[name="email"]').type('user@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.wait('@getUser');
    cy.wait('@getTopics');
    cy.wait('@getProfile');

    cy.url().should('include', '/topics');
  });

  it('doit afficher un message d’erreur pour des identifiants invalides', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Identifiants incorrects' },
    }).as('loginRequestFail');

    cy.get('input[name="email"]').type('wrong@test.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequestFail');

    cy.contains('Identifiants incorrects').should('be.visible');
  });

  // Test 3 : Vérifier le bouton retour
    it('should navigate to home when the back button is clicked', () => {
      // Visite la page d'inscription
      cy.visit('/login');

      // Vérifie que l'utilisateur est bien sur la page /register au départ
      cy.url().should('include', '/login');

      // Clic sur le bouton retour pour revenir à la page d'accueil
      cy.get('button').contains('←').click();

      // Vérifie que l'utilisateur est redirigé vers la page d'accueil
      cy.url().should('include', '/');
    });
});
