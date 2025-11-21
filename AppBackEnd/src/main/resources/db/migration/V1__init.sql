-- Tabla de usuarios
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de roles
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla intermedia usuarios-roles
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Tabla de viajes
CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    destination VARCHAR(255) NOT NULL,
    budget DOUBLE PRECISION NOT NULL,
    travel_style VARCHAR(50) NOT NULL,
    requires_visa BOOLEAN DEFAULT false,
    group_size VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insertar roles
INSERT INTO roles (name) VALUES ('ROLE_ADMIN'), ('ROLE_USER');

-- Insertar usuario admin (password: admin123)
INSERT INTO users (username, password, email, enabled) 
VALUES ('admin', '$2a$12$PL/q6IgzAEl4tjMUl776U.uLyebJLpFtUctANAUajWHlUpVTLrgr6', 'admin@solotrip.com', true);

-- Asignar rol admin al usuario admin
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';

-- Insertar viajes de prueba
INSERT INTO trips (destination, budget, travel_style, requires_visa, group_size, start_date, user_id) 
VALUES 
('Barcelona, España', 1500.00, 'STANDARD', false, 'Solo', '2024-06-15', 1),
('Tokyo, Japón', 3500.00, 'LUXURY', true, 'Pareja', '2024-09-01', 1),
('Bangkok, Tailandia', 800.00, 'BACKPACKER', true, 'Grupo Pequeño', '2024-07-20', 1);
