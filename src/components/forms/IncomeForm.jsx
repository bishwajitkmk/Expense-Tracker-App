import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { useSettings } from "../../contexts/SettingsContext";
import { useCategories } from "../../contexts/CategoriesContext";
import { CurrencySelector } from "../ui";

const IncomeForm = ({
  onAddIncome,
  editingIncome,
  onUpdateIncome,
  onCancelEdit,
}) => {
  const { getCurrencyCode } = useSettings();
  const { getIncomeCategoryNames } = useCategories();
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [customSource, setCustomSource] = useState("");
  const [currency, setCurrency] = useState(getCurrencyCode());

  const incomeSources = getIncomeCategoryNames();

  useEffect(() => {
    if (editingIncome) {
      setSource(editingIncome.source || "");
      setAmount(editingIncome.amount || "");
      setDate(editingIncome.date ? new Date(editingIncome.date) : new Date());
      setCustomSource("");
      setCurrency(editingIncome.currency || getCurrencyCode());
    } else {
      setSource("");
      setAmount("");
      setDate(new Date());
      setCustomSource("");
      setCurrency(getCurrencyCode());
    }
  }, [editingIncome, getCurrencyCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalSource =
      source === "Other" && customSource ? customSource : source;

    if (editingIncome) {
      onUpdateIncome({
        ...editingIncome,
        source: finalSource,
        amount: parseFloat(amount),
        date,
        currency,
      });
    } else {
      onAddIncome({
        source: finalSource,
        amount: parseFloat(amount),
        date,
        currency,
        id: Math.random(),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-green-100 rounded-lg p-6 mb-8 space-y-4 shadow"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="source" className="font-medium text-green-700">
          Income Source
        </label>
        <select
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          required
        >
          <option value="">Select source</option>
          {incomeSources.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="font-medium text-green-700">
          Amount
        </label>
        <div className="flex space-x-3">
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
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
        <label htmlFor="date" className="font-medium text-green-700">
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
          className="border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
        />
      </div>

      {source === "Other" && (
        <div className="flex flex-col gap-2">
          <label htmlFor="customSource" className="font-medium text-green-700">
            Custom Source
          </label>
          <input
            id="customSource"
            type="text"
            placeholder="Enter custom income source"
            value={customSource}
            onChange={(e) => setCustomSource(e.target.value)}
            className="border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            required
          />
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className={`w-full px-4 py-2 rounded font-semibold ${
            editingIncome ? "bg-green-700" : "bg-green-600"
          } text-white hover:bg-green-800 focus:outline-none`}
        >
          {editingIncome ? "Update Income" : "Add Income"}
        </button>
        {editingIncome && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full px-4 py-2 rounded font-semibold bg-gray-200 text-green-700 hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

IncomeForm.propTypes = {
  onAddIncome: PropTypes.func,
  editingIncome: PropTypes.object,
  onUpdateIncome: PropTypes.func,
  onCancelEdit: PropTypes.func,
};

export default IncomeForm;
