
import './App.css';
import { Routes, Route } from "react-router-dom";
import Expense from './components/Expense';
import People from './components/People';
import Home from './components/Home';

function App() {
  return (
    <div className='container'>
      <Routes>
        <Route path="/add-expense" element={<Expense />} />
        <Route path="/add-people" element={<People />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
