-- Function to execute SQL with elevated privileges
CREATE OR REPLACE FUNCTION apply_storage_policies(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql;
END;
$$; 