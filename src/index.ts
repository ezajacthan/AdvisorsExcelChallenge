import 'dotenv/config';
import {initConnection, closeConnection} from "./utils/Database.js";
import {WithdrawAmount} from "./helpers/WithdrawHelper.js"

//include init and close in the main module to ensure it gets done before any querying
await initConnection();

//TODO: add error handling to withdraw amount (when fully using it)
const res = await WithdrawAmount(6, 20);

await closeConnection();