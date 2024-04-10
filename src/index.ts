import 'dotenv/config';
import {initConnection, closeConnection} from "./utils/Database.js";
import {WithdrawAmount} from "./helpers/WithdrawHelper.js";
import {DepositAmount} from "./helpers/DepositHelper.js";
import {CheckBalance} from "./helpers/CheckBalanceHelper.js";

//TODO: add error handling when using helpers

//include init and close in the main module to ensure it gets done before any querying
await initConnection();

const balance = await CheckBalance(1);
console.log("Balance: ", balance);

await closeConnection();