import express from "express";
import db from "./db-access.js";

const router = express.Router();

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.json({message: "you are not logged in"})
    }
});

router.get("/api/dashboard", (req, res) => {
    res.json({message: "hello this is your own dashboard"});
})

router.get("/api/dashboard/courses", async (req, res) => {
    console.log(req.user);
    const studentId = req.user.sid;
    try {
        const result = await db.query("SELECT courses.course_id, courses.title, courses.description FROM courses JOIN enrollments ON courses.course_id=enrollments.course_id WHERE student_id = $1", [studentId])
        console.log(result.rows);
        if (result.rows.length > 0) {
            res.json(result.rows)
        }
        else {
            res.json({message: "No courses found"});
        }
    } catch (err) {
        console.log(err);
    }
    
})

export default router;