import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const IncomeForm = ({
  onAddIncome,
  editingIncome,
  onUpdateIncome,
  onCancelEdit,
  sources = [],
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [source, setSource] = useState(sources[0] || "");
  const [customSource, setCustomSource] = useState("");

  useEffect(() => {
    if (editingIncome) {
      setTitle(editingIncome.title || "");
      setAmount(editingIncome.amount || "");
      setDate(editingIncome.date ? new Date(editingIncome.date) : new Date());
      setSource(editingIncome.source || sources[0] || "");
      setCustomSource("");
    } else {
      setTitle("");
      setAmount("");
      setDate(new Date());
      setSource(sources[0] || "");
      setCustomSource("");
    }
  }, [editingIncome, sources]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalSource =
      source === "Other" && customSource ? customSource : source;
    if (editingIncome) {
      onUpdateIncome({
        ...editingIncome,
        title,
        amount: parseFloat(amount),
        date,
        source: finalSource,
      });
    } else {
      onAddIncome({
        title,
        amount: parseFloat(amount),
        date,
        source: finalSource,
        id: Math.random(),
      });
    }
    // Reset handled by useEffect
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
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="source" className="font-medium text-blue-700">
          Source
        </label>
        <select
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          {sources.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>
        {source === "Other" && (
          <input
            type="text"
            placeholder="Custom source"
            value={customSource}
            onChange={(e) => setCustomSource(e.target.value)}
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
            editingIncome ? "bg-blue-700" : "bg-blue-600"
          } text-white hover:bg-blue-800 focus:outline-none`}
        >
          {editingIncome ? "Update Income" : "Add Income"}
        </button>
        {editingIncome && (
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

export default IncomeForm;
