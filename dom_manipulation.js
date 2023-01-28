import { deleteTransaction, postTransaction, putTransaction } from "./api_connection.js";

export function createTransactionContainer(containerID) {
  const container = document.createElement('div');
  container.classList.add('transaction');
  container.id = `transaction-${containerID}`;

  return container;
}

export function createTransactionTitle(transactionName) {
  const title = document.createElement('span');
  title.classList.add('transaction-title');
  title.textContent = transactionName;

  return title;
}

export function createTransactionAmount(amount) {
  const span = document.createElement('span');

  const formatter = Intl.NumberFormat('pt-BR', {
    compactDisplay: 'long',
    currency: 'BRL',
    style: 'currency'
  });

  const formattedAmount = formatter.format(amount);
  span.textContent = formattedAmount;

  if(amount > 0) span.classList.add('transaction-amount','credit');
  else span.classList.add('transaction-amount','debit');

  return span;
}

export function updateBalance(transactions) {
  const balanceSpan = document.getElementById('balance');
  const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const formatter = Intl.NumberFormat('pt-BR',{
    compactDisplay: 'long',
    currency: 'BRL',
    style: 'currency'
  });

  balanceSpan.textContent = formatter.format(balance);
}

export function createEditTransactionButton(transaction) {
  const editBtn = document.createElement('button');
  editBtn.classList.add('edit-btn');
  editBtn.textContent = 'Editar';
  
  editBtn.addEventListener('click', () => {
    document.getElementById('id').value = transaction.id;
    document.getElementById('name').value = transaction.name;
    document.getElementById('amount').value = transaction.amount;
  });

  return editBtn;
}

export function createDeleteTransactionButton(id, transactions) {
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = 'Excluir'; 

  deleteBtn.addEventListener('click', async () => {
     await deleteTransaction(id);
     
     const indexToRemove = transactions.findIndex(t => t.id === id);
     transactions.splice(indexToRemove, 1);

     deleteBtn.parentElement.remove();
     updateBalance();
  });

  return deleteBtn;
}

export function renderTransaction(transaction, transactions) {
  const container = createTransactionContainer(transaction.id);
  const title = createTransactionTitle(transaction.name);
  const amount = createTransactionAmount(transaction.amount);
  const editBtn = createEditTransactionButton(transaction);
  const deleteBtn = createDeleteTransactionButton(transaction.id , transactions);

  container.append(title, amount, editBtn, deleteBtn);
  document.getElementById('transactions').append(container);
}

export async function saveTransaction(ev) {
  ev.preventDefault();

  const id = document.getElementById('id').value;
  const name = document.getElementById('name').value;
  const amount = Number(document.getElementById('amount').value);
  
  let transaction = null;

  if(id){ // Se tem ID (Se está atualizando uma transação)
    transaction = await putTransaction({id, name, amount});
  }else{ // Criar nova transação
    transaction = await postTransaction({ name, amount });
  }

  ev.target.reset();
  updateBalance();

  return transaction;
}