import 'dotenv/config';
import {RunSelectQuery, initConnection, closeConnection} from "./helpers/Database.js";

await initConnection();
const res = await RunSelectQuery(`select 'Hello World!' as message`);
console.log(res.rows[0].message);

await closeConnection();