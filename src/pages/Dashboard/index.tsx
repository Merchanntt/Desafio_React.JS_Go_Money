import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface ResponseTransaction {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string;
  created_at: Date;
  updated_at: Date;
  category: {
    id: string | null;
    title: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  };
}

interface ResponseBalance {
  transactions: ResponseTransaction[];
  balance: {
    income: string;
    outcome: string;
    total: string;
  };
}

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<ResponseBalance>('/transactions');

      console.log(response);
      if (!response) return;

      const respoTransaction = response.data.transactions;
      const respoBalance: Balance = {
        income,
        // income: formatValue(Number(response.data.balance.income)),
        outcome,
        // outcome: formatValue(Number(response.data.balance.outcome)),
        total,
        // total: formatValue(Number(response.data.balance.total)),
      };
      setBalance(respoBalance);

      const newTransaction: Transaction[] = [];

      respoTransaction.map(trans => {
        const valueFormmated =
          (trans.type === 'income' ? '' : '- ') +
          formatValue(Number(trans.value));

        const DataFormmated = new Intl.DateTimeFormat('pt-BR').format(
          new Date(trans.created_at),
        );

        const categ = trans.category
          ? `${trans.category.title}`
          : 'Sem Categoria';

        newTransaction.push({
          id: trans.id,
          title: trans.title,
          value: trans.value,
          formattedValue: valueFormmated,
          formattedDate: DataFormmated,
          type: trans.type,
          created_at: trans.created_at,
          category: {
            title: categ,
          },
        });
        return newTransaction;
      });
      setTransactions(newTransaction);
    }

    loadTransactions();
  }, []);
  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
