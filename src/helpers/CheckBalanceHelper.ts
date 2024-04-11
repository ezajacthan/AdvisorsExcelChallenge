import {RunQuery} from "../utils/Database.js";
import FatalError from "../types/FatalError.js";

export async function CheckBalance(account: number){
    const getAccountQuery = "Select amount as balance from accounts where account_number = $1";
    let queryRes;
    try{
        queryRes = await RunQuery(getAccountQuery, [account]);
    } catch (err){
        //Could add more expansive error handling here, like writing to an error table, notifying a support team, etc.
        throw new FatalError(err.message);
    }
    
    return queryRes.rows[0].balance;
}