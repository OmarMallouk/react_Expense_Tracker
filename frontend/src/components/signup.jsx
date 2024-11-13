import React, { useState } from "react";
import axios from "axios";
import "../styles/signup.css"

const Signup =() =>{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            const response = await axios.post('http://localhost/reactExpenseTracker/backend/php/create_user.php',{
                username: username,
                password: password
            });
            if (response.data.success){
                window.location.href = 'http://localhost/reactExpenseTracker/backend/php/create_user.php';

            }else{
                setErrorMessage(response.data.error);
            }
        }catch (error){
            console.error('Error during signup request: ', error);
            setErrorMessage('An error occurred. Please try again.')
        }
    };
    return (
        <div className="signup-container">
        <h2>Signup</h2>
        <form id="signupForm" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={username}
                onChange={(e) => setUsername(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={password} 
                onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <button type="submit" className="btn">Signup</button>
            <a href="http://localhost/ExpenseTracker/pages/login.html">login?</a>
            {errorMessage && <div id="errorMessage" className="error-message">{errorMessage}</div>}
        </form>
    </div>
    
    );
};

export default Signup