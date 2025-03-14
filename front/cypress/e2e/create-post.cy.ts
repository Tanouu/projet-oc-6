describe('Create Post Component Tests', () => {
  let initialPosts = [
    { id: 1, title: 'Post 1', userName: 'User 1', content: 'This is the content of Post 1', createdAt: '2023-01-01' },
    { id: 2, title: 'Post 2', userName: 'User 2', content: 'This is the content of Post 2', createdAt: '2023-02-01' }
  ];

  let updatedPosts = [
    ...initialPosts,
    { id: 3, title: 'New Article Title', userName: 'User 1', content: 'This is the content of the new article', createdAt: '2023-03-01' }
  ];

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

    // Simuler la récupération initiale des articles
    cy.intercept('GET', '/api/posts', {
      statusCode: 200,
      body: initialPosts,
    }).as('getPosts');

    // Simuler la création d'un nouvel article
    cy.intercept('POST', '/api/posts/create', {
      statusCode: 200,
      body: { id: 3, title: 'New Article Title', userName: 'User 1', content: 'This is the content of the new article', createdAt: '2023-03-01' },
    }).as('createPost');

    // Se connecter et visiter la page des posts
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

  it('should display the initial list of posts', () => {
    // Vérifier que les 2 posts sont affichés initialement
    cy.get('.card').should('have.length', 2);
    cy.contains('Post 1').should('be.visible');
    cy.contains('Post 2').should('be.visible');
  });

  // it('should create a post and update the post list', () => {
  //   // Simuler le clic sur "Créer un article"
  //   cy.contains('Créer un article').click();
  //
  //   // Vérifier que nous sommes sur la page de création d'article
  //   cy.url().should('include', '/create-post');
  //
  //   // Remplir les champs du formulaire de création d'article
  //   cy.get('select[name="topic"]').select('1'); // Sélectionner un thème (Tech)
  //   cy.get('input[name="title"]').type('New Article Title');
  //   cy.get('textarea[name="content"]').type('This is the content of the new article.');
  //
  //   // Soumettre le formulaire
  //   cy.get('button[type="submit"]').click();
  //   cy.wait('@createPost');
  //
  //   // Intercepter la requête pour récupérer la liste mise à jour des posts
  //   cy.intercept('GET', '/api/posts', {
  //     statusCode: 200,
  //     body: updatedPosts,
  //   }).as('getUpdatedPosts');
  //
  //   // Attendre la réponse de la requête pour les posts mis à jour
  //   cy.wait('@getUpdatedPosts');
  //
  //   // Vérifier la redirection vers la page des posts après la création
  //   cy.url().should('include', '/posts');
  //
  //   // Vérifier que le nouvel article a été ajouté dans la liste
  //   cy.get('.card').should('have.length', 3); // Vérifier qu'il y a maintenant 3 articles
  //   cy.contains('New Article Title').should('be.visible');
  //   cy.contains('This is the content of the new article').should('be.visible');
  // });
});
