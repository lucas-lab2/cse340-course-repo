DROP TABLE IF EXISTS project_volunteers;
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS users;

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  project_date DATE NOT NULL,
  CONSTRAINT fk_projects_organizations
    FOREIGN KEY (organization_id)
    REFERENCES organizations (organization_id)
    ON DELETE CASCADE
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

CREATE TABLE project_categories (
  project_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, category_id),
  CONSTRAINT fk_project_categories_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (project_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_project_categories_categories
    FOREIGN KEY (category_id)
    REFERENCES categories (category_id)
    ON DELETE CASCADE
);

CREATE TABLE project_volunteers (
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  signed_up_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, project_id),
  CONSTRAINT fk_project_volunteers_users
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_project_volunteers_projects
    FOREIGN KEY (project_id)
    REFERENCES projects (project_id)
    ON DELETE CASCADE
);

INSERT INTO organizations (name, description, image_url)
VALUES
  (
    'Helping Hands Community Center',
    'A local organization focused on connecting volunteers with meaningful service opportunities.',
    '/images/organization.svg'
  ),
  (
    'Green Future Initiative',
    'An organization that supports environmental projects such as cleanup events and recycling education.',
    '/images/organization.svg'
  ),
  (
    'Healthy Neighborhoods Alliance',
    'A volunteer group that promotes health, wellness, and practical support for families in the community.',
    '/images/organization.svg'
  );

INSERT INTO projects (organization_id, name, description, project_date)
VALUES
  (
    2,
    'Neighborhood cleanup project',
    'Volunteers work together to remove litter, improve shared spaces, and encourage better care for the local environment.',
    CURRENT_DATE + INTERVAL '7 days'
  ),
  (
    1,
    'School supplies donation drive',
    'Community members collect notebooks, backpacks, pencils, and other supplies to support students and teachers.',
    CURRENT_DATE + INTERVAL '14 days'
  ),
  (
    2,
    'Community garden support',
    'Volunteers help plant, water, and maintain a garden that provides fresh food and learning opportunities.',
    CURRENT_DATE + INTERVAL '21 days'
  ),
  (
    3,
    'Health and wellness awareness event',
    'Volunteers help organize an event focused on healthy habits, basic screenings, and wellness education.',
    CURRENT_DATE + INTERVAL '28 days'
  ),
  (
    1,
    'Family meal preparation night',
    'Volunteers prepare simple meals for families who need extra support during difficult weeks.',
    CURRENT_DATE + INTERVAL '35 days'
  ),
  (
    3,
    'Senior home visit project',
    'Volunteers visit older community members, share conversation, and help with small acts of service.',
    CURRENT_DATE + INTERVAL '42 days'
  );

INSERT INTO categories (name)
VALUES
  ('Environmental'),
  ('Educational'),
  ('Community Service'),
  ('Health and Wellness');

INSERT INTO project_categories (project_id, category_id)
VALUES
  (1, 1),
  (1, 3),
  (2, 2),
  (2, 3),
  (3, 1),
  (3, 3),
  (4, 3),
  (4, 4),
  (5, 3),
  (5, 4),
  (6, 3),
  (6, 4);

INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@example.com',
  'scrypt$service-connect-admin-salt$709cf83f8182f7934031ff00402b7241a2e9c17652f5bd77e38309b5bc21b6adce8ecd6883018c757cae648f368e29392b8f17be7a94e4b6d4f1b6f80c15f745',
  'admin'
);
