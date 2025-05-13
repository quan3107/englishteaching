import express from "express";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "NCEstudents",
    password: "07Overwatch.",
    port: 5432
})

export default db;