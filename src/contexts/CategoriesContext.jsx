import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const CategoriesContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};

export const CategoriesProvider = ({ children }) => {
  // Load categories from localStorage or use defaults
  const [expenseCategories, setExpenseCategories] = useState(() => {
    const savedCategories = localStorage.getItem(
      "expansePro-expenseCategories"
    );
    if (savedCategories) {
      return JSON.parse(savedCategories);
    }
    return [
      { id: 1, name: "Food", color: "#3B82F6", icon: "🍽️" },
      { id: 2, name: "Travel", color: "#10B981", icon: "✈️" },
      { id: 3, name: "Utilities", color: "#F59E0B", icon: "⚡" },
      { id: 4, name: "Shopping", color: "#8B5CF6", icon: "🛍️" },
      { id: 5, name: "Health", color: "#EF4444", icon: "🏥" },
      { id: 6, name: "Entertainment", color: "#EC4899", icon: "🎬" },
      { id: 7, name: "Other", color: "#6B7280", icon: "📦" },
    ];
  });

  const [incomeCategories, setIncomeCategories] = useState(() => {
    const savedCategories = localStorage.getItem("expansePro-incomeCategories");
    if (savedCategories) {
      return JSON.parse(savedCategories);
    }
    return [
      { id: 1, name: "Salary", color: "#10B981", icon: "💰" },
      { id: 2, name: "Freelance", color: "#3B82F6", icon: "💼" },
      { id: 3, name: "Investment", color: "#F59E0B", icon: "📈" },
      { id: 4, name: "Business", color: "#8B5CF6", icon: "🏢" },
      { id: 5, name: "Other", color: "#6B7280", icon: "📦" },
    ];
  });

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "expansePro-expenseCategories",
      JSON.stringify(expenseCategories)
    );
  }, [expenseCategories]);

  useEffect(() => {
    localStorage.setItem(
      "expansePro-incomeCategories",
      JSON.stringify(incomeCategories)
    );
  }, [incomeCategories]);

  // Expense Categories CRUD operations
  const addExpenseCategory = (category) => {
    const newCategory = {
      ...category,
      id: Math.max(...expenseCategories.map((c) => c.id), 0) + 1,
    };
    setExpenseCategories((prev) => [...prev, newCategory]);
  };

  const updateExpenseCategory = (updatedCategory) => {
    setExpenseCategories((prev) =>
      prev.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  const deleteExpenseCategory = (categoryToDelete) => {
    setExpenseCategories((prev) =>
      prev.filter((category) => category.id !== categoryToDelete.id)
    );
  };

  // Income Categories CRUD operations
  const addIncomeCategory = (category) => {
    const newCategory = {
      ...category,
      id: Math.max(...incomeCategories.map((c) => c.id), 0) + 1,
    };
    setIncomeCategories((prev) => [...prev, newCategory]);
  };

  const updateIncomeCategory = (updatedCategory) => {
    setIncomeCategories((prev) =>
      prev.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  const deleteIncomeCategory = (categoryToDelete) => {
    setIncomeCategories((prev) =>
      prev.filter((category) => category.id !== categoryToDelete.id)
    );
  };

  // Helper functions
  const getExpenseCategoryNames = () =>
    expenseCategories.map((cat) => cat.name);
  const getIncomeCategoryNames = () => incomeCategories.map((cat) => cat.name);

  const getExpenseCategoryByName = (name) =>
    expenseCategories.find((cat) => cat.name === name);

  const getIncomeCategoryByName = (name) =>
    incomeCategories.find((cat) => cat.name === name);

  const value = {
    expenseCategories,
    incomeCategories,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    addIncomeCategory,
    updateIncomeCategory,
    deleteIncomeCategory,
    getExpenseCategoryNames,
    getIncomeCategoryNames,
    getExpenseCategoryByName,
    getIncomeCategoryByName,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

CategoriesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
