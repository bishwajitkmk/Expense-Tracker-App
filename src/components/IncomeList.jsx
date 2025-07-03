import React from "react";
import IncomeItem from "./IncomeItem";

const IncomeList = ({ incomes, onEdit, onDelete }) => {
  if (!incomes.length) {
    return <p className="text-center text-blue-400">No incomes added yet.</p>;
  }
  return (
    <ul className="space-y-4 bg-blue-50 rounded-lg p-4 shadow">
      {incomes.map((income) => (
        <IncomeItem
          key={income.id}
          income={income}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default IncomeList;
