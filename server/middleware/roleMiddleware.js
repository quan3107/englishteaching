import express from "express";
import db from "../routes/db-access.js";


const router = express.Router();

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized access. Please log in." });
    }
});

async function getUserRole(userId) {
    try {
        const res = await db.query("SELECT role FROM students WHERE sid = $1", [userId]);
        if (res.rows.length > 0) {
            return res.rows[0].role;
        } else {
            return "No user found";
        }
    } catch (err) {
        console.log(err);
        return "error";
    }
}

router.get("/api/role", async (req, res) => {
    const userId = req.user.sid;
    const role = await getUserRole(userId);
    console.log("User role: ", role);
    if (role === "No user found") {
        res.status(404).json({ message: "User not found" });    
    } else if (role === "error") {
        res.status(500).json({ message: "Error retrieving user role" });
    } else {
        res.json({role: role })
    }
    
})

export default router;