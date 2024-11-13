import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            axios.get(`http://localhost/ExpenseTracker/php/amount_get.php?user_id=${userId}`)
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

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const amount = parseFloat(transactionAmount);
        const description = transactionDescription;
        const type = transactionType;

        const transaction = {
            user_id: userId,
            type: type,
            amount: amount,
            description: description,
            date: new Date().toISOString()
        };

        axios.post('http://localhost/ExpenseTracker/php/transaction_add.php', transaction)
            .then(response => {
                if (response.data.success) {
                    console.log('Transaction saved to the database!');
                    transaction.transaction_id = response.data.transaction_id; // Ensure this ID is returned from the backend
                    setTransactions([...transactions, transaction]); // Add the transaction to state
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

    // Handle delete transaction
    const deleteTransaction = async (id) => {
        try {
            const response = await axios.delete(`http://localhost/ExpenseTracker/php/delete_transaction.php?id=${id}`);
            if (response.data.success) {
                setTransactions(transactions.filter(transaction => transaction.transaction_id !== id)); // Remove from state
                console.log('Transaction deleted successfully');
            } else {
                console.error('Error deleting transaction:', response.data.error);
            }
        } catch (error) {
            console.error('Error with delete request:', error);
        }
    };

    // Update summary
    const summaryUpdate = () => {
        let incomes = 0;
        let expenses = 0;

        transactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);
            if (transaction.type === 'income') {
                incomes += !isNaN(amount) ? amount : 0;
            } else if (transaction.type === 'expense') {
                expenses += !isNaN(amount) ? amount : 0;
            }
        });

        const budgetTransaction = transactions.find(transaction => transaction.type === 'budget');
        const currentBudget = budgetTransaction ? parseFloat(budgetTransaction.amount) : 0;
        setBudget(currentBudget);

        const balance = currentBudget + incomes - expenses;
        // Update the UI or state for balance, income, and expense here if needed
    };

    useEffect(() => {
        summaryUpdate(); // Update summary whenever transactions change
    }, [transactions]);

    return (
        <div>
            <h2>Transaction Form</h2>
            <form onSubmit={handleSubmit} id="transactionForm">
                <div>
                    <label htmlFor="transactionType">Transaction Type:</label>
                    <select
                        id="transactionType"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="transactionAmount">Amount:</label>
                    <input
                        type="number"
                        id="transactionAmount"
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="transactionDescription">Description:</label>
                    <input
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
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.transaction_id}>
                            <td>{transaction.username}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.type}</td>
                            <td>${transaction.amount}</td>
                            <td>
                                <button onClick={() => deleteTransaction(transaction.transaction_id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionForm;
