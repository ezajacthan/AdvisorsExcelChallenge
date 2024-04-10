import pg from 'pg';

let client;
export async function initConnection(){
  const {Client } = pg;
  client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
}

export async function RunSelectQuery(query: string){
  return await client.query(query);
}

export async function closeConnection(){
  await client.end();
}