/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  format,
  subMonths,
  isAfter,
  isWithinInterval,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useSettings } from "../contexts/SettingsContext";

const Transactions = ({
  incomes = [],
  expenses = [],
}) => {
  const { getCurrencySymbol, getFontSizeClass } = useSettings();
  const currencySymbol = getCurrencySymbol();

  const [activeFilter, setActiveFilter] = useState("All");
  const [transactionType, setTransactionType] = useState("All");

  const FILTERS = ["All", "Today", "This Week", "This Month", "Last 6 Months"];
  const TYPE_FILTERS = ["All", "Income", "Expense"];

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
    } else if (filter === "Last 6 Months") {
      return [subMonths(now, 6), now];
    }
    return [null, null];
  };

  // Filter transactions based on date and type
  const [start, end] = getDateRange(activeFilter);
  let allTransactions = [
    ...incomes.map((inc) => ({ ...inc, type: "income" })),
    ...expenses.map((exp) => ({ ...exp, type: "expense" })),
  ];

  // Apply date filter
  if (start && end) {
    allTransactions = allTransactions.filter(
      (t) => t.date && isWithinInterval(new Date(t.date), { start, end })
    );
  }

  // Apply type filter
  if (transactionType !== "All") {
    allTransactions = allTransactions.filter(
      (t) => t.type === transactionType.toLowerCase()
    );
  }

  // Sort by date (newest first)
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate totals
  const totalIncome = allTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpenses = allTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const netAmount = totalIncome - totalExpenses;

  return (
    <div className={`p-8 min-h-screen ${getFontSizeClass()}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transaction History
          </h1>
          <p className="text-gray-600">
            View and manage all your financial transactions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              netAmount >= 0
                ? "from-blue-500 to-blue-600 text-white"
                : "from-orange-500 to-orange-600 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Net Amount</p>
                <p className="text-2xl font-bold">
                  {currencySymbol}
                  {netAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-3xl opacity-80">
                {netAmount >= 0 ? "📈" : "📉"}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <div className="flex gap-2 flex-wrap">
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
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

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="flex gap-2">
                {TYPE_FILTERS.map((type) => (
                  <button
                    key={type}
                    onClick={() => setTransactionType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      transactionType === type
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          {allTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">
                No transactions found for the selected filters.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters or add some transactions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 mb-2 sm:mb-0">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          tx.type === "income" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-500 font-medium">
                        {format(new Date(tx.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {tx.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {tx.type === "income"
                          ? `Source: ${tx.source}`
                          : `Category: ${tx.category}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold text-lg ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {currencySymbol}
                      {tx.amount?.toLocaleString()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
