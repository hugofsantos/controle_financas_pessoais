const API_URL = 'http://localhost:3000/transactions';

export async function fetchTransactions() {
  return await fetch(API_URL).then(res => res.json());
}

export async function postTransaction(transaction) {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(transaction),
    headers: {
      'Content-Type': 'application/json' 
    }
  });

  return await response.json();
}

export async function putTransaction(transaction) {
  const {id, name, amount} = transaction;
  
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({name, amount}),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return await response.json();
}

export async function deleteTransaction(id) {
  const response = await fetch(`${API_URL}/${id}`, {method: 'DELETE'});

  return await response.json();
} 