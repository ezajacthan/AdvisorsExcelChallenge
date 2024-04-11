import {RunQuery} from "../utils/Database.js";
import FatalError from "../types/FatalError.js";

export async function DepositAmount(account: number, amount: number){
    if(amount > 1000){
        throw new Error("Amount cannot exceed $1000. Please try again");
    }
    const getAccountQuery = "Select * from accounts where account_number = $1";
    let queryRes;
    try{
        queryRes = await RunQuery(getAccountQuery, [account]);
    } catch (err){
        //Could add more expansive error handling here, like writing to an error table, notifying a support team, etc.
        throw new FatalError(err.message);
    }
    
    const balance = queryRes.rows[0].amount;
    const accountType = queryRes.rows[0].type;
    const creditLimit = queryRes.rows[0].credit_limit;

    //check if amount to deposit exceeds limits based on account type
    if(accountType == 'credit'){
        if(balance + amount > 0) {
            throw new Error("Credit balance cannot exceed $0. Please enter a different amount.");
        }
    }

    //withdraw means updating the balance of that account to be current balance + deposit amount
    const newBalance = balance + amount;
    const depositAmountQuery = `
        UPDATE accounts
        SET amount = $1
        WHERE account_number = $2
    `;
    let updateBalanceRes;
    try{
        updateBalanceRes =  await RunQuery(depositAmountQuery, [newBalance, account]);
    } catch (err){
        //Could add more expansive error handling here, like writing to an error table, notifying a support team, etc.
        throw new FatalError(err.message);
    }

    //Insert into the transaction table so this deposit can also be tracked (not necessary as per requirements, but likely desired logging)
    const insertTransactionQuery = `
        INSERT INTO transactions
        (account_number, amount, transaction_type, transaction_date)
        VALUES
        ($1, $2, 'deposit', current_date)
    `;
    let insertTransactionRes 
    try{
        insertTransactionRes = await RunQuery(insertTransactionQuery, [account, amount]);
    } catch (err) {
        //Could add more expansive error handling here, like writing to an error table, notifying a support team, etc.

        //since we had an error recording the transaction, we need to reverse the previous insert
        //This has the same problem as the withdraw error handling where an error in both the transaction INSERT and the rollback UPDATE
        //would result in an untracked deposit. Given more time, I would fix this by adding in a stored procedure to do both operations at once
        //so if something failed, the whole thing could be rolled back all at once. Alternatively, the connection could wait to commit
        //until after both UPDATE and INSERT are successful (but again, not sure if this Postgres library or Postgres itself supports that since my DB experience is with Oracle)
        try{
            const resetAmountQuery = `
                UPDATE accounts
                SET amount = $1
                WHERE account_number = $2
            `;
            RunQuery(resetAmountQuery, [account, balance]);
        } catch (err) {
            //Would notify team of uncaught balance issue so it can be rectified (only necessary until bug discussed previously is handled)
            //such as email with all transaction details (nodemailer works well for this), or logging to a table if DB space is no problem
            //and long-term storage preferred
        }
        throw new FatalError(err.message); //throw error with insert query
    }
    console.log(`Successfully deposited $${amount}. New balance for account ${account} is $${newBalance}`);
}