const mysql = require("mysql2");

exports.handler = async (event) => {
  // Create a connection to the RDS instance
  const connection = mysql.createConnection({
    host: process.env.RDS_HOST, // Use environment variables for sensitive data
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.DATABASE_NAME,
  });

  // Promisify the connection for easier async/await usage
  const query = (sql, params) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  };

  const userAttributes = event.request.userAttributes;
  const userId = userAttributes.sub;
  const username = event.userName;
  const email = userAttributes.email;

  try {
    const sql = "INSERT INTO users (id, username, email) VALUES (?, ?, ?)";
    const values = [userId, username, email];

    const result = await query(sql, values);

    // Close the connection
    connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User added successfully!",
        userId: userId,
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error adding user",
        error: error.message,
      }),
    };
  }
};
