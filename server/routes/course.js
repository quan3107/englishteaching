import express from "express"
import db from "./db-access.js";

const router = express.Router();

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.json({message: "You are not logged in"})
    }
});

router.get("/api/course/:courseId", (req, res) => {
    console.log(req.params);
})

export default router;