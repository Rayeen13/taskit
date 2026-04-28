const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // your XAMPP password
  database: "notes_api",
});

db.connect((err) => {
  if (err) {
    console.error("DB error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

app.post("/api/register", async (req, res) => {
  const { name, email, password, password_confirmation, avatar } = req.body;

  if (!name || !email || !password || !password_confirmation) {
    return res.json({ status: false, message: "All fields required" });
  }

  if (password !== password_confirmation) {
    return res.json({ status: false, message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)";

    db.query(query, [name, email, hashedPassword, avatar], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.json({ status: false, message: "Email already exists" });
        }
        return res.json({ status: false, message: "DB error" });
      }

      return res.json({
        status: true,
        message: "User registered successfully",
        user: {
          id: result.insertId,
          name,
          email,
          avatar,
        },
      });
    });
  } catch (err) {
    res.json({ status: false, message: "Server error" });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.json({ status: false, message: "Invalid credentials" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ status: false, message: "Invalid credentials" });
    }

    return res.json({
      status: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
