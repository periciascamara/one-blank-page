-- ============================================
-- Seed Data — Personal Med Profile
-- Para ambiente de desenvolvimento
-- ============================================

-- Configurações da plataforma
INSERT INTO public.platform_settings (key, value) VALUES
  ('hero_image_url', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d'),
  ('hero_overlay_opacity', '0.6')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed users in auth.users
-- Senha de todos os usuários é: senha123
-- Usamos o hash bcrypt pré-calculado: $2b$10$6shKopQ3MhipQFTUC7.CA.uWXYAA9kATU7w/phfAADOwPPeELvHhi
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at)
VALUES
  -- 1 Admin
  ('a0000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@exemplo.com', '$2b$10$6shKopQ3MhipQFTUC7.CA.uWXYAA9kATU7w/phfAADOwPPeELvHhi', now(), '{"provider":"email","providers":["email"]}', '{"nome":"Admin Editora Viva"}', false, now(), now()),
  -- 5 Users (UUIDs corrigidos de 'u...' para 'b...' para sintaxe hexadecimal correta do UUID)
  ('b1000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dramaria@exemplo.com', '$2b$10$6shKopQ3MhipQFTUC7.CA.uWXYAA9kATU7w/phfAADOwPPeELvHhi', now(), '{"provider":"email","providers":["email"]}', '{"nome":"Dra. Maria Helena Costa"}', false, now(), now()),
  ('b2000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'drrafael@exemplo.com', '$2b$10$6shKopQ3MhipQFTUC7.CA.uWXYAA9kATU7w/phfAADOwPPeELvHhi', now(), '{"provider":"email","providers":["email"]}', '{"nome":"Dr. Rafael Moraes"}', false, now(), now()),
  ('b3000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'usuario3@exemplo.com', '$2b$10$6shKopQ3MhipQFTUC7.CA.uWXYAA9kATU7w/phfAADOwPPeELvHhi', now(), '{"provider":"email","providers":["email"]}', '{"nome":"Dr. Lucas Oliveira"}', false, now(), now()),
  ('b4000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'usuario4@exemplo.com', '$2b$10$6shKopQ3MhipQFTUC7.CA.uWXYAA9kATU7w/phfAADOwPPeELvHhi', now(), '{"provider":"email","providers":["email"]}', '{"nome":"Dra. Fernanda Lima"}', false, now(), now()),
  ('b5000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'usuario5@exemplo.com', '$2b$10$6shKopQ3MhipQFTUC7.CA.uWXYAA9kATU7w/phfAADOwPPeELvHhi', now(), '{"provider":"email","providers":["email"]}', '{"nome":"Dr. Gabriel Santos"}', false, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Configurar perfis, planos e usernames
UPDATE public.profiles SET role = 'admin', plano = 'completo' WHERE id = 'a0000000-0000-0000-0000-000000000000';
UPDATE public.profiles SET plano = 'completo', username = 'dra-maria' WHERE id = 'b1000000-0000-0000-0000-000000000000';
UPDATE public.profiles SET plano = 'medio', username = 'dr-rafael-moraes' WHERE id = 'b2000000-0000-0000-0000-000000000000';
UPDATE public.profiles SET plano = 'simples', username = 'dr-lucas' WHERE id = 'b3000000-0000-0000-0000-000000000000';
UPDATE public.profiles SET plano = 'medio', username = 'dra-fernanda' WHERE id = 'b4000000-0000-0000-0000-000000000000';
UPDATE public.profiles SET plano = 'completo', username = 'dr-gabriel' WHERE id = 'b5000000-0000-0000-0000-000000000000';

-- Cartões dos médicos de teste
INSERT INTO public.cards (id, user_id, nome, titulo, layout, nfc_ativo, status, contatos, formacao, especialidades, redes_sociais, customizacao)
VALUES
  ('c1000000-0000-0000-0000-000000000000', 'b1000000-0000-0000-0000-000000000000', 'Dra. Maria Helena Costa', 'Cardiologista | Ecocardiografista', 'moderno', true, 'ativo', '{"telefone":"+5511999887766","whatsapp":"+5511999887766","email":"dra.maria@clinicacardio.com.br"}', '[{"grau":"Medicina","instituicao":"USP","ano":"2010"},{"grau":"Residência em Cardiologia","instituicao":"InCor USP","ano":"2013"}]', '["Cardiologia","Ecocardiografia"]', '{"linkedin":"https://linkedin.com","instagram":"https://instagram.com"}', '{"cor_primaria":"#6366f1","cor_fundo":"#131318","tema_modo":"escuro"}'),
  ('c2000000-0000-0000-0000-000000000000', 'b2000000-0000-0000-0000-000000000000', 'Dr. Rafael Moraes', 'Cardiologista | Perito Médico', 'moderno', true, 'ativo', '{"telefone":"(11) 98765-4321","whatsapp":"(11) 98765-4321","email":"rafael@exemplo.com"}', '[{"grau":"Medicina","instituicao":"USP","ano":"2016"},{"grau":"Residência em Cardiologia","instituicao":"InCor USP","ano":"2019"}]', '["Cardiologia","Perícia Médica"]', '{"linkedin":"https://linkedin.com","instagram":"https://instagram.com"}', '{"cor_primaria":"#6366f1","cor_fundo":"#09090b","tema_modo":"escuro"}'),
  ('c3000000-0000-0000-0000-000000000000', 'b3000000-0000-0000-0000-000000000000', 'Dr. Lucas Oliveira', 'Clínico Geral', 'minimalista', false, 'ativo', '{"telefone":"(31) 98877-6655","email":"lucas@exemplo.com"}', '[{"grau":"Medicina","instituicao":"UFMG","ano":"2015"}]', '["Clínica Médica"]', '{}', '{"cor_primaria":"#3b82f6","cor_fundo":"#0f172a","tema_modo":"claro"}'),
  ('c4000000-0000-0000-0000-000000000000', 'b4000000-0000-0000-0000-000000000000', 'Dra. Fernanda Lima', 'Pediatra', 'academico', true, 'ativo', '{"whatsapp":"(21) 97766-5544","email":"fernanda@exemplo.com"}', '[{"grau":"Medicina","instituicao":"UFRJ","ano":"2012"}]', '["Pediatria"]', '{}', '{"cor_primaria":"#10b981","cor_fundo":"#064e3b","tema_modo":"escuro"}'),
  ('c5000000-0000-0000-0000-000000000000', 'b5000000-0000-0000-0000-000000000000', 'Dr. Gabriel Santos', 'Neurologista', 'moderno', true, 'ativo', '{"email":"gabriel@exemplo.com"}', '[{"grau":"Medicina","instituicao":"Unicamp","ano":"2014"}]', '["Neurologia"]', '{}', '{"cor_primaria":"#a855f7","cor_fundo":"#1e1b4b","tema_modo":"colorido"}')
ON CONFLICT (id) DO NOTHING;

-- Badges de teste
INSERT INTO public.badges (user_id, label, codigo, ativo, meta_percentual)
VALUES
  ('b1000000-0000-0000-0000-000000000000', 'CRM Ativo SP 154892', 'crm', true, 95),
  ('b1000000-0000-0000-0000-000000000000', 'RQE Registro de Especialista', 'rqe', true, 90),
  ('b2000000-0000-0000-0000-000000000000', 'CRM Ativo SP 123456', 'crm', true, 90),
  ('b2000000-0000-0000-0000-000000000000', 'RQE Registro de Especialista', 'rqe', true, 35)
ON CONFLICT (id) DO NOTHING;

-- Links do linktree de teste
INSERT INTO public.linktree_links (user_id, label, url, ordem, ativo)
VALUES
  ('b1000000-0000-0000-0000-000000000000', 'Agende sua Consulta (Doctoralia)', 'https://doctoralia.com.br/dra-maria', 1, true),
  ('b2000000-0000-0000-0000-000000000000', 'Agendar Consulta (Doctoralia)', 'https://doctoralia.com.br', 0, true),
  ('b2000000-0000-0000-0000-000000000000', 'Artigos Publicados', 'https://pubmed.ncbi.nlm.nih.gov', 1, true)
ON CONFLICT (id) DO NOTHING;
