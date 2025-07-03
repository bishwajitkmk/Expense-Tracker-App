/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { format, subMonths, isAfter } from "date-fns";

const Transactions = ({
  incomes = [],
  expenses = [],
  currencySymbol = "$",
}) => {
  // Combine and sort transactions by date (desc)
  const sixMonthsAgo = subMonths(new Date(), 6);
  const allTransactions = [
    ...incomes.map((inc) => ({ ...inc, type: "income" })),
    ...expenses.map((exp) => ({ ...exp, type: "expense" })),
  ]
    .filter((t) => t.date && isAfter(new Date(t.date), sixMonthsAgo))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-blue-200 flex">
      <div className="flex-1 flex flex-col items-center p-10 ml-64">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-8 text-center">
            Transaction History (Last 6 Months)
          </h1>
          {allTransactions.length === 0 ? (
            <p className="text-center text-blue-400">
              No transactions in the last six months.
            </p>
          ) : (
            <ul className="divide-y divide-blue-100">
              {allTransactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-2"
                >
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-xs text-blue-400 w-32">
                      {format(new Date(tx.date), "PPpp")}
                    </span>
                    <span className="font-medium w-40 truncate">
                      {tx.title}
                    </span>
                    <span className="text-xs w-32 truncate">
                      {tx.type === "income"
                        ? `Source: ${tx.source}`
                        : `Category: ${tx.category}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-bold text-lg ${
                        tx.type === "income" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {currencySymbol}
                      {tx.amount}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        tx.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
