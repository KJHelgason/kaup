-- Update the first user (or a specific user by email) to be an admin
-- Replace 'your@email.com' with your actual email

UPDATE Users SET IsAdmin = 1 WHERE Email = 'your@email.com';

-- Or to make the first registered user an admin:
-- UPDATE Users SET IsAdmin = 1 WHERE Id = (SELECT Id FROM Users ORDER BY CreatedAt LIMIT 1);

-- To verify:
SELECT Id, Email, FirstName, LastName, IsAdmin FROM Users;
