DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

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
  CONSTRAINT fk_projects_organizations
    FOREIGN KEY (organization_id)
    REFERENCES organizations (organization_id)
    ON DELETE CASCADE
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
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

INSERT INTO projects (organization_id, name, description)
VALUES
  (
    2,
    'Neighborhood cleanup project',
    'Volunteers work together to remove litter, improve shared spaces, and encourage better care for the local environment.'
  ),
  (
    1,
    'School supplies donation drive',
    'Community members collect notebooks, backpacks, pencils, and other supplies to support students and teachers.'
  ),
  (
    2,
    'Community garden support',
    'Volunteers help plant, water, and maintain a garden that provides fresh food and learning opportunities.'
  ),
  (
    3,
    'Health and wellness awareness event',
    'Volunteers help organize an event focused on healthy habits, basic screenings, and wellness education.'
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
  (4, 4);
