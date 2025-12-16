import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/HackClubRAIT.github.io-main', express.static('HackClubRAIT.github.io-main'));
app.use(express.static('.'));

// PostgreSQL connection (Supabase)
const pool = new Pool({
    host: "db.eiyqyhwfgcpklnqahcbu.supabase.co",
    port: 5432,
    user: "postgres",
    password: "jessy123456",
    database: "postgres",
    ssl: { rejectUnauthorized: false }
});

// TEST ROUTE
app.get("/test", (req, res) => {
    res.send("Backend works ✅");
});

// Database test route
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ success: true, time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create table route (run once)
app.get("/setup-db", async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        res.json({ success: true, message: "Table created successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// CONTACT API
app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await pool.query(
            "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)",
            [name, email, subject, message]
        );
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("DB Error:", err.message);
        res.status(500).json({ error: "Database error: " + err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Setup DB: http://localhost:${PORT}/setup-db`);
});
