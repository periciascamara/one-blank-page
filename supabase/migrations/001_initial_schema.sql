-- ============================================
-- Personal Med Profile — Initial Schema
-- One Blank Page / Editora Viva
-- ============================================

-- Enums
CREATE TYPE plano_enum AS ENUM ('simples', 'medio', 'completo');
CREATE TYPE role_enum  AS ENUM ('usuario', 'admin');
CREATE TYPE status_enum  AS ENUM ('ativo', 'dormindo', 'apagado');
CREATE TYPE layout_enum  AS ENUM ('minimalista', 'moderno', 'academico');

-- ============================================
-- Tabela: profiles
-- ============================================
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  nome        TEXT NOT NULL,
  username    TEXT UNIQUE NOT NULL,
  role        role_enum NOT NULL DEFAULT 'usuario',
  plano       plano_enum NOT NULL DEFAULT 'simples',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario_le_proprio_perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "admin_le_todos"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admin_atualiza_qualquer_perfil"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "usuario_atualiza_proprio_perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (role = 'usuario');

-- ============================================
-- Tabela: cards
-- ============================================
CREATE TABLE cards (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  foto_url     TEXT,
  nome         TEXT NOT NULL,
  titulo       TEXT,
  formacao     JSONB DEFAULT '[]',
  especialidades JSONB DEFAULT '[]',
  contatos     JSONB DEFAULT '{}',
  redes_sociais JSONB DEFAULT '{}',
  layout       layout_enum NOT NULL DEFAULT 'minimalista',
  customizacao JSONB DEFAULT '{}',
  nfc_ativo    BOOLEAN NOT NULL DEFAULT true,
  status       status_enum NOT NULL DEFAULT 'ativo',
  deleted_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leitura_publica_cartao_ativo"
  ON cards FOR SELECT
  USING (status = 'ativo');

CREATE POLICY "leitura_dormindo"
  ON cards FOR SELECT
  USING (status = 'dormindo');

CREATE POLICY "usuario_gerencia_proprio_cartao"
  ON cards FOR ALL
  USING (auth.uid() = user_id);

-- Index for public card lookup
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_status ON cards(status);

-- ============================================
-- Tabela: badges
-- ============================================
CREATE TABLE badges (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label     TEXT NOT NULL,
  codigo    TEXT,
  ativo     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario_gerencia_badges"
  ON badges FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "leitura_publica_badges_ativos"
  ON badges FOR SELECT
  USING (ativo = true);

CREATE INDEX idx_badges_user_id ON badges(user_id);

-- ============================================
-- Tabela: linktree_links
-- ============================================
CREATE TABLE linktree_links (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label     TEXT NOT NULL,
  url       TEXT NOT NULL,
  ordem     INT NOT NULL DEFAULT 0,
  ativo     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE linktree_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario_gerencia_linktree"
  ON linktree_links FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "leitura_publica_links_ativos"
  ON linktree_links FOR SELECT
  USING (ativo = true);

CREATE INDEX idx_linktree_user_id ON linktree_links(user_id);

-- ============================================
-- Tabela: portfolio_links (plano Completo)
-- ============================================
CREATE TABLE portfolio_links (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label     TEXT NOT NULL,
  url       TEXT NOT NULL,
  tipo      TEXT CHECK (tipo IN ('github', 'latex', 'pdf', 'outro')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE portfolio_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario_gerencia_portfolio"
  ON portfolio_links FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_portfolio_user_id ON portfolio_links(user_id);

-- ============================================
-- Tabela: admin_logs
-- ============================================
CREATE TABLE admin_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES profiles(id),
  acao        TEXT NOT NULL,
  target_id   UUID,
  dados_antes JSONB,
  dados_depois JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "somente_admin_le_logs"
  ON admin_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "somente_admin_insere_logs"
  ON admin_logs FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Tabela: platform_settings
-- ============================================
CREATE TABLE platform_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leitura_publica_settings"
  ON platform_settings FOR SELECT USING (true);

CREATE POLICY "admin_atualiza_settings"
  ON platform_settings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- Trigger: on_auth_user_created
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, username, role, plano)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    LOWER(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), '[^a-z0-9]', '-', 'g')),
    'usuario',
    'simples'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Function: auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
