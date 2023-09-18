import dotenv from 'dotenv';
import assert from 'assert'; // assert is a nodejs module that validates if a condition is true or false

dotenv.config();

const { PORT, SQL_USER, SQL_PWD, SQL_DB, SQL_SERVER,JWT_SECRET } = process.env;



assert(PORT, 'PORT is required');


const config = {
    port: PORT,
    jwt_secret: JWT_SECRET,
    sql: {
        server: 'mannu.database.windows.net',
        database:'Tmanager',
        user: 'emmanuel',
        password: SQL_PWD,
        options: {
            encrypt: true,
        trustservercertificate:false,
      
        }
        
    }
   
};

export default config;