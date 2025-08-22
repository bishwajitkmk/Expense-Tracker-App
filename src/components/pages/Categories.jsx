import { useState, useMemo } from "react";
import { useCategories } from "../../contexts/CategoriesContext";
import { useTransactions } from "../../contexts/TransactionContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import PageHeader from "../layout/PageHeader";
import CategoryForm from "../forms/CategoryForm";
import CategoryCard from "../lists/CategoryCard";

const Categories = () => {
  const { getCurrencyCode } = useSettings();
  const { convertAmount } = useExchangeRate();
  const { incomes, expenses } = useTransactions();
  const {
    expenseCategories,
    incomeCategories,
    addExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    addIncomeCategory,
    updateIncomeCategory,
    deleteIncomeCategory,
  } = useCategories();

  const displayCurrency = getCurrencyCode();
  const [activeTab, setActiveTab] = useState("expense");
  const [editingExpenseCategory, setEditingExpenseCategory] = useState(null);
  const [editingIncomeCategory, setEditingIncomeCategory] = useState(null);

  // Calculate category usage statistics
  const categoryStats = useMemo(() => {
    const stats = {
      expense: {},
      income: {},
    };

    // Calculate expense category stats
    expenseCategories.forEach((category) => {
      const categoryExpenses = expenses.filter(
        (expense) => expense.category === category.name
      );

      const totalAmount = categoryExpenses.reduce((sum, expense) => {
        const convertedAmount = convertAmount(
          expense.amount || 0,
          expense.currency || "USD",
          displayCurrency
        );
        return sum + convertedAmount;
      }, 0);

      stats.expense[category.name] = {
        count: categoryExpenses.length,
        totalAmount,
      };
    });

    // Calculate income category stats
    incomeCategories.forEach((category) => {
      const categoryIncomes = incomes.filter(
        (income) => income.source === category.name
      );

      const totalAmount = categoryIncomes.reduce((sum, income) => {
        const convertedAmount = convertAmount(
          income.amount || 0,
          income.currency || "USD",
          displayCurrency
        );
        return sum + convertedAmount;
      }, 0);

      stats.income[category.name] = {
        count: categoryIncomes.length,
        totalAmount,
      };
    });

    return stats;
  }, [
    expenseCategories,
    incomeCategories,
    expenses,
    incomes,
    convertAmount,
    displayCurrency,
  ]);

  // Handle expense category operations
  const handleAddExpenseCategory = (categoryData) => {
    addExpenseCategory(categoryData);
  };

  const handleUpdateExpenseCategory = (updatedCategory) => {
    updateExpenseCategory(updatedCategory);
    setEditingExpenseCategory(null);
  };

  const handleDeleteExpenseCategory = (categoryToDelete) => {
    deleteExpenseCategory(categoryToDelete);
  };

  const handleEditExpenseCategory = (category) => {
    setEditingExpenseCategory(category);
  };

  const handleCancelEditExpense = () => {
    setEditingExpenseCategory(null);
  };

  // Handle income category operations
  const handleAddIncomeCategory = (categoryData) => {
    addIncomeCategory(categoryData);
  };

  const handleUpdateIncomeCategory = (updatedCategory) => {
    updateIncomeCategory(updatedCategory);
    setEditingIncomeCategory(null);
  };

  const handleDeleteIncomeCategory = (categoryToDelete) => {
    deleteIncomeCategory(categoryToDelete);
  };

  const handleEditIncomeCategory = (category) => {
    setEditingIncomeCategory(category);
  };

  const handleCancelEditIncome = () => {
    setEditingIncomeCategory(null);
  };

  return (
    <div className="p-8 min-h-screen">
      <PageHeader
        title="Categories"
        subtitle="Manage your expense and income categories"
      />

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("expense")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "expense"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              💸 Expense Categories ({expenseCategories.length})
            </button>
            <button
              onClick={() => setActiveTab("income")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "income"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              💰 Income Categories ({incomeCategories.length})
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Form */}
        <div className="lg:col-span-1">
          {activeTab === "expense" ? (
            <CategoryForm
              onAddCategory={handleAddExpenseCategory}
              editingCategory={editingExpenseCategory}
              onUpdateCategory={handleUpdateExpenseCategory}
              onCancelEdit={handleCancelEditExpense}
              categoryType="expense"
            />
          ) : (
            <CategoryForm
              onAddCategory={handleAddIncomeCategory}
              editingCategory={editingIncomeCategory}
              onUpdateCategory={handleUpdateIncomeCategory}
              onCancelEdit={handleCancelEditIncome}
              categoryType="income"
            />
          )}
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {activeTab === "expense" ? "Expense" : "Income"} Categories
            </h3>

            {activeTab === "expense" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expenseCategories.length === 0 ? (
                  <p className="text-gray-500 text-center col-span-2 py-8">
                    No expense categories yet. Create your first one!
                  </p>
                ) : (
                  expenseCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={handleEditExpenseCategory}
                      onDelete={handleDeleteExpenseCategory}
                      usageCount={
                        categoryStats.expense[category.name]?.count || 0
                      }
                      totalAmount={
                        categoryStats.expense[category.name]?.totalAmount || 0
                      }
                      currency={displayCurrency}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomeCategories.length === 0 ? (
                  <p className="text-gray-500 text-center col-span-2 py-8">
                    No income categories yet. Create your first one!
                  </p>
                ) : (
                  incomeCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={handleEditIncomeCategory}
                      onDelete={handleDeleteIncomeCategory}
                      usageCount={
                        categoryStats.income[category.name]?.count || 0
                      }
                      totalAmount={
                        categoryStats.income[category.name]?.totalAmount || 0
                      }
                      currency={displayCurrency}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Total Categories</p>
              <p className="text-2xl font-bold">
                {expenseCategories.length + incomeCategories.length}
              </p>
            </div>
            <div className="text-3xl opacity-80">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                Expense Categories
              </p>
              <p className="text-2xl font-bold">{expenseCategories.length}</p>
            </div>
            <div className="text-3xl opacity-80">💸</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                Income Categories
              </p>
              <p className="text-2xl font-bold">{incomeCategories.length}</p>
            </div>
            <div className="text-3xl opacity-80">💰</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
