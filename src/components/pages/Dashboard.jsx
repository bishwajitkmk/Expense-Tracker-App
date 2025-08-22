import { useState, useMemo } from "react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { useSettings } from "../../contexts/SettingsContext";
import { useTransactions } from "../../contexts/TransactionContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import PageHeader from "../layout/PageHeader";
import FilterBar from "../features/dashboard/FilterBar";
import SummaryCard from "../features/dashboard/SummaryCard";
import ExpenseChart from "../features/dashboard/ExpenseChart";
import ExpenseForm from "../forms/ExpenseForm";
import ExpenseList from "../lists/ExpenseList";
import IncomeForm from "../forms/IncomeForm";
import IncomeList from "../lists/IncomeList";

const FILTERS = ["Today", "This Week", "This Month"];

const Dashboard = () => {
  const { getCurrencyCode, getFontSizeClass } = useSettings();
  const { convertAmount, formatAmount } = useExchangeRate();
  const {
    incomes,
    expenses,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useTransactions();

  const displayCurrency = getCurrencyCode();

  const [activeFilter, setActiveFilter] = useState("Today");
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

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

  // Convert and calculate summary data
  const summaryData = useMemo(() => {
    const totalIncome = filteredIncomes.reduce((sum, inc) => {
      const convertedAmount = convertAmount(
        inc.amount || 0,
        inc.currency || "USD",
        displayCurrency
      );
      return sum + convertedAmount;
    }, 0);

    const totalExpenses = filteredExpenses.reduce((sum, exp) => {
      const convertedAmount = convertAmount(
        exp.amount || 0,
        exp.currency || "USD",
        displayCurrency
      );
      return sum + convertedAmount;
    }, 0);

    const currentBalance = totalIncome - totalExpenses;
    const incomeSources = new Set(filteredIncomes.map((inc) => inc.source))
      .size;

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
      incomeSources,
    };
  }, [filteredIncomes, filteredExpenses, convertAmount, displayCurrency]);

  // Generate pie chart data from actual expenses (converted to display currency)
  const pieData = useMemo(() => {
    const categoryTotals = {};
    filteredExpenses.forEach((expense) => {
      const category = expense.category || "Other";
      const convertedAmount = convertAmount(
        expense.amount || 0,
        expense.currency || "USD",
        displayCurrency
      );
      categoryTotals[category] =
        (categoryTotals[category] || 0) + convertedAmount;
    });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredExpenses, convertAmount, displayCurrency]);

  // CRUD handlers
  const startEditIncome = (income) => setEditingIncome(income);
  const cancelEditIncome = () => setEditingIncome(null);
  const startEditExpense = (expense) => setEditingExpense(expense);
  const cancelEditExpense = () => setEditingExpense(null);

  return (
    <div className={`p-8 min-h-screen ${getFontSizeClass()}`}>
      <PageHeader title="Dashboard" subtitle="Track your income and expenses" />

      <FilterBar
        filters={FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Total Income"
          value={summaryData.totalIncome}
          icon="💰"
          variant="success"
          currencySymbol={formatAmount(1, displayCurrency)
            .replace("1.00", "")
            .trim()}
        />
        <SummaryCard
          title="Total Expenses"
          value={summaryData.totalExpenses}
          icon="💸"
          variant="error"
          currencySymbol={formatAmount(1, displayCurrency)
            .replace("1.00", "")
            .trim()}
        />
        <SummaryCard
          title="Current Balance"
          value={summaryData.currentBalance}
          icon={summaryData.currentBalance >= 0 ? "📈" : "📉"}
          variant={summaryData.currentBalance >= 0 ? "primary" : "warning"}
          currencySymbol={formatAmount(1, displayCurrency)
            .replace("1.00", "")
            .trim()}
        />
        <SummaryCard
          title="Income Sources"
          value={summaryData.incomeSources}
          icon="📊"
          variant="primary"
        />
      </div>

      {/* Chart Section */}
      <ExpenseChart
        data={pieData}
        title={`Expenses by Category (${activeFilter})`}
        currencySymbol={formatAmount(1, displayCurrency)
          .replace("1.00", "")
          .trim()}
      />

      {/* Forms and Lists Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Income Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income</h3>
            <IncomeForm
              editingIncome={editingIncome}
              onAddIncome={addIncome}
              onUpdateIncome={updateIncome}
              onCancelEdit={cancelEditIncome}
            />
            <div className="mt-6">
              <IncomeList
                incomes={filteredIncomes}
                onEdit={startEditIncome}
                onDelete={deleteIncome}
                displayCurrency={displayCurrency}
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
              onAddExpense={addExpense}
              onUpdateExpense={updateExpense}
              onCancelEdit={cancelEditExpense}
            />
            <div className="mt-6">
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={startEditExpense}
                onDelete={deleteExpense}
                displayCurrency={displayCurrency}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
