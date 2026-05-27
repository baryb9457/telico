/*
  # Auto-publish testimonials

  1. Set default approved=true for all new testimonials
  2. Publish existing testimonials that are still not approved
*/

ALTER TABLE testimonials
ALTER COLUMN approved SET DEFAULT true;

UPDATE testimonials
SET approved = true
WHERE approved = false;