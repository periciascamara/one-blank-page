-- Add public read access to profiles so public profile pages can fetch the username
CREATE POLICY "leitura_publica_perfil"
  ON profiles FOR SELECT
  USING (true);

-- Add public read access to portfolio links
CREATE POLICY "leitura_publica_portfolio"
  ON portfolio_links FOR SELECT
  USING (true);
