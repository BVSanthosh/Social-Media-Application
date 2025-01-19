import mysql from "mysql";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SansySQLDeveloper@2025",
    database: "social"
})