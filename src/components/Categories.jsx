/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useSettings } from "../contexts/SettingsContext";

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
  color,
}) => {
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (input.trim() && ![...defaultItems, ...items].includes(input.trim())) {
      onAdd(input.trim());
      setInput("");
    }
  };

  const handleEdit = () => {
    if (
      editValue.trim() &&
      ![...defaultItems, ...items]
        .filter((item) => item !== editing)
        .includes(editValue.trim())
    ) {
      onEdit(editing, editValue.trim());
      setEditing(null);
      setEditValue("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={addPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAdd()}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white flex-1"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {[...defaultItems, ...items].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              {editing === item ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleEdit()}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                  <button
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors duration-200"
                    onClick={handleEdit}
                  >
                    Save
                  </button>
                  <button
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm transition-colors duration-200"
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
                  <div className={`w-3 h-3 rounded-full ${color}`}></div>
                  <span className="font-medium text-gray-900">{item}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {getCount(item)} {typeLabel}
                  </span>
                  {!defaultItems.includes(item) && (
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs transition-colors duration-200"
                        onClick={() => {
                          setEditing(item);
                          setEditValue(item);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs transition-colors duration-200"
                        onClick={() => onRemove(item)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Categories = ({
  incomes = [],
  expenses = [],
  defaultExpenseCategories = [
    "Food",
    "Travel",
    "Utilities",
    "Shopping",
    "Health",
    "Entertainment",
    "Other",
  ],
  customExpenseCategories = [],
  addExpenseCategory,
  removeExpenseCategory,
  editExpenseCategory,
  defaultIncomeSources = [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Other",
  ],
  customIncomeSources = [],
  addIncomeSource,
  removeIncomeSource,
  editIncomeSource,
}) => {
  const { getCurrencySymbol, getFontSizeClass } = useSettings();
  const currencySymbol = getCurrencySymbol();

  // Count transactions for each category/source
  const getExpenseCount = (cat) =>
    expenses.filter((e) => e.category === cat).length;
  const getIncomeCount = (src) =>
    incomes.filter((i) => i.source === src).length;

  // Calculate totals for charts
  const getExpenseTotal = (cat) =>
    expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + (e.amount || 0), 0);
  const getIncomeTotal = (src) =>
    incomes
      .filter((i) => i.source === src)
      .reduce((sum, i) => sum + (i.amount || 0), 0);

  // Generate chart data
  const expenseChartData = [
    ...defaultExpenseCategories,
    ...customExpenseCategories,
  ]
    .map((cat) => ({
      name: cat,
      value: getExpenseTotal(cat),
      count: getExpenseCount(cat),
    }))
    .filter((item) => item.value > 0);

  const incomeChartData = [...defaultIncomeSources, ...customIncomeSources]
    .map((src) => ({
      name: src,
      value: getIncomeTotal(src),
      count: getIncomeCount(src),
    }))
    .filter((item) => item.value > 0);

  const COLORS = [
    "#2563eb",
    "#60a5fa",
    "#1e40af",
    "#93c5fd",
    "#3b82f6",
    "#1d4ed8",
    "#6366f1",
    "#8b5cf6",
  ];

  return (
    <div className={`p-8 min-h-screen ${getFontSizeClass()}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">
            Manage your expense categories and income sources
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expense Categories */}
          <div>
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
              color="bg-red-500"
            />

            {/* Expense Chart */}
            {expenseChartData.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Expense Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#2563eb"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {expenseChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${currencySymbol}${value.toLocaleString()}`,
                          "Amount",
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Income Sources */}
          <div>
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
              color="bg-green-500"
            />

            {/* Income Chart */}
            {incomeChartData.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Income Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#2563eb"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {incomeChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${currencySymbol}${value.toLocaleString()}`,
                          "Amount",
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
