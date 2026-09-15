const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Database file
const dbPath = path.join(__dirname, "pcbench.db");
const db = new sqlite3.Database(dbPath);

// Set up database
function initializeDatabase() {
    db.serialize(() => {

        db.run(`
            CREATE TABLE IF NOT EXISTS builds (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                cpu TEXT NOT NULL,
                gpu TEXT NOT NULL,
                ram TEXT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS benchmarks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                buildId INTEGER NOT NULL,
                game TEXT NOT NULL,
                averageFPS INTEGER,
                FOREIGN KEY (buildId) REFERENCES builds(id)
            )
        `);

        // Check whether sample data already exists
        db.get(
            "SELECT COUNT(*) AS count FROM builds",
            (err, row) => {

                if (err) {
                    console.error(err);
                    return;
                }

                // Add sample data only if database is empty
                if (row.count === 0) {

                    db.run(
                        `
                        INSERT INTO builds
                        (name, cpu, gpu, ram)
                        VALUES (?, ?, ?, ?)
                        `,
                        [
                            "Gaming PC",
                            "Intel i5-10600K",
                            "RTX 5070",
                            "32 GB"
                        ],
                        function (err) {

                            if (err) {
                                console.error(err);
                                return;
                            }

                            const buildId = this.lastID;

                            db.run(
                                `
                                INSERT INTO benchmarks
                                (buildId, game, averageFPS)
                                VALUES (?, ?, ?)
                                `,
                                [
                                    buildId,
                                    "Black Ops 3",
                                    142
                                ]
                            );
                        }
                    );
                }
            }
        );
    });
}

initializeDatabase();

// API route
app.get("/api/benchmark", (req, res) => {

    const query = `
        SELECT
            builds.name AS buildName,
            builds.cpu,
            builds.gpu,
            builds.ram,
            benchmarks.game,
            benchmarks.averageFPS
        FROM benchmarks

        JOIN builds
        ON benchmarks.buildId = builds.id

        LIMIT 1
    `;

    db.get(query, (err, row) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                error: "Database error"
            });
        }

        res.json(row);
    });
});

app.listen(PORT, () => {
    console.log(
        `PCBench backend running on http://localhost:${PORT}`
    );
});