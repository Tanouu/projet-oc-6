describe('Posts Component Tests', () => {
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
      body: { id: 1, name: 'userName', email: 'user@test.com' },
    }).as('getUser');

    // Mock des données de topics
    cy.intercept('GET', '/api/topics', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Tech' },
        { id: 2, name: 'Gaming' },
      ],
    }).as('getTopics');

    // Mock des posts
    cy.intercept('GET', '/api/posts', {
      statusCode: 200,
      body: [
        { id: 1, title: 'Post 1', userName: 'User 1', content: 'This is the content of Post 1', createdAt: '2023-01-01' },
        { id: 2, title: 'Post 2', userName: 'User 2', content: 'This is the content of Post 2', createdAt: '2023-02-01' }
      ],
    }).as('getPosts');

    // Se connecter et visiter la page des topics
    cy.visit('/login');
    cy.get('input[name="email"]').type('user@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.wait('@getUser');
    cy.wait('@getTopics');

    // Vérifier la redirection vers /topics
    cy.url().should('include', '/topics');

    // Simuler le clic sur "Articles" dans la navbar pour naviguer vers /posts
    cy.contains('Articles').click();
    cy.wait('@getPosts');
  });

  it('should display posts with title, author, and content', () => {
    // Attendre que les posts soient bien chargés et triés
    cy.wait(1000); // Si nécessaire, ajoute une petite pause pour attendre le tri des posts

    // Vérifier que le premier post affiché est "Post 2" après tri par date
    cy.get('.card-title').first().should('contain.text', 'Post 2');
    cy.get('.card-subtitle').first().should('contain.text', 'User 2');
    cy.get('.card-text').first().should('contain.text', 'This is the content of Post 2');

    // Vérifier le dernier post affiché est "Post 1"
    cy.get('.card-title').last().should('contain.text', 'Post 1');
    cy.get('.card-subtitle').last().should('contain.text', 'User 1');
    cy.get('.card-text').last().should('contain.text', 'This is the content of Post 1');
  });

  it('should sort posts by date', () => {
    // Simuler un tri par date
    cy.contains('Trier par').click();
    cy.contains('Date').click();

    // Vérifier que les posts sont triés par date
    cy.get('.card-title').first().should('contain.text', 'Post 2');
    cy.get('.card-title').last().should('contain.text', 'Post 1');
  });

  it('should sort posts by author', () => {
    // Simuler un tri par auteur
    cy.contains('Trier par').click();
    cy.contains('Auteur').click();

    // Vérifier que les posts sont triés par auteur
    cy.get('.card-title').first().should('contain.text', 'Post 1');
    cy.get('.card-title').last().should('contain.text', 'Post 2');
  });

  it('should navigate to the selected post', () => {
    // Simuler le clic sur un post
    cy.get('.card').first().click();

    // Vérifier que la redirection se fait vers le post sélectionné
    cy.url().should('include', '/post/2');
  });
});
