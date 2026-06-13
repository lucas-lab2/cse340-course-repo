CREATE TABLE IF NOT EXISTS project_volunteers (
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
