INSERT INTO account
     (first_name, last_name, email, userId)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account
SET account_type = 'Admin'
WHERE email = 'tony@starkent.com';

DELETE FROM account
WHERE email = 'tony@starkent.com'; first_name = 'Tony';
 last_name = 'Stark'; userId = 'Iam1ronM@n';

 UPDATE inventory
SET description = REPLACE(description, 'small interiors', 'a huge interior')
WHERE model = 'GM Hummer';


SELECT i.make, i.model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

