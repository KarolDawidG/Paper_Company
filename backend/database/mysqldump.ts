import { exec } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (result.error) {
  console.error('Błąd podczas wczytywania zmiennych środowiskowych:', result.error);
  process.exit(1);
}

const host = process.env.HOST_DB as string;
const user = process.env.USER_DB as string;
const password = process.env.PASS_DB as string;
const database = process.env.NAME_DB as string;

const getCurrentDate = (): string => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
  
    return `${day}-${month}-${year}`;
  }

const currentDate = getCurrentDate();
const backupFileName = `backup_${currentDate}.sql`;

const command = `mysqldump -h ${host} -u ${user} -p${password} ${database} > ${backupFileName}`;
//const command = `mysqldump -h ${host} -u ${user} -p${password} dw_erp_papier > dw_erp_papier_dump.sql`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Błąd podczas wykonywania backupu: ${stderr}`);
  } else {
    console.log(`Backup wykonany poprawnie. Zapisano do pliku: ${backupFileName}`);
  }
});

// mysqldump -u root -p \ --databases dw_erp_papier \ --routines --triggers \ > dw_erp_papier_dump.sql

