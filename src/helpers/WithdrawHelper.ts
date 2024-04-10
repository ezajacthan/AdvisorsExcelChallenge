import {RunQuery, initConnection, closeConnection} from "../utils/Database.js";
//TODO: add error handling to all queries

export async function WithdrawAmount(account: number, amount: number){
    if(amount > 200){
        throw new Error("Amount cannot exceed $200. Please try again");
    } else if((amount % 5) != 0){
        throw new Error("Amount must be able to be dispensed in $5 bills. Please enter a different amount");
    }
    const getAccountQuery = "Select * from accounts where account_number = $1";
    let queryRes;
    try{
        queryRes = await RunQuery(getAccountQuery, [account]);
    } catch (err){
        //Could add more expansive error handling here, like writing to an error table, notifying a support team, etc.
        console.error(`Caught error getting account information for account ${account}`);
        throw err;
    }
    
    const balance = queryRes.rows[0].amount;
    const accountType = queryRes.rows[0].type;
    const creditLimit = queryRes.rows[0].credit_limit;

    //check if amount requested exceeds limits based on account type
    if(accountType == 'credit'){
        if(amount+Math.abs(balance) > creditLimit) {
            throw new Error("Withdrawal cannot exceed credit limit. Please select a different amount");
        }
    } else {
        if(amount > balance){
            throw new Error("Withdrawal cannot exceed current balance. Please select a different amount");
        }
    }

    //Check transaction amount for this account for this date
    //Description says a customer can only withdraw $400 in a single day, but since all other indications show no connection between accounts,
    //I'm assuming this to mean the customer can only withdraw $400 from an account in a day (but for example, Bill could withdraw $400 from both savings and credit as long as the other checks pass)
    //If it were to be by user entirely, I would add a 'User' table with a unique id for each user (John, Jane, Jill, Bob, Bill, Nancy) 
    //and add a 'User ID' column to the 'accounts' table as a foreign key on the unique user id so I could sum all transactions for a user for a day
    //With my assumtion, I'll sum all transactions for that account for the given day
    const checkWithdrawLimitQuery = `
        select sum(amount) as withdraw_amount
        from transactions 
        where transaction_date = current_date 
        and transaction_type = 'withdrawal'
        and account_number = $1
    `;
    const withdrawLimitRes = await RunQuery(checkWithdrawLimitQuery, [account]);
    const withdrawAmount = withdrawLimitRes.rows[0].withdraw_amount;
    if(withdrawAmount >= 400){
        throw new Error("Cannot withdraw more than $400 in a day. Please try again tomorrow, or try a different account");
    }

    //withdraw means updating the balance of that account to be current balance - withdrawal amount
    const newBalance = balance - amount;
    const withdrawAmountQuery = `
        UPDATE accounts
        SET amount = $1
        WHERE account_number = $2
    `;
    let updateBalanceRes;
    try{
        updateBalanceRes =  await RunQuery(withdrawAmountQuery, [newBalance, account]);
    } catch (err){
        //Could add more expansive error handling here, like writing to an error table, notifying a support team, etc.
        console.error(`Caught error withdrawing ${amount} from account ${account}`);
        throw err;
    }

    //Must insert into the transaction so this withdrawal can also be tracked for future withdrawals
    const insertTransactionQuery = `
        INSERT INTO transactions
        (account_number, amount, transaction_type, transaction_date)
        VALUES
        ($1, $2, 'withdrawal', current_date)
    `;
    let insertTransactionRes 
    try{
        insertTransactionRes = await RunQuery(insertTransactionQuery, [account, amount]);
    } catch {
        //Could add more expansive error handling here, like writing to an error table, notifying a support team, etc.
        console.error(`Caught error inserting transaction ${amount} from account ${account}`);

        //since we had an error recording the transaction, we need to reverse the previous insert
        //in a real-world setting, I would have the UPDATE accounts and INSERT transactions lumped into a stored procedure so the rollback was a little more efficient
        //but for the sake of time in this demo, I left it as individual queries and a comment explaining my thoughts.
        //The obvious error of the way I've done things is that a withdrawal that succeeds at updating the new amount, but fails at both inserting the transaction entry
        //and undoing the withdraw update would remove the money without recording a transaction (hence the need for an SP)
        //I didn't see any rollback functionality in the Postgres package I was using, or if it even supports rollbacks (I'm more familiar with Oracle),
        //but that could be another alternative: Don't commit until both the UPDATE and INSERT are both completed
        try{
            RunQuery(withdrawAmountQuery, [account, balance]);
        }
        throw err;
    }
    console.log(`Successfully withdrew $${amount}. New balance for account ${account} is $${newBalance}`);
}