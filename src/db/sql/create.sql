-- DROP DATABASE IF EXISTS node_db WITH (force);
-- CREATE DATABASE node_db;

-- === TABLES ===

-- 1. PERSONS

CREATE TABLE persons (
    p_id SERIAL PRIMARY KEY,
    p_first_name VARCHAR(50),
    p_last_name VARCHAR(50),
    p_age VARCHAR(2),
    p_genre VARCHAR(20),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS

CREATE TABLE users (
    u_id SERIAL PRIMARY KEY,
    u_username VARCHAR(50),
    u_email VARCHAR(100) NOT NULL,
    u_career VARCHAR(30),
    u_location VARCHAR(255),
    p_id INT NOT NULL,
    
    FOREIGN KEY (p_id) REFERENCES persons(p_id),
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PASSWORDS

CREATE TABLE passwords (
    pw_id SERIAL PRIMARY KEY,
    pw_hashed_password VARCHAR(255) NOT NULL,
    u_id INT NOT NULL,
    
    FOREIGN KEY (u_id) REFERENCES users(u_id),
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. USER TYPES

CREATE TABLE user_types (
    ut_id SERIAL PRIMARY KEY,
    ut_type VARCHAR(50) UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. USER PERMISSIONS

CREATE TABLE user_permissions (
    up_id SERIAL PRIMARY KEY,
    up_level INT UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ACCOUNTS

CREATE TABLE accounts (
    a_id SERIAL PRIMARY KEY,
    u_id INT NOT NULL,
    ut_id INT NOT NULL,
    up_id INT NOT NULL,
    
    FOREIGN KEY (u_id) REFERENCES users(u_id),
    FOREIGN KEY (ut_id) REFERENCES user_types(ut_id),
    FOREIGN KEY (up_id) REFERENCES user_permissions(up_id),
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === INSERTS ===

-- 1. CREATE USER TYPES

INSERT INTO user_types(ut_type)
VALUES('admin');

INSERT INTO user_types(ut_type)
VALUES('director');

INSERT INTO user_types(ut_type)
VALUES('user');

-- 2. CREATE USER PERMISSIONS

INSERT INTO user_permissions(up_level)
VALUES(0);

INSERT INTO user_permissions(up_level)
VALUES(1);

INSERT INTO user_permissions(up_level)
VALUES(2);

INSERT INTO user_permissions(up_level)
VALUES(3);

-- === FUNCTIONS ===

-- 1. Get User ID

CREATE OR REPLACE FUNCTION get_user_id(user_email VARCHAR(100))
RETURNS INT AS $$
DECLARE
	user_id INT;
BEGIN
	SELECT u_id INTO user_id FROM users WHERE u_email = user_email;

	RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Create a Person

CREATE OR REPLACE FUNCTION create_person(
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    gender VARCHAR(20)
) 
RETURNS INT AS
$$
DECLARE
    person_id INT;
BEGIN
    -- Insert into persons table (assuming this table exists)
    INSERT INTO persons (p_first_name, p_last_name, p_genre)
    VALUES (first_name, last_name, gender)
    RETURNING persons.p_id INTO person_id;
    
    RETURN person_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Create a User

CREATE OR REPLACE FUNCTION create_user(
    un VARCHAR(50),
    e VARCHAR(100),
    n VARCHAR(50),
    ln VARCHAR(50),
    g VARCHAR(20),
    p VARCHAR(255),
    t VARCHAR(10),
    l INT
) 
RETURNS VOID AS
$$
DECLARE
    user_exists INT;
    u_id INT;
    ut_admin_id INT;
    up_admin_id INT;
BEGIN
    -- Check if the user already exists
    SELECT COUNT(*) INTO user_exists FROM users WHERE u_email = e;

    IF user_exists > 0 THEN
        RETURN;
    END IF;

    -- Insert into users
    INSERT INTO users (u_username, u_email, p_id)
    VALUES (un, e, create_person(n, ln, g))
    RETURNING users.u_id INTO u_id;

    -- Insert into passwords
    INSERT INTO passwords (pw_hashed_password, u_id)
    VALUES (p, u_id);

    -- Get ut_admin_id
    SELECT ut_id INTO ut_admin_id FROM user_types WHERE ut_type = t;

    -- Get up_admin_id
    SELECT up_id INTO up_admin_id FROM user_permissions WHERE up_level = l;

    -- Insert into accounts
    INSERT INTO accounts (u_id, ut_id, up_id)
    VALUES (u_id, ut_admin_id, up_admin_id);
END;
$$ LANGUAGE plpgsql;

-- 4. Get a User Info

CREATE OR REPLACE FUNCTION get_user(u_email VARCHAR(100))
RETURNS SETOF view_all_users AS $$
DECLARE
	u_id INT;
BEGIN
	SELECT get_user_id(u_email) INTO u_id;

	RETURN QUERY SELECT * FROM view_all_users WHERE user_id = u_id;
END;
$$ LANGUAGE plpgsql;

-- === VIEWS ===

-- 1. View All Users

CREATE VIEW view_all_users AS
SELECT 
	u.u_id AS user_id, 
	pe.p_first_name AS first_name, 
	pe.p_last_name AS last_name, 
	u.u_username AS username, 
	u.u_email AS email, 
	u.u_career AS career, 
	u.u_location AS user_location, 
	ut.ut_type AS user_type, 
	up.up_level AS permission_level, 
	acc.createdAt AS account_created_at
FROM accounts acc
INNER JOIN users u ON acc.u_id = u.u_id
INNER JOIN persons pe ON u.p_id = pe.p_id
INNER JOIN user_types ut ON acc.ut_id = ut.ut_id
INNER JOIN user_permissions up ON acc.up_id = up.up_id;

-- === CODE TO TEST DB ===

-- 1. Create Users

SELECT create_user(
    'john_doe', 
    'john@example.com', 
    'John', 
    'Doe', 
    'Male', 
    'hashedpassword123', 
    'admin', 
    1
);

SELECT create_user(
    'edgarVip456', 
    'edgarvip@gmail.com', 
    'Edgar', 
    'Henriques', 
    'Male', 
    'edgarvipsupremo789', 
    'director', 
    2
);

SELECT create_user(
    'cavalo47', 
    'hectorsantos@example.com', 
    'Hector', 
    'Santos', 
    'Male', 
    'hectorsantos123', 
    'user', 
    3
);

SELECT create_user(
    'flowers156', 
    'lara@example.com', 
    'Lara', 
    'Marçal', 
    'Female', 
    'laraomg123', 
    'user', 
    3
);

SELECT get_user('lara@example.com');