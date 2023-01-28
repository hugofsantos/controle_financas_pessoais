import { fetchTransactions } from "./api_connection.js";
import { renderTransaction, saveTransaction, updateBalance } from "./dom_manipulation.js";

const transactions = [];

async function setup() {
  const results = await fetchTransactions();
  transactions.push(...results);

  transactions.forEach((transaction) => {renderTransaction(transaction, transactions)});
  updateBalance(transactions);
}

async function addTransaction(ev) {
  const transaction = await saveTransaction(ev);
  const indexOfTransaction = transactions.findIndex( transac => transac.id === transaction.id);

  if(indexOfTransaction === -1) // Se não existe o índice, ou seja, se a transação não existe no array
    transactions.push(transaction);
  else
    transactions[indexOfTransaction] = transaction;
}

document.addEventListener('DOMContentLoaded', setup);
document.querySelector('form').addEventListener('submit', addTransaction);