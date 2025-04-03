describe('Profile Component Tests', () => {
  beforeEach(() => {
    // Simuler la connexion
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        token: 'fakeToken123',
      },
    }).as('loginRequest');

    // Mock des données de l'utilisateur
    cy.intercept('GET', '/api/user/me', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'userName',
        email: 'user@test.com',
        subscriptions: [
          { id: 1, name: 'Tech', description: 'Technology-related topics' },
          { id: 2, name: 'Gaming', description: 'Video games topics' }
        ]
      },
    }).as('getUserProfile');

    // Mock des données des topics
    cy.intercept('GET', '/api/topics', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Tech', description: 'Technology-related topics' },
        { id: 2, name: 'Gaming', description: 'Video games topics' }
      ],
    }).as('getTopics');

    // Intercepter l'appel pour récupérer les informations du profil
    cy.intercept('GET', '/api/user/profile', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'userName',
        email: 'user@test.com',
        subscriptions: [
          { id: 1, name: 'Tech', description: 'Technology-related topics' },
          { id: 2, name: 'Gaming', description: 'Video games topics' }
        ]
      },
    }).as('getProfile');

    // Visiter la page de connexion
    cy.visit('/login');
    cy.get('input[name="email"]').type('user@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.wait('@getUserProfile');
    cy.wait('@getTopics');

    // Clic sur l'image du profil dans le menu
    cy.get('img[alt="User"]').first().click({ force: true });

    // Attendre que l'API du profil soit appelée
    cy.wait('@getProfile'); // S'assurer que le profil est récupéré avant la vérification de l'URL
  });

  it('should display the user profile correctly', () => {
    // Vérifier que les informations de l'utilisateur sont bien affichées
    cy.get('input[name="name"]').should('have.value', 'userName');
    cy.get('input[name="email"]').should('have.value', 'user@test.com');

    // Vérifier que les abonnements sont bien affichés
    cy.get('.card-title').contains('Tech');
    cy.get('.card-title').contains('Gaming');
  });

  it('should allow updating the profile', () => {
    // Mettre à jour le profil
    cy.get('input[name="name"]').clear().type('newUserName');
    cy.get('input[name="email"]').clear().type('newemail@test.com');
    cy.get('input[name="password"]').type('newpassword123');

    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();

    // Vérifier que les informations du profil ont été mises à jour
    cy.get('input[name="name"]').should('have.value', 'newUserName');
    cy.get('input[name="email"]').should('have.value', 'newemail@test.com');
  });

  // it('should allow unsubscribing from a topic', () => {
  //   // Attendre que l'API pour les abonnements soit correctement interceptée
  //   cy.wait('@getUserProfile');
  //
  //   // Intercepter la requête de désabonnement
  //   cy.intercept('DELETE', '/api/subscriptions/unsubscribe/1', {
  //     statusCode: 200,
  //     body: { message: 'Unsubscribed successfully' },
  //   }).as('unsubscribe');
  //
  //   // Vérifier que la carte contenant le sujet "Tech" est présente
  //   cy.get('.card').contains('Tech').parents('.card').find('button').click();
  //
  //   // Attendre la réponse du serveur après désabonnement
  //   cy.wait('@unsubscribe');
  //
  //   // Vérifier que le sujet "Tech" a bien été supprimé de la liste des abonnements
  //   cy.get('.card').should('not.contain', 'Tech');
  // });

  it('should allow logging out', () => {
    // Cliquer sur le bouton de déconnexion
    cy.get('button').contains('Déconnexion').click();

    // Vérifier que l'utilisateur est redirigé vers la page de connexion
    cy.url().should('include', '/login');
  });
});
