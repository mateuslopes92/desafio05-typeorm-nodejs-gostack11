/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private balance: Balance;

  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    if (transactions.length > 0) {
      const incomes = transactions
        .map(p => (p.type === 'income' ? p.value : 0))
        .reduce((acc, item) => (acc += item));

      const outcomes = transactions
        .map(p => (p.type === 'outcome' ? p.value : 0))
        .reduce((acc, atual) => (acc += atual));

      const total = incomes - outcomes;

      this.balance = {
        income: incomes,
        outcome: outcomes,
        total,
      };
    }

    return this.balance;
  }
}

export default TransactionsRepository;
