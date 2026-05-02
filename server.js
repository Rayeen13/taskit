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
  password: "",
  database: "notes_api",
});

db.connect((err) => {
  if (err) {
    console.error("DB error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

/* ========================= AUTH ========================= */

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
  } catch {
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

/* ========================= NOTES ========================= */

/* CREATE */
app.post("/api/notes", (req, res) => {
  const { user_id, title, content, color, pinned, status } = req.body;

  if (!user_id || !title) {
    return res.json({ status: false, message: "Missing required fields" });
  }

  const query = `
    INSERT INTO notes (user_id, title, content, color, pinned, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      user_id,
      title,
      content || "",
      color || "white",
      pinned || false,
      status || "active",
    ],
    (err, result) => {
      if (err) return res.json({ status: false, message: "DB error" });

      res.json({
        status: true,
        message: "Note created",
        note_id: result.insertId,
      });
    },
  );
});

/* GET ALL */
app.get("/api/notes", (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.json({ status: false, message: "user_id required" });
  }

  const query = `
    SELECT * FROM notes 
    WHERE user_id = ?
    ORDER BY pinned DESC, updated_at DESC
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) return res.json({ status: false, message: "DB error" });

    res.json({
      status: true,
      notes: results,
    });
  });
});

/* GET ONE */
app.get("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;

  const query = `
    SELECT * FROM notes 
    WHERE id = ? AND user_id = ?
  `;

  db.query(query, [id, user_id], (err, results) => {
    if (err || results.length === 0) {
      return res.json({ status: false, message: "Note not found" });
    }

    res.json({
      status: true,
      note: results[0],
    });
  });
});

/* UPDATE (🔥 IMPORTANT — STATUS INCLUDED) */
app.put("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  const { title, content, color, pinned, status } = req.body;

  const query = `
    UPDATE notes 
    SET title=?, content=?, color=?, pinned=?, status=? 
    WHERE id=? AND user_id=?
  `;

  db.query(
    query,
    [title, content, color, pinned, status || "active", id, user_id],
    (err) => {
      if (err) return res.json({ status: false, message: "DB error" });

      res.json({
        status: true,
        message: "Note updated",
      });
    },
  );
});

/* DELETE (PERMANENT) */
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;

  const query = "DELETE FROM notes WHERE id = ? AND user_id = ?";

  db.query(query, [id, user_id], (err) => {
    if (err) return res.json({ status: false, message: "DB error" });

    res.json({
      status: true,
      message: "Note deleted permanently",
    });
  });
});

/* ========================= SERVER ========================= */

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
