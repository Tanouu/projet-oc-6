-- Création de la table users
CREATE TABLE IF NOT EXISTS public.users (
                                            id BIGSERIAL PRIMARY KEY,
                                            email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
    );

-- Création de la table topics
CREATE TABLE IF NOT EXISTS public.topics (
                                             id BIGSERIAL PRIMARY KEY,
                                             name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL
    );

-- Création de la table posts
CREATE TABLE IF NOT EXISTS public.posts (
                                            id BIGSERIAL PRIMARY KEY,
                                            content TEXT NOT NULL,
                                            title VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    topic_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES public.users(id),
    CONSTRAINT fk_posts_topic FOREIGN KEY (topic_id) REFERENCES public.topics(id)
    );

-- Création de la table comments
CREATE TABLE IF NOT EXISTS public.comments (
                                               id BIGSERIAL PRIMARY KEY,
                                               content TEXT NOT NULL,
                                               post_id BIGINT NOT NULL,
                                               user_id BIGINT NOT NULL,
                                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                               CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES public.posts(id),
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES public.users(id)
    );

-- Création de la table subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
                                                    id BIGSERIAL PRIMARY KEY,
                                                    topic_id BIGINT NOT NULL,
                                                    user_id BIGINT NOT NULL,
                                                    CONSTRAINT fk_subscriptions_topic FOREIGN KEY (topic_id) REFERENCES public.topics(id),
    CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES public.users(id)
    );

-- Ajout de la relation ManyToMany entre Users et Topics
CREATE TABLE IF NOT EXISTS public.user_topics (
                                                  user_id BIGINT NOT NULL,
                                                  topic_id BIGINT NOT NULL,
                                                  PRIMARY KEY (user_id, topic_id),
    CONSTRAINT fk_user_topics_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_topics_topic FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE CASCADE
    );