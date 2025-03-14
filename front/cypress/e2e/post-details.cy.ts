describe('Post Details Component Tests', () => {
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

    // Mock des détails du post (Post 2)
    cy.intercept('POST', '/api/posts/details', {
      statusCode: 200,
      body: {
        id: 2,
        title: 'Post 2',
        userName: 'User 2',
        content: 'This is the content of Post 2',
        createdAt: '2023-02-01',
        topicName: 'Tech',
        comments: [
          { userName: 'Commenter 1', content: 'Great post!' },
          { userName: 'Commenter 2', content: 'Very informative!' },
        ],
      },
    }).as('getPostDetails');

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

    // Vérifier que les posts sont affichés
    cy.get('.card').should('have.length', 2); // Vérifie que 2 cartes de posts sont présentes

    cy.get('.card').first().click(); // Clic sur le premier post
    cy.wait('@getPostDetails');
  });

  it('should navigate to the selected post', () => {
    // Vérifier que la redirection se fait vers le post sélectionné
    cy.url().should('include', '/post/2');
  });

  it('should display post details correctly', () => {
    // Vérifier l'affichage du titre, de l'auteur et du contenu
    cy.get('h1').should('contain.text', 'Post 2');
    cy.get('h2').should('contain.text', 'User 2');
    cy.get('h2').should('contain.text', 'Tech');
    cy.get('p').should('contain.text', 'This is the content of Post 2');
  });

  it('should display comments correctly', () => {
    // Vérifier l'affichage des commentaires
    cy.get('.list-group-item').should('contain.text', 'Great post!');
    cy.get('.list-group-item').should('contain.text', 'Very informative!');
  });

  // it('should allow adding a new comment', () => {
  //   const newCommentContent = 'Awesome post!';
  //
  //   // Tape le contenu dans l'input
  //   cy.get('input')
  //     .type(newCommentContent)
  //     .should('have.value', newCommentContent);
  //
  //   // Simulez le clic sur le bouton "Envoyer"
  //   cy.get('button.btn.btn-primary').click();
  //
  //   // Attendre que l'API retourne une réponse
  //   cy.wait('@addComment'); // Assurez-vous d'avoir un intercept pour l'ajout de commentaire
  //
  //   // Vérifier que l'input est maintenant vide après l'envoi du commentaire
  //   cy.get('input').clear().should('have.value', '');
  //
  //   // Vérifier que le commentaire est bien ajouté à la liste des commentaires
  //   cy.get('.list-group-item').last().should('contain.text', newCommentContent);
  // });
});
