-- Insert new screening
INSERT INTO screenings (user_id, title, json_data)
VALUES (?, ?, ?);

-- Update screening
UPDATE screenings
SET 
  title = ?,
  json_data = ?,
  last_modified = CURRENT_TIMESTAMP
WHERE id = ?;

-- Get all screenings for a user
SELECT 
  s.id,
  s.title,
  s.last_modified,
  CONCAT(u.first_name, ' ', u.last_name) AS owner,
  s.json_data
FROM screenings s
JOIN users u ON s.user_id = u.id
WHERE s.user_id = $1
ORDER BY s.last_modified DESC;
