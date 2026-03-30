-- Schema SQL con enfoque de Base de Datos No Relacional (Documental)
-- Este script crea tablas optimizadas para almacenar documentos JSON.

-- Tabla de Usuarios (Seguridad)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(20) DEFAULT 'admin',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Colección: Inventario de Materiales (Global registry)
CREATE TABLE IF NOT EXISTS materials_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    -- Columna documental: almacena descripción, categoría, unidades, imagen, etc.
    data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Colección: Tareas y Proyectos
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT PRIMARY KEY, -- ID basado en timestamp de JS
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'en curso',
    -- Columna documental: contiene la estructura compleja del objeto Task
    -- (prioridad, progreso, materiales locales, pasos, galería, recursos, etc.)
    document JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para los campos que se consultan frecuentemente
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
