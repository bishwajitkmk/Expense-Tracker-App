import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useSettings } from "../../contexts/SettingsContext";
import { useTransactions } from "../../contexts/TransactionContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import PageHeader from "../layout/PageHeader";

const Transactions = () => {
  const { getCurrencyCode } = useSettings();
  const { convertAmount, formatAmount } = useExchangeRate();
  const { incomes, expenses } = useTransactions();
  const displayCurrency = getCurrencyCode();

  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const filters = ["All", "Income", "Expenses"];

  // Combine and format transactions with currency conversion
  const allTransactions = useMemo(() => {
    const incomeTransactions = incomes.map((income) => {
      const convertedAmount = convertAmount(
        income.amount || 0,
        income.currency || "USD",
        displayCurrency
      );

      return {
        ...income,
        type: "income",
        displayAmount: convertedAmount,
        displayTitle: income.source,
        category: income.source,
        originalAmount: income.amount,
        originalCurrency: income.currency || "USD",
      };
    });

    const expenseTransactions = expenses.map((expense) => {
      const convertedAmount = convertAmount(
        expense.amount || 0,
        expense.currency || "USD",
        displayCurrency
      );

      return {
        ...expense,
        type: "expense",
        displayAmount: -convertedAmount,
        displayTitle: expense.title,
        category: expense.category,
        originalAmount: expense.amount,
        originalCurrency: expense.currency || "USD",
      };
    });

    return [...incomeTransactions, ...expenseTransactions];
  }, [incomes, expenses, convertAmount, displayCurrency]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;

    // Filter by type
    if (activeFilter === "Income") {
      filtered = filtered.filter((t) => t.type === "income");
    } else if (activeFilter === "Expenses") {
      filtered = filtered.filter((t) => t.type === "expense");
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.displayTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allTransactions, activeFilter, searchTerm]);

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(b.date) - new Date(a.date);
          break;
        case "amount":
          comparison = Math.abs(b.displayAmount) - Math.abs(a.displayAmount);
          break;
        case "title":
          comparison = a.displayTitle.localeCompare(b.displayTitle);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "desc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredTransactions, sortBy, sortOrder]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.displayAmount), 0);

    const totalExpenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.displayAmount), 0);

    const netAmount = totalIncome - totalExpenses;
    const transactionCount = filteredTransactions.length;

    return { totalIncome, totalExpenses, netAmount, transactionCount };
  }, [filteredTransactions]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="p-8 min-h-screen">
      <PageHeader
        title="Transactions"
        subtitle="View and manage all your transactions"
      />

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            {filters.map((filter) => (
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

          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
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
                {formatAmount(summaryStats.totalIncome, displayCurrency)}
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
                {formatAmount(summaryStats.totalExpenses, displayCurrency)}
              </p>
            </div>
            <div className="text-3xl opacity-80">💸</div>
          </div>
        </div>

        <div
          className={`bg-gradient-to-r rounded-lg shadow-lg p-6 ${
            summaryStats.netAmount >= 0
              ? "from-blue-500 to-blue-600 text-white"
              : "from-orange-500 to-orange-600 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Net Amount</p>
              <p className="text-2xl font-bold">
                {formatAmount(summaryStats.netAmount, displayCurrency)}
              </p>
            </div>
            <div className="text-3xl opacity-80">
              {summaryStats.netAmount >= 0 ? "📈" : "📉"}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Transactions</p>
              <p className="text-2xl font-bold">
                {summaryStats.transactionCount}
              </p>
            </div>
            <div className="text-3xl opacity-80">📊</div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <span>{getSortIcon("date")}</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Description</span>
                    <span>{getSortIcon("title")}</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    <span>{getSortIcon("category")}</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    <span>{getSortIcon("amount")}</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                sortedTransactions.map((transaction) => (
                  <tr
                    key={`${transaction.type}-${transaction.id}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                      <div className="text-xs text-gray-500">
                        {format(new Date(transaction.date), "h:mm a")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.displayTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`font-semibold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatAmount(
                          Math.abs(transaction.displayAmount),
                          displayCurrency
                        )}
                      </span>
                      {transaction.originalCurrency &&
                        transaction.originalCurrency !== displayCurrency && (
                          <div className="text-xs text-gray-500 mt-1">
                            Original:{" "}
                            {formatAmount(
                              transaction.originalAmount,
                              transaction.originalCurrency
                            )}
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type === "income"
                          ? "💰 Income"
                          : "💸 Expense"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
