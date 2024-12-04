CREATE DATABASE IF NOT EXISTS hightainment;

USE hightainment;

CREATE TABLE IF NOT EXISTS titles (
    id INT AUTO_INCREMENT PRIMARY KEY,
		tmdb_id INT UNIQUE, 
    name VARCHAR(50),
    type VARCHAR(50),
    age_rating VARCHAR(20),
		country_of_origin VARCHAR(5),
    summary VARCHAR(255),
    mainPhotoUrl VARCHAR(255),
    mainTrailerUrl VARCHAR(255)
);

