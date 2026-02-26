-- =====================================================
-- BASE DE DATOS: yourtree - SEED DATA
-- =====================================================

-- ROLES
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrador del sistema'),
('user', 'Usuario estándar de la plataforma')
ON CONFLICT (name) DO NOTHING;

-- PAYMENT PLANS
INSERT INTO payment_plans (name, price_month, price_year) VALUES 
('free', 0.00, 0.00),
('pro', 4.99, 49.99),
('business', 14.99, 149.99)
ON CONFLICT (name) DO NOTHING;

-- CATEGORIES
INSERT INTO categories (name, theme) VALUES 
('General', 'general'),
('Technology', 'tech'),
('Lifestyle', 'lifestyle'),
('Entertainment', 'entertainment')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- QUERIES / SELECTORS ÚTILES
-- =====================================================

-- Obtener todos los usuarios con sus roles
-- SELECT u.id, u.username, u.email, r.name as role FROM users u JOIN roles r ON u.role_id = r.id;

-- Obtener el perfil y plan de un usuario
-- SELECT p.first_name, p.last_name, pp.name as plan FROM profiles p JOIN payment_plans pp ON p.plan_id = pp.id;

-- Obtener todos los enlaces de un perfil
-- SELECT * FROM links WHERE profile_id = 1 ORDER BY position ASC;

-- Obtener los foros con sus creadores
-- SELECT f.title, f.description, u.username FROM forums f JOIN profiles p ON f.profile_id = p.id JOIN users u ON p.user_id = u.id;
