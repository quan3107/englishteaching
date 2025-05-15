import express from "express";

const router = express.Router();

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.json({message: "you are logged in"})
    } else {
        res.json({message: "you are not logged in"})
    }
});

router.get("/api/dashboard", (req, res) => {
    res.json({message: "hello this is your own dashboard"});
})

export default router;