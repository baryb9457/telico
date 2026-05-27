/*
  # Enable testimonial self-edit with private token

  1. Add `edit_token` to testimonials (unique, random)
  2. Create RPC function to update a testimonial by token
  3. Allow anon/authenticated users to call the RPC safely
*/

ALTER TABLE testimonials
ADD COLUMN IF NOT EXISTS edit_token text;

UPDATE testimonials
SET edit_token = encode(gen_random_bytes(16), 'hex')
WHERE edit_token IS NULL OR edit_token = '';

ALTER TABLE testimonials
ALTER COLUMN edit_token SET NOT NULL;

ALTER TABLE testimonials
ALTER COLUMN edit_token SET DEFAULT encode(gen_random_bytes(16), 'hex');

CREATE UNIQUE INDEX IF NOT EXISTS testimonials_edit_token_key
ON testimonials(edit_token);

CREATE OR REPLACE FUNCTION public.update_testimonial_with_token(
  p_edit_token text,
  p_client_name text,
  p_client_role text,
  p_content text,
  p_rating integer
)
RETURNS testimonials
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_row testimonials;
BEGIN
  IF p_edit_token IS NULL OR btrim(p_edit_token) = '' THEN
    RAISE EXCEPTION 'Code de modification requis';
  END IF;

  IF p_client_name IS NULL OR btrim(p_client_name) = '' THEN
    RAISE EXCEPTION 'Nom requis';
  END IF;

  IF p_content IS NULL OR btrim(p_content) = '' THEN
    RAISE EXCEPTION 'Temoignage requis';
  END IF;

  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'La note doit etre comprise entre 1 et 5';
  END IF;

  UPDATE testimonials
  SET
    client_name = btrim(p_client_name),
    client_role = COALESCE(p_client_role, ''),
    content = btrim(p_content),
    rating = p_rating
  WHERE edit_token = btrim(p_edit_token)
  RETURNING * INTO updated_row;

  IF updated_row.id IS NULL THEN
    RAISE EXCEPTION 'Temoignage introuvable';
  END IF;

  RETURN updated_row;
END;
$$;

REVOKE ALL ON FUNCTION public.update_testimonial_with_token(text, text, text, text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_testimonial_with_token(text, text, text, text, integer) TO anon, authenticated;
