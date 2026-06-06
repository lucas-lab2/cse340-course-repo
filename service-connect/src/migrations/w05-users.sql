CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@example.com',
  'scrypt$service-connect-admin-salt$709cf83f8182f7934031ff00402b7241a2e9c17652f5bd77e38309b5bc21b6adce8ecd6883018c757cae648f368e29392b8f17be7a94e4b6d4f1b6f80c15f745',
  'admin'
)
ON CONFLICT (email) DO UPDATE
SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;
