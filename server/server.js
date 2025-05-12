import express from "express";
import cors from "cors";
import pg from "pg";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";


const app = express();
const port = 3000;
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
}

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "secrets",
    password: "07Overwatch.",
    port: 5432
})

db.connect();

app.use(cors(corsOptions));

app.use(session({
    secret: "something",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    }
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.post("/api/login", passport.authenticate("local"), (req, res) => {
    console.log(req.user);
    res.json({user:req.user})
})

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(port, () => {
    console.log("Server started on port " + port);
});

passport.use("local", 
    new Strategy(async function verify(username, password, cb) {
        // if (username === "dinhquan97@gmail.com" && password === "123456") {
        //     return cb(null, {email: "dinhquan97@gmail.com", password: "123456"});
        // } else {
        //     return cb(null, false);
        // }
        try {
            const result = await db.query("SELECT * FROM users WHERE email = $1", [username,]);
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
