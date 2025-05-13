import express from "express";

import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "./routes/db-access.js";




function initializePassport(passport) {
    passport.use("local", 
        new Strategy(async function verify(username, password, cb) {
            // if (username === "dinhquan97@gmail.com" && password === "123456") {
            //     return cb(null, {email: "dinhquan97@gmail.com", password: "123456"});
            // } else {
            //     return cb(null, false);
            // }
            try {
                const result = await db.query("SELECT * FROM students WHERE email = $1", [username,]);
                if (result.rows.length > 0) {
                    const user = result.rows[0];
                    const storedHasedPassword = user.password;
                    bcrypt.compare(password, storedHasedPassword, (err, valid) => {
                        if (err) {
                            return cb(err);
                        } else {
                            if (valid) {
                                return cb(null, user);
                            } else {
                                return cb(null, false);
                            }
                        }
                    });
                } else {
                    return cb("User not found");
                }
            } catch (err) {
                console.log(err);
            }
        })
    )

    passport.serializeUser((user, cb) => {
        cb(null, user);
    })
    
    passport.deserializeUser((user, cb) => {
        cb(null, user);
    });



}

export default initializePassport;