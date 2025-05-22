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
    //console.log(req.user);
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

router.get("/api/dashboard/profile", async (req, res) => {
    console.log(req.user);
    const studentId = req.user.sid;
    try {
        const result = await db.query("SELECT students.firstname, students.lastname, students.address, students.tel, students.email FROM students WHERE sid = $1", [studentId]);
        console.log(result.rows);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);

        } else {
            res.json({message: "cannot find your profile"});
        }
    } catch (err) {
        console.log(err);
    }

})

router.put("/api/dashboard/profile", async(req, res) => {
    console.log("Updating profile");
    console.log(req.body);
    const {firstname, lastname, address, tel, email} = req.body.userInfo;
    const studentId = req.user.sid;
    try {
        const result = await db.query("UPDATE students SET firstname = $1, lastname = $2, address = $3, tel = $4, email = $5 WHERE sid = $6", 
            [firstname, lastname, address, tel, email, studentId]);
        res.json({message: "Profile updated"});

    } catch (err) {
        console.log(err);
        res.json({message: "Error updating profile"});
    }
    
})

export default router;