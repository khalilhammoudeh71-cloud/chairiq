CREATE TABLE IF NOT EXISTS plan_share_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token VARCHAR(64) NOT NULL UNIQUE,
  patient_id UUID NOT NULL,
  plan_id UUID NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_plan_share_links_token ON plan_share_links(token);
CREATE INDEX idx_plan_share_links_plan_id ON plan_share_links(plan_id);

ALTER TABLE plan_share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select by exact token"
  ON plan_share_links FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated insert on plan_share_links"
  ON plan_share_links FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION increment_share_link_view(link_token VARCHAR)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE plan_share_links
  SET view_count = view_count + 1
  WHERE token = link_token;
END;
$$;
