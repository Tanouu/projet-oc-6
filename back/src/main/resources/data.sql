-- Insérer des utilisateurs (évite les doublons sur l'email)
INSERT INTO users (email, password, name) VALUES
    ('user1@example.com', 'password123', 'User One')
    ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password, name) VALUES
    ('user2@example.com', 'password456', 'User Two')
    ON CONFLICT (email) DO NOTHING;

-- Insérer des topics (évite les doublons sur le nom du topic)
INSERT INTO topics (name, description) VALUES
    ('Java', 'Tout ce qui concerne Java.')
    ON CONFLICT (name) DO NOTHING;

INSERT INTO topics (name, description) VALUES
    ('Angular', 'Tout ce qui concerne Angular.')
    ON CONFLICT (name) DO NOTHING;

INSERT INTO topics (name, description) VALUES
    ('Spring Boot' , 'Tout ce qui concerne Spring Boot.')
    ON CONFLICT (name) DO NOTHING;

-- Insérer des posts (évite les doublons sans `ON CONFLICT`)
INSERT INTO posts (title, content, user_id)
SELECT 'Premier post', 'Bienvenue sur MDD !', 1
    WHERE NOT EXISTS (
    SELECT 1 FROM posts WHERE title = 'Premier post'
);

INSERT INTO posts (title, content, user_id)
SELECT 'Angular vs React', 'Comparons ces deux frameworks.', 2
    WHERE NOT EXISTS (
    SELECT 1 FROM posts WHERE title = 'Angular vs React'
);

-- Insérer des commentaires (évite les doublons sur le contenu)
INSERT INTO comments (content, user_id, post_id)
SELECT 'Super article !', 2, 1
    WHERE NOT EXISTS (
    SELECT 1 FROM comments WHERE content = 'Super article !'
);

INSERT INTO comments (content, user_id, post_id)
SELECT 'Je préfère Angular', 1, 2
    WHERE NOT EXISTS (
    SELECT 1 FROM comments WHERE content = 'Je préfère Angular'
);

-- Insérer des abonnements (évite les doublons)
INSERT INTO subscriptions (user_id, topic_id)
SELECT 1, 1
    WHERE NOT EXISTS (
    SELECT 1 FROM subscriptions WHERE user_id = 1 AND topic_id = 1
);

INSERT INTO subscriptions (user_id, topic_id)
SELECT 2, 2
    WHERE NOT EXISTS (
    SELECT 1 FROM subscriptions WHERE user_id = 2 AND topic_id = 2
);
