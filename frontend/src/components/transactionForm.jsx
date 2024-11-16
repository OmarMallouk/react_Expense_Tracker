import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/transactions.css"
import "../styles/utilities.css"
import "../styles/signup.css"

import Navbar from './navbar';
const TransactionForm = () => {
    const [transactions, setTransactions] = useState([]);
    const [budget, setBudget] = useState(0);
    const [transactionType, setTransactionType] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactionDescription, setTransactionDescription] = useState('');
    const [userId, setUserId] = useState(localStorage.getItem('user_id') || '');

    useEffect(() => {
        // Fetch transactions on component mount
        if (userId) {
            axios.get(`http://localhost/reactExpenseTracker/backend/php/amount_get.php?user_id=${userId}`)
                .then(response => {
                    if (response.data && response.data.success && Array.isArray(response.data.transactions)) {
                        setTransactions(response.data.transactions);
                    } else {
                        console.error('Error fetching transactions:', response.data.error);
                    }
                })
                .catch(error => console.error('Error with axios GET request:', error));
        }
    }, [userId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!transactionType) {
            console.error("Transaction type is required.");
            return;
        }
        if (!transactionAmount || isNaN(transactionAmount) || parseFloat(transactionAmount) <= 0) {
            console.error("A valid transaction amount is required.");
            return;
        }
        if (!userId) {
            console.error("User ID is missing.");
            return;
        }
        const amount = parseFloat(transactionAmount);
        const description = transactionDescription;
        const type = transactionType;

        const transaction = {
            user_id: userId,
            type: type,
            amount: amount,
            description: description,
        };

        axios.post('http://localhost/reactExpenseTracker/backend/php/transaction_add.php', transaction)
            .then(response => {
                if (response.data.success) {
                    console.log('Transaction saved to the database!');
                    transaction.transaction_id = response.data.transaction_id; // Ensure this ID is returned from backend
                    setTransactions([...transactions, transaction]); // Add transaction to state
                    resetForm();
                } else {
                    console.error('Error saving transaction to database:', response.data.error);
                }
            })
            .catch(error => console.error('Error with axios:', error));
    };

    const resetForm = () => {
        setTransactionAmount('');
        setTransactionDescription('');
        setTransactionType('');
    };

   

    return (
      
        <div>
              <Navbar/>
            <h2>Transaction Form</h2>
            <form onSubmit={handleSubmit} id="transactionForm" className="form">
                <div>
                    <label htmlFor="transactionType">Transaction Type:</label>
                    <select className="selection"
                        id="transactionType"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                    >
                        <option value="">Select type</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="transactionAmount">Amount:</label>
                    <input className="describe"
                        type="number"
                        id="transactionAmount"
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="transactionDescription">Description:</label>
                    <input className="addTrans"
                        type="text"
                        id="transactionDescription"
                        value={transactionDescription}
                        onChange={(e) => setTransactionDescription(e.target.value)}
                    />
                </div>

                <button type="submit">Add Transaction</button>
            </form>

            <h3>Transaction List</h3>
            <table id="transaction-list">
                <thead className="table">
                    <tr>
                        <th>Username</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="transaction-list">
                    {transactions.map((transaction) => (
                        <tr key={transaction.transaction_id}>
                            <td>{transaction.username}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.type}</td>
                            <td>${transaction.amount}</td>
                            {/* <td>
                                <button onClick={() => deleteTransaction(transaction.transaction_id)}>
                                    Delete
                                </button>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionForm;
