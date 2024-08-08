import React from "react";

const ExpenseItem = ({ expense }) => {
  return (
    <div>
      <h3>{expense.title}</h3>
      <p>${expense.amount.toFixed(2)}</p>
    </div>
  );
};

export default ExpenseItem;
