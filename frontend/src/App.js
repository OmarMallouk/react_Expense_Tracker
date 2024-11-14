import Signup from './components/signup';
import Login from './components/login';
import TransactionForm from './components/transactionForm';
import './App.css';
// import "./styles/index.css";

import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  return (
    <div className="App">

      <Routes>
        <Route path="/signup" element={ <Signup/>}/>
        <Route path="/login" element={ <Login/>}/>
        <Route path="/transactionForm" element={ <TransactionForm/>}/>
        {/* <Route path="/*" element={<h1>Not Found</h1>} /> */}
     
      </Routes>
    </div>
  );
};

export default App;
