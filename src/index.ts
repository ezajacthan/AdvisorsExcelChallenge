import 'dotenv/config';
import {initConnection, closeConnection} from "./utils/Database.js";
import {WithdrawAmount} from "./helpers/WithdrawHelper.js"
import {DepositAmount} from "./helpers/DepositHelper.js"

//TODO: add error handling when using helpers

//include init and close in the main module to ensure it gets done before any querying
await initConnection();

await closeConnection();