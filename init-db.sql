-- CREATE ACCOUNTS TABLE
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    account_number INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    amount INTEGER NOT NULL,
    type VARCHAR NOT NULL,
    credit_limit INTEGER
);

ALTER TABLE accounts ADD CONSTRAINT verify_type
CHECK (type IN ('checking', 'savings', 'credit'));

-- LOAD DATAS
INSERT INTO accounts 
    (account_number, name, amount, type, credit_limit)
VALUES
    (1, 'Johns Checking', 1000, 'checking', NULL),
    (2, 'Janes Savings', 2000, 'savings', NULL),
    (3, 'Jills Credit', -3000, 'credit', 10000),
    (4, 'Bobs Checking', 40000, 'checking', NULL),
    (5, 'Bills Savings', 50000, 'savings', NULL),
    (6, 'Bills Credit', -60000, 'credit', 60000),
    (7, 'Nancy Checking', 70000, 'checking', NULL),
    (8, 'Nancy Savings', 80000, 'savings', NULL),
    (9, 'Nancy Credit', -90000, 'credit', 100000);

-- CREATE TRANSACTIONS TABLE
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    transaction_number serial PRIMARY KEY,
    account_number INTEGER REFERENCES accounts(account_number) NOT NULL,
    amount INTEGER NOT NULL,
    transaction_type VARCHAR NOT NULL,
    transaction_date DATE NOT NULL
);

ALTER TABLE transactions ADD CONSTRAINT verify_transaction_type
CHECK (transaction_type IN ('withdrawal', 'deposit'));