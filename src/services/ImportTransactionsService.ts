import csv from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(fileToImport: File): Promise<Transaction[]> {
    fs.createReadStream(fileToImport)
      .pipe(csv())
      .on('data', row => {
        console.log(row);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  }
}

export default ImportTransactionsService;
