import React from "react";
import { format } from "date-fns";

const IncomeItem = ({ income, onEdit, onDelete }) => {
  return (
    <li className="flex justify-between items-center bg-white rounded shadow p-4">
      <div>
        <div className="text-blue-800 font-medium">{income.title}</div>
        <div className="text-xs text-blue-400">
          {format(new Date(income.date), "PPpp")}
        </div>
        <div className="text-xs text-blue-600">Source: {income.source}</div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-blue-700 font-bold text-lg">
          ${income.amount}
        </span>
        <button
          onClick={() => onEdit(income)}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(income)}
          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default IncomeItem;
