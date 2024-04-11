//Created to prevent infinite loop if fatal error (such as withdraw amount exceeding $400 in a day) occurs

export default class FatalError extends Error{
    constructor(message){
        super(message);
        this.name = "FatalError";
    }
}