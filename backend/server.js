const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/api/benchmark", (req, res) => {
    res.json({
        buildName: "Gaming PC",
        cpu: "Intel i5-10600K",
        gpu: "RTX 5070",
        ram: "32 GB",
        game: "Black Ops 3",
        averageFPS: 142
    });
});

app.listen(PORT, () => {
    console.log(`PCBench backend running on http://localhost:${PORT}`);
});