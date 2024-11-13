import Signup from './components/signup';
import './App.css';
// import "./styles/index.css";

import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  return (
    <div className="App">

      <Routes>
        <Route path="/signup" element={ <Signup/>}/>
     
      </Routes>
    </div>
  );
};

export default App;
