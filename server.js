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

// TEST ROUTE
app.get("/test", (req, res) => {
    res.send("Backend works");
});

// PostgreSQL connection (Supabase)
const pool = new Pool({
    host: "db.eiyqyhwfgcpklnqahcbu.supabase.co",
    port: 5432,
    user: "postgres",
    password: "jessy123456",
    database: "postgres",
    ssl: { rejectUnauthorized: false }
});

// CONTACT API
app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        await pool.query(
            "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)",
            [name, email, subject, message]
        );
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
