/*
  # Global quote numbering and counter

  1. Create per-year counter table for quote numbers
  2. Add RPC to get next quote number atomically
  3. Restrict usage to authenticated admins
*/

CREATE TABLE IF NOT EXISTS quote_counters (
  year integer PRIMARY KEY,
  last_value integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quote_counters ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_next_quote_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_year integer := EXTRACT(YEAR FROM now())::integer;
  next_value integer;
  quote_number text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentification requise';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Acces admin requis';
  END IF;

  INSERT INTO quote_counters(year, last_value, updated_at)
  VALUES (current_year, 1, now())
  ON CONFLICT (year)
  DO UPDATE SET
    last_value = quote_counters.last_value + 1,
    updated_at = now()
  RETURNING last_value INTO next_value;

  quote_number := format('DV-%s-%s', current_year, lpad(next_value::text, 4, '0'));
  RETURN quote_number;
END;
$$;

REVOKE ALL ON FUNCTION public.get_next_quote_number() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_next_quote_number() TO authenticated;
 