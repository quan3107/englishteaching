import express from "express";
import db from "./db-access.js";
import bcrypt from "bcrypt";


const router = express.Router();
const saltRounds = 10;

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

router.post("/api/dashboard/profile/change-password", async(req, res) => {
    console.log("Changing password");
    console.log(req.body);
    try {
        const {currentPassword, newPassword} = req.body;
        const studentId = req.user.sid;
        const result = await db.query("SELECT password FROM students WHERE sid = $1", [studentId])
        console.log(result.rows);
        if (result.rows.length > 0) {
            const storedHashedPassword = result.rows[0].password;
            bcrypt.compare(currentPassword, storedHashedPassword, async (err, valid) => {
                if (err) {
                    console.log(err);
                    res.json({message: err});
                } else {
                    if (valid) {
                        bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
                            if (err) {
                                console.log("Error hashing password: ", err);
                            } else {
                                await db.query("UPDATE students SET password = $1 WHERE sid = $2", [hash, studentId])
                                res.json({isSuccess: true, message: "Password updated successfully"})
                            }
                        })
                    } else {
                        console.log("Invalid password");
                        res.json({isSuccess: false, message: "Please enter your current password correctly"})
                    }
                }
            })
            }
        
        } catch (err) {
        res.json({message: "Error changing password: " + err});
        console.log(err)
    }
})

export default router;