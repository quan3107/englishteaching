import express from "express";
import cors from "cors";

const app = express();
const port = 3000;
const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(port, () => {
    console.log("Server started on port " + port);
});