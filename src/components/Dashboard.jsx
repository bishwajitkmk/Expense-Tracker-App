import { useState } from "react";
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
import { useSettings } from "../contexts/SettingsContext";

const COLORS = [
  "#2563eb",
  "#60a5fa",
  "#1e40af",
  "#93c5fd",
  "#3b82f6",
  "#1d4ed8",
  "#6366f1",
];

const FILTERS = ["Today", "This Week", "This Month"];

const Dashboard = ({
  incomes = [],
  expenses = [],
  updateIncome,
  deleteIncome,
  updateExpense,
  deleteExpense,
}) => {
  const { getCurrencySymbol, getFontSizeClass } = useSettings();
  const currencySymbol = getCurrencySymbol();

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

  // Calculate summary data
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

  // Generate pie chart data from actual expenses
  const generatePieData = () => {
    const categoryTotals = {};
    filteredExpenses.forEach((expense) => {
      const category = expense.category || "Other";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + (expense.amount || 0);
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const pieData = generatePieData();

  // CRUD handlers
  const startEditIncome = (income) => setEditingIncome(income);
  const cancelEditIncome = () => setEditingIncome(null);
  const startEditExpense = (expense) => setEditingExpense(expense);
  const cancelEditExpense = () => setEditingExpense(null);

  return (
    <div className={`p-8 min-h-screen ${getFontSizeClass()}`}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Track your income and expenses</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Total Income</p>
              <p className="text-2xl font-bold">
                {currencySymbol}
                {totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl opacity-80">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Total Expenses</p>
              <p className="text-2xl font-bold">
                {currencySymbol}
                {totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl opacity-80">💸</div>
          </div>
        </div>

        <div
          className={`bg-gradient-to-r rounded-lg shadow-lg p-6 ${
            currentBalance >= 0
              ? "from-blue-500 to-blue-600 text-white"
              : "from-orange-500 to-orange-600 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Current Balance</p>
              <p className="text-2xl font-bold">
                {currencySymbol}
                {currentBalance.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl opacity-80">
              {currentBalance >= 0 ? "📈" : "📉"}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Income Sources</p>
              <p className="text-2xl font-bold">{incomeSources}</p>
            </div>
            <div className="text-3xl opacity-80">📊</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {pieData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Expenses by Category ({activeFilter})
          </h2>
          <div className="h-64">
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
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
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

      {/* Forms and Lists Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Income Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income</h3>
            <IncomeForm
              editingIncome={editingIncome}
              onUpdateIncome={updateIncome}
              onCancelEdit={cancelEditIncome}
            />
            <div className="mt-6">
              <IncomeList
                incomes={filteredIncomes}
                onEdit={startEditIncome}
                onDelete={deleteIncome}
              />
            </div>
          </div>

          {/* Expense Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Expenses
            </h3>
            <ExpenseForm
              editingExpense={editingExpense}
              onUpdateExpense={updateExpense}
              onCancelEdit={cancelEditExpense}
              categories={expenseCategories}
            />
            <div className="mt-6">
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={startEditExpense}
                onDelete={deleteExpense}
              />
            </div>
          </div>
        </div>
      </div>
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
};

export default Dashboard;
