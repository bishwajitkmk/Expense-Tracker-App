import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { useSettings } from "../../contexts/SettingsContext";
import { useCategories } from "../../contexts/CategoriesContext";
import { CurrencySelector } from "../ui";

const ExpenseForm = ({
  onAddExpense,
  editingExpense,
  onUpdateExpense,
  onCancelEdit,
  categories = [],
}) => {
  const { getCurrencyCode } = useSettings();
  const { getExpenseCategoryNames } = useCategories();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState(categories[0] || "");
  const [customCategory, setCustomCategory] = useState("");
  const [currency, setCurrency] = useState(getCurrencyCode());

  // Use categories from context if not provided as prop
  const availableCategories =
    categories.length > 0 ? categories : getExpenseCategoryNames();

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || "");
      setAmount(editingExpense.amount || "");
      setDate(editingExpense.date ? new Date(editingExpense.date) : new Date());
      setCategory(editingExpense.category || availableCategories[0] || "");
      setCustomCategory("");
      setCurrency(editingExpense.currency || getCurrencyCode());
    } else {
      setTitle("");
      setAmount("");
      setDate(new Date());
      setCategory(availableCategories[0] || "");
      setCustomCategory("");
      setCurrency(getCurrencyCode());
    }
  }, [editingExpense, availableCategories, getCurrencyCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCategory =
      category === "Other" && customCategory ? customCategory : category;

    if (editingExpense) {
      onUpdateExpense({
        ...editingExpense,
        title,
        amount: parseFloat(amount),
        date,
        category: finalCategory,
        currency,
      });
    } else {
      onAddExpense({
        title,
        amount: parseFloat(amount),
        date,
        category: finalCategory,
        currency,
        id: Math.random(),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-blue-100 rounded-lg p-6 mb-8 space-y-4 shadow"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-medium text-blue-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="font-medium text-blue-700">
          Amount
        </label>
        <div className="flex space-x-3">
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
          <CurrencySelector
            value={currency}
            onChange={setCurrency}
            className="w-32"
            size="md"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="font-medium text-blue-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {category === "Other" && (
          <input
            type="text"
            placeholder="Custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white mt-2"
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="date" className="font-medium text-blue-700">
          Date & Time
        </label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className={`w-full px-4 py-2 rounded font-semibold ${
            editingExpense ? "bg-blue-700" : "bg-blue-600"
          } text-white hover:bg-blue-800 focus:outline-none`}
        >
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>
        {editingExpense && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full px-4 py-2 rounded font-semibold bg-gray-200 text-blue-700 hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

ExpenseForm.propTypes = {
  onAddExpense: PropTypes.func,
  editingExpense: PropTypes.object,
  onUpdateExpense: PropTypes.func,
  onCancelEdit: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.string),
};

export default ExpenseForm;
