import csv from 'csvtojson';
import path from 'path';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();

    const transactionList: Transaction[] = [];

    const userAvatarFilePath = path.join(uploadConfig.directory, fileName);

    const array = await csv().fromFile(userAvatarFilePath);

    array.map(async transaction => {
      const newTransaction = await createTransactionService.execute({
        category: transaction.category,
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
      });

      transactionList.push(newTransaction);
    });

    async function insertTransactions(array) {
      for (let i = 0; i < array.length; i++) {
        const newTransaction = await createTransactionService.execute({
          category: array[i].category,
          title: array[i].title,
          type: array[i].type,
          value: array[i].value,
        });

        transactionList.push(newTransaction);
      }
    }

    await insertTransactions(array);

    return transactionList;
  }
}

export default ImportTransactionsService;
