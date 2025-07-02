import React, { useState } from "react";
import Header from "./components/Header";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

const App = () => {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => {
    setExpenses((prevExpenses) => [expense, ...prevExpenses]);
  };

  const clearExpenses = () => {
    setExpenses([]);
  };

  return (
    <div>
      <Header />
      <ExpenseForm onAddExpense={addExpense} />
      <ExpenseList expenses={expenses} />
      <button onClick={clearExpenses} style={clearButtonStyle}>
        Clear List
      </button>
    </div>
  );
};

const clearButtonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#ff4d4d",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default App;
