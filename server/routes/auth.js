import express from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "./db-access.js";

const router = express.Router();
const saltRounds = 10;

router.get("/api/check-auth", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({isAuthenticated: true, user: req.user});
    } else {
        res.json({isAuthenticated: false})
    }
})

router.post("/api/logout", (req, res) => {
    req.logout((err) => {
        if (err) { 
            return res.status(500).json({ error: err.toString() }); 
        }
        res.json({ success: true, message: "Logged out successfully" });
    })
})

router.post("/api/login", passport.authenticate("local"), (req, res) => {
    console.log(req.user);
    res.json({user:req.user})
})

router.post("/api/signup", async (req, res) => {
    console.log(req.body);
    const email = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const tel = req.body.tel;
    const address = req.body.address;

    try {
        const checkResult = await db.query("SELECT * FROM students WHERE email = $1", [email,])
        if (checkResult.rows.length > 0) {
            console.log("Email already exists");
            res.json({message: "Email already exists"});
            // res.sendStatus(200).json({message: "Email already exists"});
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log("Error hasing password: ", err);
                } else {
                    const result = await db.query(
                        "INSERT INTO students (email, password, firstname, lastname, tel, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [email, hash, firstName, lastName, tel, address]
                    );
                    res.json({message: "Success"});
                    // res.sendStatus(201);
                }
            } )
        }

    } catch (err) {
        console.log(err);
    }
    
})

export default router;