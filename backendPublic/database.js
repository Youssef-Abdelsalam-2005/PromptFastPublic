const { Pool } = require("pg");

POSTGRES_URL = "You're not getting it";

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
