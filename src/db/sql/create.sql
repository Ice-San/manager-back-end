-- === DROP VIEWS ===
DROP VIEW IF EXISTS view_all_users_details CASCADE;
DROP VIEW IF EXISTS view_all_users CASCADE;

-- === DROP FUNCTIONS ===
DROP FUNCTION IF EXISTS create_person(VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS create_user(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, TEXT, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_users(INT) CASCADE;
DROP FUNCTION IF EXISTS get_user_details(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sign_in(VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS user_exists(INT) CASCADE;
DROP FUNCTION IF EXISTS user_verify(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS delete_user(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS reactivate_user(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS update_user(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, TEXT, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS update_user_password(VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_kpis() CASCADE;
DROP FUNCTION IF EXISTS get_active_users_kpi() CASCADE;

-- === DROP TABLES ===
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS user_status CASCADE;
DROP TABLE IF EXISTS user_permissions CASCADE;
DROP TABLE IF EXISTS user_types CASCADE;
DROP TABLE IF EXISTS passwords CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS persons CASCADE;

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
	u_address VARCHAR(255),
	u_phone_number VARCHAR(50),
	u_bio TEXT,
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

-- 6. USER STATUS

CREATE TABLE user_status (
	us_id SERIAL PRIMARY KEY,
	us_status VARCHAR(50),
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ACCOUNTS

CREATE TABLE accounts (
    a_id SERIAL PRIMARY KEY,
    u_id INT NOT NULL,
    ut_id INT NOT NULL,
    up_id INT NOT NULL,
	us_id INT NOT NULL,
    
    FOREIGN KEY (u_id) REFERENCES users(u_id),
    FOREIGN KEY (ut_id) REFERENCES user_types(ut_id),
    FOREIGN KEY (up_id) REFERENCES user_permissions(up_id),
	FOREIGN KEY (us_id) REFERENCES user_status(us_id),
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === INSERTS ===

-- 1. CREATE USER TYPES

INSERT INTO user_types(ut_type)
VALUES('admin');

INSERT INTO user_types(ut_type)
VALUES('moderator');

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

-- 3. CREATE USER ACTIVITYS

INSERT INTO user_status(us_status)
VALUES('active');

INSERT INTO user_status(us_status)
VALUES('inactive');

-- === VIEWS ===

-- 1. View All Users

CREATE VIEW view_all_users AS
SELECT
	pe.p_first_name AS first_name, 
	pe.p_last_name AS last_name, 
	u.u_username AS username,
	u.u_email AS email, 
	u.u_address AS address,
	u.u_phone_number AS phone_number,
	u.u_bio AS bio,
	ut.ut_type AS user_type, 
	up.up_level AS permission_level,
	us.us_status AS status,
	acc.createdAt AS account_created_at
FROM accounts acc
INNER JOIN users u ON acc.u_id = u.u_id
INNER JOIN persons pe ON u.p_id = pe.p_id
INNER JOIN user_types ut ON acc.ut_id = ut.ut_id
INNER JOIN user_permissions up ON acc.up_id = up.up_id
INNER JOIN user_status us ON acc.us_id = us.us_id;

-- 2. View All Users Details

CREATE VIEW view_all_users_details AS
SELECT
	u.u_id AS user_id,
	pe.p_first_name AS first_name, 
	pe.p_last_name AS last_name, 
	u.u_username AS username,
	u.u_email AS email,
	pw.pw_hashed_password AS hashed_password,
	u.u_address AS address,
	u.u_phone_number AS phone_number,
	u.u_bio AS bio, 
	ut.ut_type AS user_type, 
	up.up_level AS permission_level,
	us.us_status AS status,
	acc.createdAt AS account_created_at
FROM accounts acc
INNER JOIN users u ON acc.u_id = u.u_id
INNER JOIN persons pe ON u.p_id = pe.p_id
INNER JOIN passwords pw on pw.u_id = u.u_id
INNER JOIN user_types ut ON acc.ut_id = ut.ut_id
INNER JOIN user_permissions up ON acc.up_id = up.up_id
INNER JOIN user_status us ON acc.us_id = us.us_id;

-- === FUNCTIONS ===

-- 1. Create a Person

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

-- 2. Create a User

CREATE OR REPLACE FUNCTION create_user(
    un VARCHAR(50),
    e VARCHAR(100),
    n VARCHAR(50),
    ln VARCHAR(50),
    g VARCHAR(20),
	addr VARCHAR(255),
	pn VARCHAR(50),
	b TEXT,
    p VARCHAR(255),
    t VARCHAR(10),
	s VARCHAR(50)
) 
RETURNS SETOF view_all_users AS
$$
DECLARE
    u_id INT;
    ut_admin_id INT;
    up_admin_id INT;
	us_admin_id INT;
BEGIN
	-- Verify if user type is valid
	IF t IS NULL OR t = '' THEN
		RETURN;
	END IF;

    -- Insert into users
    INSERT INTO users (u_username, u_email, p_id, u_address, u_phone_number, u_bio)
    VALUES (un, e, create_person(n, ln, g), addr, pn, b)
    RETURNING users.u_id INTO u_id;

    -- Insert into passwords
    INSERT INTO passwords (pw_hashed_password, u_id)
    VALUES (p, u_id);

    -- Get ut_admin_id
    SELECT ut_id INTO ut_admin_id FROM user_types WHERE ut_type = t;

    -- Get up_admin_id
	IF t = 'admin' THEN
		SELECT up_id INTO up_admin_id FROM user_permissions WHERE up_level = 1;
	END IF;
	
	IF t = 'moderator' THEN
		SELECT up_id INTO up_admin_id FROM user_permissions WHERE up_level = 2;
	END IF;
	
	IF t = 'user' THEN
		SELECT up_id INTO up_admin_id FROM user_permissions WHERE up_level = 3;
	END IF;

	-- Get us_admin_id
	SELECT us_id INTO us_admin_id FROM user_status WHERE us_status = s;

    -- Insert into accounts
    INSERT INTO accounts (u_id, ut_id, up_id, us_id)
    VALUES (u_id, ut_admin_id, up_admin_id, us_admin_id);

	RETURN QUERY SELECT * FROM view_all_users WHERE email = e;
END;
$$ LANGUAGE plpgsql;

-- 3. Get Users Info

CREATE OR REPLACE FUNCTION get_users(u_limit INT)
RETURNS TABLE(
	username VARCHAR(50),
	email VARCHAR(100),
	user_type VARCHAR(50),
	status VARCHAR(50),
	account_created_at TIMESTAMP
) AS $$
BEGIN
	RETURN QUERY SELECT vau.username, vau.email, vau.user_type, vau.status, vau.account_created_at 
	FROM view_all_users as vau
	WHERE vau.status = 'active'
	ORDER BY vau.account_created_at DESC
	LIMIT LEAST(u_limit, 50);
END;
$$ LANGUAGE plpgsql;

-- 4. Get a User Details

CREATE OR REPLACE FUNCTION get_user_details(u_email VARCHAR(100))
RETURNS SETOF view_all_users AS $$
BEGIN
	RETURN QUERY SELECT * FROM view_all_users WHERE email = u_email;
END;
$$ LANGUAGE plpgsql;

-- 5. SignIn

CREATE OR REPLACE FUNCTION sign_in(user_email VARCHAR(100), user_password VARCHAR(255))
RETURNS TABLE(u_id INT) AS $$
BEGIN
	RETURN QUERY
		SELECT u.u_id
		FROM users AS u
		INNER JOIN passwords AS pw ON pw.u_id = u.u_id
		INNER JOIN accounts AS a ON a.u_id = u.u_id
		INNER JOIN user_status AS us on us.us_id = a.us_id
		WHERE u.u_email = user_email AND pw.pw_hashed_password = user_password AND us.us_status = 'active';
END;
$$ LANGUAGE plpgsql;

-- 6. Check User Exists

CREATE OR REPLACE FUNCTION user_exists(user_id INT)
RETURNS INT AS $$
	DECLARE user_exist INT;
BEGIN
	SELECT COUNT(*) INTO user_exist FROM users WHERE u_id = user_id;

	RETURN user_exist;
END;
$$ LANGUAGE plpgsql;

-- 7. User Verify

CREATE OR REPLACE FUNCTION user_verify(user_email VARCHAR(100))
RETURNS INT AS $$
	DECLARE user_count INT;
BEGIN
	SELECT COUNT(*) INTO user_count FROM users WHERE u_email = user_email;

	RETURN user_count;
END;
$$ LANGUAGE plpgsql;

-- 8. Delete User

CREATE OR REPLACE FUNCTION delete_user(user_email VARCHAR(100))
RETURNS VARCHAR(40) AS $$
	DECLARE 
		get_user_id INT;
		user_exist INT;
		account_id INT; 
		status_id INT;
BEGIN
	SELECT user_id INTO get_user_id FROM view_all_users_details
	WHERE email = user_email;

	SELECT user_exists INTO user_exist
	FROM user_exists(get_user_id);

	IF user_exist = 0 OR user_exist IS NULL THEN
		RETURN 'User doesnt exists!';
	END IF;

	SELECT a_id INTO account_id
	FROM accounts
	WHERE u_id = get_user_id;

	IF account_id IS NULL THEN
		RETURN '';
	END IF;

	SELECT us_id INTO status_id
	FROM user_status
	WHERE us_status = 'inactive';

	IF status_id IS NULL THEN
		RETURN '';
	END IF;

	UPDATE accounts
	SET us_id = status_id
	WHERE a_id = account_id;

	RETURN 'User was deleted successfully!';
END;
$$ LANGUAGE plpgsql;

-- 9. ReActivate User

CREATE OR REPLACE FUNCTION reactivate_user(user_email VARCHAR(100))
RETURNS TABLE(username VARCHAR(50), user_type VARCHAR(50), joined TIMESTAMP) AS $$
DECLARE 
		get_user_id INT;
		user_exist INT;
		account_id INT; 
		status_id INT;
BEGIN
	SELECT user_id INTO get_user_id FROM view_all_users_details
	WHERE email = user_email;

	SELECT user_exists INTO user_exist
	FROM user_exists(get_user_id);

	IF user_exist = 0 OR user_exist IS NULL THEN
		RETURN;
	END IF;

	SELECT a_id INTO account_id
	FROM accounts
	WHERE u_id = get_user_id;

	IF account_id IS NULL THEN
		RETURN;
	END IF;

	SELECT us_id INTO status_id
	FROM user_status
	WHERE us_status = 'active';

	IF status_id IS NULL THEN
		RETURN;
	END IF;

	UPDATE accounts
	SET us_id = status_id
	WHERE a_id = account_id;

	RETURN QUERY SELECT u.u_username AS username, ut.ut_type as user_type, acc.createdAt AS joined
	FROM accounts AS acc
	INNER JOIN users AS u ON u.u_id = acc.u_id
	INNER JOIN user_types AS ut ON ut.ut_id = acc.ut_id
	WHERE acc.a_id = account_id;
END;
$$ LANGUAGE plpgsql;

-- 10. Update User Info

CREATE OR REPLACE FUNCTION update_user(
	un VARCHAR(50),
    e VARCHAR(100),
	pn VARCHAR(50),
	r VARCHAR(50),
	addr VARCHAR(255),
	b TEXT,
	s VARCHAR(50)
)
RETURNS VARCHAR(40) AS $$
	DECLARE 
		user_id INT;
		role_id INT;
		permission_id INT;
		status_id INT;
BEGIN
	SELECT u_id INTO user_id FROM users
	WHERE u_email = e;

	SELECT ut_id INTO role_id FROM user_types
	WHERE ut_type = r;

	SELECT us_id INTO status_id FROM user_status
	WHERE us_status = s;

	IF r = 'admin' THEN
		SELECT up_id INTO permission_id FROM user_permissions WHERE up_level = 1;
	END IF;
	
	IF r = 'moderator' THEN
		SELECT up_id INTO permission_id FROM user_permissions WHERE up_level = 2;
	END IF;
	
	IF r = 'user' THEN
		SELECT up_id INTO permission_id FROM user_permissions WHERE up_level = 3;
	END IF;

	UPDATE users
	SET u_username = un,
		u_email = e,
		u_address = addr,
		u_phone_number = pn,
		u_bio = b
	WHERE u_id = user_id;

	UPDATE accounts
		SET ut_id = role_id,
			up_id = permission_id,
			us_id = status_id
	WHERE u_id = user_id;

	RETURN 'User was updated successfully!';
END;
$$ LANGUAGE plpgsql;

-- 11. Update User Password

CREATE OR REPLACE FUNCTION update_user_password(e VARCHAR(100), pw VARCHAR(255))
RETURNS VARCHAR(40) AS $$
	DECLARE user_id INT;
BEGIN
	SELECT u_id INTO user_id FROM users
	WHERE u_email = e;

	UPDATE passwords SET pw_hashed_password = pw
	WHERE u_id = user_id;

	RETURN 'User was updated successfully!';
END;
$$ LANGUAGE plpgsql;

-- 12. Get KPIs

CREATE OR REPLACE FUNCTION get_kpis()
RETURNS TABLE(
	total INT,
	admins INT,
	moderators INT,
	users INT
) AS $$
DECLARE
	total_users_count INT;
	admins_count INT;
	mods_count INT;
	users_count INT;
BEGIN
	SELECT COUNT(a_id) INTO total_users_count FROM accounts;
	
	SELECT COUNT(a_id) INTO admins_count FROM accounts
	WHERE ut_id = 1;

	SELECT COUNT(a_id) INTO mods_count FROM accounts
	WHERE ut_id = 2;

	SELECT COUNT(a_id) INTO users_count FROM accounts
	WHERE ut_id = 3;

	RETURN QUERY SELECT total_users_count, admins_count, mods_count, users_count;
END;
$$ LANGUAGE plpgsql;

-- 13. Get Active Users KPI

CREATE OR REPLACE FUNCTION get_active_users_kpi()
RETURNS TABLE(
	total INT,
	admins INT,
	moderators INT,
	users INT
) AS $$
DECLARE
	user_active INT;
	total_users_count INT;
	admins_count INT;
	mods_count INT;
	users_count INT;
BEGIN
	SELECT us_id INTO user_active FROM user_status WHERE us_status = 'active';

	SELECT COUNT(a_id) INTO total_users_count FROM accounts
	WHERE us_id = user_active;

	SELECT COUNT(a_id) INTO admins_count FROM accounts
	WHERE ut_id = 1 AND us_id = user_active;

	SELECT COUNT(a_id) INTO mods_count FROM accounts
	WHERE ut_id = 2 AND us_id = user_active;

	SELECT COUNT(a_id) INTO users_count FROM accounts
	WHERE ut_id = 3 AND us_id = user_active;

	RETURN QUERY SELECT total_users_count, admins_count, mods_count, users_count;
END;
$$ LANGUAGE plpgsql;

-- === CODE TO TEST DB ===

-- 1. Create Users

SELECT create_user(
    'john_doe', 
    'john@example.com', 
    'John', 
    'Doe', 
    'Male', 
	'Rua de Abril Nº3',
	'+351 938 745 345',
	'',
    'hashedpassword123', 
    'admin',
	'active'
);

SELECT create_user(
    'edgar_santos', 
    'es@example.com', 
    'Edgar', 
    'Santos', 
    'Male',
	'Rua Doutor Anibal de Cantos Nº20',
	'+351 998 785 745',
	'Eu gosto de gelados de morango!',
    'hashedpassword123', 
    'admin',
	'active'
);

SELECT create_user(
    'edgarVip456', 
    'edgarvip@gmail.com', 
    'Edgar', 
    'Henriques', 
    'Male', 
	'Rua da Avenida dos Santos Nº15',
	'+351 921 545 745',
	'Montanhas russas são muito divertidas!',
    'edgarvipsupremo789', 
    'moderator',
	'inactive'
);

SELECT create_user(
    'cavalo47', 
    'cavalo47@example.com', 
    'Hector', 
    'Santos', 
    'Male', 
	'Estação da Liberdade Nº69',
	'+351 910 467 383',
	'Be a Developer can sometimes be very thought...',
    'hectorsantos123', 
    'user',
	'inactive'
);