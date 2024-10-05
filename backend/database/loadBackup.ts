import { exec } from 'child_process';
import * as dotenv from 'dotenv';
import { readdirSync, statSync } from 'fs';
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

// Funkcja do znajdowania najnowszego pliku .sql w bieżącym katalogu
const getLatestBackupFile = (): string | null => {
  const files = readdirSync('.')
    .filter(file => file.endsWith('.sql'))
    .map(file => ({ file, mtime: statSync(file).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  return files.length > 0 ? files[0].file : null;
};

const latestBackupFile = getLatestBackupFile();

if (!latestBackupFile) {
  console.error('Nie znaleziono plików backupu.');
  process.exit(1);
}

// Tworzenie polecenia do przywrócenia bazy danych z najnowszego pliku backupu
const command = `mysql -h ${host} -u ${user} -p${password} ${database} < ${latestBackupFile}`;

// Wykonanie polecenia przywracania
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Błąd podczas przywracania bazy danych: ${stderr}`);
  } else {
    console.log(`Baza danych została przywrócona z pliku: ${latestBackupFile}`);
  }
});
