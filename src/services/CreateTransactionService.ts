import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    let categoryId: string;
    let newCategory: Category;

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (categoryExists) {
      categoryId = categoryExists.id;
    } else {
      newCategory = categoryRepository.create({ title: category });
      const { id } = await categoryRepository.save(newCategory);
      categoryId = id;
    }

    const balance = await transactionsRepository.getBalance();

    if (balance) {
      if (type === 'outcome' && balance.total < value) {
        throw new AppError('You dont have balance');
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      category_id: categoryId,
      type,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
