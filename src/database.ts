// import { Pool, QueryResult } from 'pg';
import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
const certPath = path.resolve(__dirname, 'DigiCertGlobalRootCA.crt.pem');

// Load the self-signed certificate file
const caCert = fs.readFileSync(certPath, 'utf8');


const hostName = process.env.DB_HOST || 'pg-283e61aa-nagarjuna-steel-dev.a.aivencloud.com';
const portNo = process.env.DB_PORT ? +process.env.DB_PORT : 23403;
const databaseName = process.env.DB_DATABASE || 'dl-crm-dev';
const username = process.env.DB_USER || 'avnadmin';
const password = process.env.DB_PASSWORD || 'AVNS_rZA5hyNd3kFI2RsW1nB';
const sequelize = new Sequelize(databaseName, username, password, {
  host: hostName,
  port: portNo,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
      ca: caCert,
    },
  },
  // logging: console.log,
  logging: false
});

// Check database availability
export async function checkDatabaseAvailability(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    console.log('Database synchronized.');
    // await sequelize.sync({ alter: true });
    return true;
  } catch (error) {
    console.log("🚀 ~ checkDatabaseAvailability ~ error:", error)
    return false;
  }
}

export { sequelize };