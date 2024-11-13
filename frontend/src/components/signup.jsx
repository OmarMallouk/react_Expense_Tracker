import React from "react";
import "../styles/signup.css"

const Signup =() =>{
    return (
        <div class="signup-container">
        <h2>Signup</h2>
        <form id="signupForm">
            <div className="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required/>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required/>
            </div>
            <button type="submit" class="btn">Signup</button>
            <a href="http://localhost/ExpenseTracker/pages/login.html">login?</a>
            <div id="errorMessage" class="error-message"></div>
        </form>
    </div>
    
    );
};

export default Signup