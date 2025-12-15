import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// TEST ROUTE (very important)
app.get("/test", (req, res) => {
    res.send("Backend works");
});

// PostgreSQL connection
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "web_user",
    password: "Test1234!",
    database: "occ_web_db"
});


app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        await pool.query(
            "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1,$2,$3,$4)",
            [name, email, subject, message]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ success: false });
    }
});

app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});
