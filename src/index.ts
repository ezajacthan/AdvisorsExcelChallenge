import 'dotenv/config';
import promptSync from 'prompt-sync';
import {initConnection, closeConnection} from "./utils/Database.js";
import {WithdrawAmount} from "./helpers/WithdrawHelper.js";
import {DepositAmount} from "./helpers/DepositHelper.js";
import {CheckBalance} from "./helpers/CheckBalanceHelper.js";
import FatalError from './types/FatalError.js';

const prompt = promptSync({sigint: true});

//include init and close in the main module to ensure it gets done before any querying
await initConnection();

let account = parseInt(prompt(`Welcome to the AdvisorsExcel Challenge ATM. Please enter your account number: `));

console.log(`You are logged into account ${account}.`);
let shouldContinue = true;
let showMenu = true;
let option;
while(shouldContinue){
    if(showMenu) {
        //I put the menu in its own print because the CLI library didn't like '\n' in the prompt string 
        console.log("Options:\n1) Make a deposit\n2) Make a withdrawal\n3) Check Balance\n4) Quit"); 
        option = prompt(`Please enter an option: `);
    }
    switch(option){
        case "1": //deposit
            const deposit:number = parseInt(prompt("How much would you like to deposit? "));
            try{
                await DepositAmount(account, deposit);
                showMenu = true;
            } catch (err) {
                if(err instanceof FatalError){
                    console.log(`Fatal error: ${err.message}. Exiting deposit`);
                    showMenu = true;
                    break;
                } else {
                    showMenu = false;
                    console.log(err.message);
                }
            }
            break;
        case "2": //withdraw
            const withdraw:number = parseInt(prompt("How much would you like to withdraw? "));
            try{
                await WithdrawAmount(account, withdraw);
                showMenu = true;
            } catch (err) {
                if(err instanceof FatalError){
                    console.log(`Fatal error: ${err.message}. Exiting withdraw`);
                    showMenu = true;
                    break;
                } else {
                    showMenu = false;
                    console.log(err.message);
                }
            }
            break;
        case "3": //Check Balance
            try{
                const balance = await CheckBalance(account);
                console.log(`Your balance is: $${balance}.`);
                showMenu = true;
            } catch(err){
                if(err instanceof FatalError){
                    console.log(`Fatal error: ${err.message}. Exiting Check Balance`);
                    showMenu = true;
                    break;
                } else {
                    showMenu = false;
                    console.log(err.message);
                }
            } finally{
                break;
            }
        case "4": //quit
            shouldContinue = false;
            break;
        default:
            console.log("Invalid option given!");
            break;
    }
}
console.log("Goodbye!\n");

await closeConnection();