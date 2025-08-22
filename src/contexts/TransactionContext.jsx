import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  // Load data from localStorage or use defaults
  const [incomes, setIncomes] = useState(() => {
    const savedIncomes = localStorage.getItem("expansePro-incomes");
    if (savedIncomes) {
      return JSON.parse(savedIncomes);
    }
    return [
      {
        id: 1,
        source: "Salary",
        amount: 5000,
        date: new Date().toISOString(),
      },
      {
        id: 2,
        source: "Freelance",
        amount: 1200,
        date: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  });

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expansePro-expenses");
    if (savedExpenses) {
      return JSON.parse(savedExpenses);
    }
    return [
      {
        id: 1,
        title: "Groceries",
        amount: 150,
        category: "Food",
        date: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Gas",
        amount: 45,
        category: "Travel",
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        title: "Netflix Subscription",
        amount: 15,
        category: "Entertainment",
        date: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("expansePro-incomes", JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem("expansePro-expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Income CRUD operations
  const addIncome = (income) => {
    const newIncome = {
      ...income,
      id: Math.max(...incomes.map((i) => i.id), 0) + 1,
    };
    setIncomes((prev) => [...prev, newIncome]);
  };

  const updateIncome = (updatedIncome) => {
    setIncomes((prev) =>
      prev.map((income) =>
        income.id === updatedIncome.id ? updatedIncome : income
      )
    );
  };

  const deleteIncome = (incomeToDelete) => {
    setIncomes((prev) =>
      prev.filter((income) => income.id !== incomeToDelete.id)
    );
  };

  // Expense CRUD operations
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Math.max(...expenses.map((e) => e.id), 0) + 1,
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const deleteExpense = (expenseToDelete) => {
    setExpenses((prev) =>
      prev.filter((expense) => expense.id !== expenseToDelete.id)
    );
  };

  const value = {
    incomes,
    expenses,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

TransactionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
