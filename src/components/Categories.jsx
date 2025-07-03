/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";

const EditableList = ({
  title,
  items,
  defaultItems,
  onAdd,
  onRemove,
  onEdit,
  getCount,
  addPlaceholder,
  typeLabel,
}) => {
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  return (
    <div className="bg-blue-50 rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-bold text-blue-700 mb-4">{title}</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={addPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white flex-1"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            if (input.trim()) {
              onAdd(input.trim());
              setInput("");
            }
          }}
        >
          Add
        </button>
      </div>
      <ul className="divide-y divide-blue-100">
        {[...defaultItems, ...items].map((item) => (
          <li key={item} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              {editing === item ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                    onClick={() => {
                      if (editValue.trim()) {
                        onEdit(item, editValue.trim());
                        setEditing(null);
                        setEditValue("");
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-200 text-blue-700 rounded hover:bg-gray-300 text-xs"
                    onClick={() => {
                      setEditing(null);
                      setEditValue("");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="font-medium text-blue-900">{item}</span>
                  <span className="text-xs text-blue-500 ml-2">
                    {getCount(item)} {typeLabel}
                  </span>
                  {!defaultItems.includes(item) && (
                    <>
                      <button
                        className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                        onClick={() => {
                          setEditing(item);
                          setEditValue(item);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                        onClick={() => onRemove(item)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Categories = ({
  incomes = [],
  expenses = [],
  defaultExpenseCategories = [],
  customExpenseCategories = [],
  addExpenseCategory,
  removeExpenseCategory,
  editExpenseCategory,
  defaultIncomeSources = [],
  customIncomeSources = [],
  addIncomeSource,
  removeIncomeSource,
  editIncomeSource,
}) => {
  // Count transactions for each category/source
  const getExpenseCount = (cat) =>
    expenses.filter((e) => e.category === cat).length;
  const getIncomeCount = (src) =>
    incomes.filter((i) => i.source === src).length;

  return (
    <div className="min-h-screen bg-blue-50 flex">
      <div className="flex-1 flex flex-col items-center p-10 ml-64">
        <div className="w-full max-w-2xl">
          <EditableList
            title="Expense Categories"
            items={customExpenseCategories}
            defaultItems={defaultExpenseCategories}
            onAdd={addExpenseCategory}
            onRemove={removeExpenseCategory}
            onEdit={editExpenseCategory}
            getCount={getExpenseCount}
            addPlaceholder="Add expense category"
            typeLabel="expenses"
          />
          <EditableList
            title="Income Sources"
            items={customIncomeSources}
            defaultItems={defaultIncomeSources}
            onAdd={addIncomeSource}
            onRemove={removeIncomeSource}
            onEdit={editIncomeSource}
            getCount={getIncomeCount}
            addPlaceholder="Add income source"
            typeLabel="incomes"
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;
