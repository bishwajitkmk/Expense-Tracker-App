/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import ExpenseItem from "./ExpenseItem";

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses.length) {
    return <p className="text-center text-blue-400">No expenses added yet.</p>;
  }
  return (
    <section className="mb-6">
      <ul className="space-y-4 bg-blue-50 rounded-lg p-4 shadow">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
};

const listBoxStyle = {
  maxHeight: "200px",
  overflowY: "auto",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#f9f9f9",
  marginTop: "20px",
};

export default ExpenseList;
