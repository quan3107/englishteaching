import express from "express";
import cors from "cors";
import pg from "pg";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import db from "./routes/db-access.js";
import initializePassport from "./passport-config.js";
import auth from "./routes/auth.js";
import dashboard from "./routes/dashboard.js";
import course from "./routes/course.js";


const app = express();
const port = 3000;
const saltRounds = 10;
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
}

db.connect();

// const db = new pg.Client({
//     user: "postgres",
//     host: "localhost",
//     database: "NCEstudents",
//     password: "07Overwatch.",
//     port: 5432
// })

// db.connect();



app.use(cors(corsOptions));

app.use(session({
    secret: "something",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000,
        
        
        sameSite: "lax"
    }
}));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.use("/", auth);
app.use("/", dashboard);
app.use("/", course)
// app.get("/api/check-auth", (req, res) => {
//     if (req.isAuthenticated()) {
//         res.json({isAuthenticated: true, user: req.user});
//     } else {
//         res.json({isAuthenticated: false})
//     }
// })

// app.post("/api/logout", (req, res) => {
//     req.logout((err) => {
//         if (err) { 
//             return res.status(500).json({ error: err.toString() }); 
//         }
//         res.json({ success: true, message: "Logged out successfully" });
//     })
// })

// app.post("/api/login", passport.authenticate("local"), (req, res) => {
//     console.log(req.user);
//     res.json({user:req.user})
// })

// app.post("/api/signup", async (req, res) => {
//     console.log(req.body);
//     const email = req.body.username;
//     const password = req.body.password;
//     try {
//         const checkResult = await db.query("SELECT * FROM students WHERE email = $1", [email,])
//         if (checkResult.rows.length > 0) {
//             console.log("Email already exists");
//             res.json({message: "Email already exists"});
//             // res.sendStatus(200).json({message: "Email already exists"});
//         } else {
//             bcrypt.hash(password, saltRounds, async (err, hash) => {
//                 if (err) {
//                     console.log("Error hasing password: ", err);
//                 } else {
//                     const result = await db.query(
//                         "INSERT INTO students (email, password) VALUES ($1, $2) RETURNING *", [email, hash]
//                     );
//                     res.json({message: "Success"});
//                     // res.sendStatus(201);
//                 }
//             } )
//         }

//     } catch (err) {
//         console.log(err);
//     }
    
// })

app.listen(port, () => {
    console.log("Server started on port " + port);
});

// passport.use("local", 
//     new Strategy(async function verify(username, password, cb) {
//         // if (username === "dinhquan97@gmail.com" && password === "123456") {
//         //     return cb(null, {email: "dinhquan97@gmail.com", password: "123456"});
//         // } else {
//         //     return cb(null, false);
//         // }
//         try {
//             const result = await db.query("SELECT * FROM students WHERE email = $1", [username,]);
//             if (result.rows.length > 0) {
//                 const user = result.rows[0];
//                 const storedHasedPassword = user.password;
//                 bcrypt.compare(password, storedHasedPassword, (err, valid) => {
//                     if (err) {
//                         return cb(err);
//                     } else {
//                         if (valid) {
//                             return cb(null, user);
//                         } else {
//                             return cb(null, false);
//                         }
//                     }
//                 });
//             } else {
//                 return cb("User not found");
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     })
// )

// passport.serializeUser((user, cb) => {
//     cb(null, user);
// })

// passport.deserializeUser((user, cb) => {
//     cb(null, user);
// });
