import { config } from "dotenv";
config()
import { conn } from "./DB/dbconn.js";
conn()

const port = process.env.PORT
import { app } from "./app.js";

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
