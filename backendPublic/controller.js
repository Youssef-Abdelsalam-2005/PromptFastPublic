const pool = require("./database");

const getThings = async (req, res) => {
  const { email } = req.body;

  try {
    const query = `
           INSERT INTO email_list (email)
           VALUES ($1)
           ON CONFLICT (email) DO NOTHING
           RETURNING id;
         `;
    const values = [email];

    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      res
        .status(201)
        .send({ message: "Email added successfully", id: result.rows[0].id });
    } else {
      res.status(409).send({ message: "Email already exists" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while adding the email");
  }
};

module.exports = getThings;
