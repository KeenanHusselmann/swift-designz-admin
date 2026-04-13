-- Seed clients and their projects
-- Run: npx supabase db query --linked -f supabase/seed-clients-projects.sql

-- Insert clients (using CTEs to capture IDs for project linking)
WITH new_clients AS (
  INSERT INTO clients (name, email, company) VALUES
    ('Rehoboth Community Trust', 'info@rehobothcommunitytrust.org', 'Rehoboth Community Trust'),
    ('Donny Dunn', 'donny@dunmoretraining.co.za', 'Dunmore Training'),
    ('Mariaan Basson', 'mariaan@iaacademy.co.za', 'IA Academy'),
    ('Karin Husselmann', 'karin@tbfreefoundation.org', 'TB Free Foundation'),
    ('Ruth Gwasira', 'ruth@rubysfaithjewellery.co.za', 'Ruby''s Faith Jewellery'),
    ('Richenda Miller', 'richenda@essential420.co.za', 'Essential420'),
    ('Ambrose Isaacs', 'ambrose@it-guru.online', 'IT-Guru.Online'),
    ('Ancel Miller', 'ancel@highlymedicated.co.za', 'Highly Medicated'),
    ('Yvonne Steenkamp', 'yvonne@fryse.co.za', 'Fryse')
  RETURNING id, company
)
INSERT INTO projects (client_id, name, service, status) VALUES
  ((SELECT id FROM new_clients WHERE company = 'Rehoboth Community Trust'), 'Rehoboth Community Trust', 'Web Development', 'in_progress'),
  ((SELECT id FROM new_clients WHERE company = 'Dunmore Training'), 'Dunmore Training', 'Web Development', 'in_progress'),
  ((SELECT id FROM new_clients WHERE company = 'IA Academy'), 'IA Academy', 'Web Development', 'in_progress'),
  ((SELECT id FROM new_clients WHERE company = 'TB Free Foundation'), 'TB Free Foundation', 'Web Development', 'in_progress'),
  ((SELECT id FROM new_clients WHERE company = 'Ruby''s Faith Jewellery'), 'Ruby''s Faith Jewellery Store', 'E-Commerce', 'in_progress'),
  ((SELECT id FROM new_clients WHERE company = 'Essential420'), 'Essential420', 'Web Development', 'in_progress'),
  ((SELECT id FROM new_clients WHERE company = 'IT-Guru.Online'), 'IT-Guru.Online', 'Web Development', 'in_progress'),
  ((SELECT id FROM new_clients WHERE company = 'Highly Medicated'), 'Highly Medicated', 'Web Development', 'in_progress'),
  ((SELECT id FROM new_clients WHERE company = 'Fryse'), 'Fryse', 'Web Development', 'in_progress');
