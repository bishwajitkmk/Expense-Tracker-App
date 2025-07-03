import { useState } from "react";
import Header from "./Header";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import PropTypes from "prop-types";

const pieData = [
  { name: "Food", value: 400 },
  { name: "Travel", value: 300 },
  { name: "Utilities", value: 200 },
  { name: "Shopping", value: 100 },
];
const COLORS = ["#2563eb", "#60a5fa", "#1e40af", "#93c5fd"];

const FILTERS = ["Today", "This Week", "This Month"];

const Dashboard = ({
  incomes = [],
  expenses = [],
  updateIncome,
  deleteIncome,
  updateExpense,
  deleteExpense,
  currencySymbol = "$",
}) => {
  const [activeFilter, setActiveFilter] = useState("Today");
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const expenseCategories = [
    "Food",
    "Travel",
    "Utilities",
    "Shopping",
    "Health",
    "Entertainment",
    "Other",
  ];

  // Helper to get date range for filter
  const getDateRange = (filter) => {
    const now = new Date();
    if (filter === "Today") {
      return [startOfDay(now), endOfDay(now)];
    } else if (filter === "This Week") {
      return [
        startOfWeek(now, { weekStartsOn: 1 }),
        endOfWeek(now, { weekStartsOn: 1 }),
      ];
    } else if (filter === "This Month") {
      return [startOfMonth(now), endOfMonth(now)];
    }
    return [null, null];
  };

  // Filter expenses by date
  const [start, end] = getDateRange(activeFilter);
  const filteredExpenses = expenses.filter(
    (exp) => exp.date && isWithinInterval(new Date(exp.date), { start, end })
  );
  const filteredIncomes = incomes.filter(
    (inc) => inc.date && isWithinInterval(new Date(inc.date), { start, end })
  );

  // CRUD for incomes
  const startEditIncome = (income) => setEditingIncome(income);
  const cancelEditIncome = () => setEditingIncome(null);

  // Example calculations for summary cards (replace with real logic as needed)
  const totalIncome = filteredIncomes.reduce(
    (sum, inc) => sum + (inc.amount || 0),
    0
  );
  const totalExpenses = filteredExpenses.reduce(
    (sum, exp) => sum + (exp.amount || 0),
    0
  );
  const currentBalance = totalIncome - totalExpenses;
  const incomeSources = new Set(filteredIncomes.map((inc) => inc.source)).size;

  const startEditExpense = (expense) => setEditingExpense(expense);
  const cancelEditExpense = () => setEditingExpense(null);

  return (
    <div className="min-h-screen flex bg-blue-200">
      <main className="flex-1 flex flex-col items-center justify-start p-10 ml-64 w-full">
        {/* Filter Bar */}
        <div className="w-full max-w-3xl flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded font-medium transition-colors duration-150 ${
                  activeFilter === filter
                    ? "bg-blue-700 text-white shadow"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          {/* Placeholder for future menu items */}
          <div className="flex gap-2">
            {/* Add menu items here if needed */}
          </div>
        </div>
        {/* Summary Cards */}
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-600 text-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-sm font-medium mb-2">Total Income</span>
            <span className="text-2xl font-bold">
              {currencySymbol}
              {totalIncome.toLocaleString()}
            </span>
          </div>
          <div className="bg-blue-100 text-blue-800 rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-sm font-medium mb-2">Total Expenses</span>
            <span className="text-2xl font-bold">
              {currencySymbol}
              {totalExpenses.toLocaleString()}
            </span>
          </div>
          <div className="bg-blue-700 text-white rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-sm font-medium mb-2">Current Balance</span>
            <span className="text-2xl font-bold">
              {currencySymbol}
              {currentBalance.toLocaleString()}
            </span>
          </div>
          <div className="bg-blue-50 text-blue-900 rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-sm font-medium mb-2">Income Sources</span>
            <span className="text-2xl font-bold">{incomeSources}</span>
          </div>
        </div>
        {/* Chart Section */}
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-blue-700 mb-4">
            Expenses by Category
          </h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#2563eb"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
          <Header />
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <IncomeForm
                editingIncome={editingIncome}
                onUpdateIncome={updateIncome}
                onCancelEdit={cancelEditIncome}
              />
            </div>
            <div className="flex-1">
              <ExpenseForm
                editingExpense={editingExpense}
                onUpdateExpense={updateExpense}
                onCancelEdit={cancelEditExpense}
                categories={expenseCategories}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <IncomeList
                incomes={filteredIncomes}
                onEdit={startEditIncome}
                onDelete={deleteIncome}
              />
            </div>
            <div className="flex-1">
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={startEditExpense}
                onDelete={deleteExpense}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  incomes: PropTypes.array,
  expenses: PropTypes.array,
  updateIncome: PropTypes.func,
  deleteIncome: PropTypes.func,
  updateExpense: PropTypes.func,
  deleteExpense: PropTypes.func,
  currencySymbol: PropTypes.string,
};

export default Dashboard;
