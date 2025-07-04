import { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#60a5fa",
  "#1e40af",
  "#93c5fd",
  "#3b82f6",
  "#1d4ed8",
  "#6366f1",
  "#8b5cf6",
];

const defaultExpenseCategories = [
  "Rent",
  "Utilities",
  "Groceries",
  "Education Fees",
  "Medical",
  "Transport",
  "Entertainment",
  "Other",
];

export default function FamilyPlanning() {
  const { getCurrencySymbol, getFontSizeClass } = useSettings();
  const currencySymbol = getCurrencySymbol();

  const [scenario, setScenario] = useState("single");
  const [people, setPeople] = useState([{ name: "", income: "" }]);
  const [expenses, setExpenses] = useState([]);
  const [expenseInput, setExpenseInput] = useState({
    name: "",
    category: defaultExpenseCategories[0],
    amount: "",
  });

  // Bills system
  const [bills, setBills] = useState([]);
  const [billInput, setBillInput] = useState({
    name: "",
    amount: "",
    dueDate: "",
    frequency: "Monthly",
    paid: false,
    responsible: scenario === "multi" ? people[0]?.name || "" : "",
  });

  // Credits system
  const [credits, setCredits] = useState([]);
  const [creditInput, setCreditInput] = useState({
    name: "",
    amount: "",
    date: "",
    from: scenario === "multi" ? people[0]?.name || "" : "",
    to: scenario === "multi" ? people[1]?.name || "" : "",
    status: "pending",
  });

  // Handle scenario change
  const handleScenarioChange = (val) => {
    setScenario(val);
    if (val === "single") {
      setPeople([{ name: "", income: "" }]);
    } else {
      setPeople([
        { name: "", income: "" },
        { name: "", income: "" },
      ]);
    }
  };

  // Handle people income change
  const handlePersonChange = (idx, field, value) => {
    setPeople((people) =>
      people.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  // Add/remove people
  const addPerson = () => setPeople([...people, { name: "", income: "" }]);
  const removePerson = (idx) =>
    setPeople((people) => people.filter((_, i) => i !== idx));

  // Handle expense input
  const handleExpenseInput = (field, value) =>
    setExpenseInput((e) => ({ ...e, [field]: value }));
  const addExpense = () => {
    if (!expenseInput.name || !expenseInput.amount) return;
    setExpenses([
      ...expenses,
      { ...expenseInput, amount: parseFloat(expenseInput.amount) },
    ]);
    setExpenseInput({
      name: "",
      category: defaultExpenseCategories[0],
      amount: "",
    });
  };
  const removeExpense = (idx) =>
    setExpenses((expenses) => expenses.filter((_, i) => i !== idx));

  // Bill handlers
  const handleBillInput = (field, value) =>
    setBillInput((b) => ({ ...b, [field]: value }));
  const addBill = () => {
    if (!billInput.name || !billInput.amount || !billInput.dueDate) return;
    setBills([
      ...bills,
      { ...billInput, amount: parseFloat(billInput.amount) },
    ]);
    setBillInput({
      name: "",
      amount: "",
      dueDate: "",
      frequency: "Monthly",
      paid: false,
      responsible: scenario === "multi" ? people[0]?.name || "" : "",
    });
  };
  const removeBill = (idx) => setBills((b) => b.filter((_, i) => i !== idx));
  const toggleBillPaid = (idx) =>
    setBills((b) =>
      b.map((bill, i) => (i === idx ? { ...bill, paid: !bill.paid } : bill))
    );

  // Credit handlers
  const handleCreditInput = (field, value) =>
    setCreditInput((c) => ({ ...c, [field]: value }));
  const addCredit = () => {
    if (!creditInput.name || !creditInput.amount || !creditInput.date) return;
    setCredits([
      ...credits,
      { ...creditInput, amount: parseFloat(creditInput.amount) },
    ]);
    setCreditInput({
      name: "",
      amount: "",
      date: "",
      from: scenario === "multi" ? people[0]?.name || "" : "",
      to: scenario === "multi" ? people[1]?.name || "" : "",
      status: "pending",
    });
  };
  const removeCredit = (idx) =>
    setCredits((c) => c.filter((_, i) => i !== idx));
  const markCreditReceived = (idx) =>
    setCredits((c) =>
      c.map((credit, i) =>
        i === idx ? { ...credit, status: "received" } : credit
      )
    );

  // Calculations
  const totalIncome = people.reduce(
    (sum, p) => sum + (parseFloat(p.income) || 0),
    0
  );
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalBills = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalCredits = credits.reduce((sum, c) => sum + (c.amount || 0), 0);
  const balance = totalIncome - totalExpenses - totalBills + totalCredits;

  // Pie chart data
  const expenseChartData = defaultExpenseCategories
    .map((cat) => ({
      name: cat,
      value: expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + (e.amount || 0), 0),
    }))
    .filter((item) => item.value > 0);
  const billsChartData = bills.map((b) => ({ name: b.name, value: b.amount }));
  const creditsChartData = credits.map((c) => ({
    name: c.name,
    value: c.amount,
  }));

  return (
    <div className={`p-8 min-h-screen ${getFontSizeClass()}`}>
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Family Planning
        </h1>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 text-blue-900 p-4 rounded-lg">
            <p className="text-sm">Total Income</p>
            <p className="text-2xl font-bold">
              {currencySymbol}
              {totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-100 text-red-900 p-4 rounded-lg">
            <p className="text-sm">Total Expenses</p>
            <p className="text-2xl font-bold">
              {currencySymbol}
              {totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="bg-yellow-100 text-yellow-900 p-4 rounded-lg">
            <p className="text-sm">Total Bills</p>
            <p className="text-2xl font-bold">
              {currencySymbol}
              {totalBills.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-100 text-green-900 p-4 rounded-lg">
            <p className="text-sm">Total Credits</p>
            <p className="text-2xl font-bold">
              {currencySymbol}
              {totalCredits.toLocaleString()}
            </p>
          </div>
        </div>
        {/* Net Balance */}
        <div
          className={`mb-8 p-4 rounded-lg text-xl font-bold ${
            balance >= 0
              ? "bg-green-50 text-green-800"
              : "bg-orange-50 text-orange-800"
          }`}
        >
          Net Family Balance: {currencySymbol}
          {balance.toLocaleString()}
        </div>
        {/* Scenario Selection */}
        <div className="mb-6 flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
              scenario === "single"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleScenarioChange("single")}
          >
            Single Income
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
              scenario === "multi"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleScenarioChange("multi")}
          >
            Multi-Person Income
          </button>
        </div>
        {/* Income Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Family Income</h2>
          {people.map((person, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              {scenario === "multi" && (
                <input
                  type="text"
                  placeholder="Name"
                  value={person.name}
                  onChange={(e) =>
                    handlePersonChange(idx, "name", e.target.value)
                  }
                  className="border border-gray-300 rounded px-3 py-2 flex-1"
                />
              )}
              <input
                type="number"
                min="0"
                placeholder="Income Amount"
                value={person.income}
                onChange={(e) =>
                  handlePersonChange(idx, "income", e.target.value)
                }
                className="border border-gray-300 rounded px-3 py-2 flex-1"
              />
              {scenario === "multi" && people.length > 2 && (
                <button
                  onClick={() => removePerson(idx)}
                  className="text-red-500 hover:underline ml-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {scenario === "multi" && (
            <button
              onClick={addPerson}
              className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Add Person
            </button>
          )}
        </div>
        {/* Expenses Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Family Expenses</h2>
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Expense Name"
              value={expenseInput.name}
              onChange={(e) => handleExpenseInput("name", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <select
              value={expenseInput.category}
              onChange={(e) => handleExpenseInput("category", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            >
              {defaultExpenseCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              placeholder="Amount"
              value={expenseInput.amount}
              onChange={(e) => handleExpenseInput("amount", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <button
              onClick={addExpense}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {expenses.map((exp, idx) => (
              <li key={idx} className="flex items-center justify-between py-2">
                <div>
                  <span className="font-medium text-gray-900">{exp.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({exp.category})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">
                    {currencySymbol}
                    {exp.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeExpense(idx)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Bills Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Family Bills</h2>
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Bill Name"
              value={billInput.name}
              onChange={(e) => handleBillInput("name", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <input
              type="number"
              min="0"
              placeholder="Amount"
              value={billInput.amount}
              onChange={(e) => handleBillInput("amount", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <input
              type="date"
              value={billInput.dueDate}
              onChange={(e) => handleBillInput("dueDate", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <select
              value={billInput.frequency}
              onChange={(e) => handleBillInput("frequency", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            >
              <option>Monthly</option>
              <option>Yearly</option>
              <option>One-Time</option>
            </select>
            {scenario === "multi" && (
              <select
                value={billInput.responsible}
                onChange={(e) => handleBillInput("responsible", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 flex-1"
              >
                {people.map((p, i) => (
                  <option key={i}>{p.name || `Person ${i + 1}`}</option>
                ))}
              </select>
            )}
            <button
              onClick={addBill}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Bill
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {bills.length === 0 && (
              <li className="text-gray-400 py-2">No bills yet.</li>
            )}
            {bills.map((bill, idx) => (
              <li key={idx} className="flex items-center justify-between py-2">
                <div>
                  <span className="font-semibold text-gray-900">
                    {bill.name}
                  </span>{" "}
                  - {currencySymbol}
                  {bill.amount.toLocaleString()} - Due: {bill.dueDate} -{" "}
                  {bill.frequency}
                  {scenario === "multi" && bill.responsible && (
                    <span className="ml-2 text-xs text-blue-700">
                      ({bill.responsible})
                    </span>
                  )}
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded ${
                      bill.paid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {bill.paid ? "Paid" : "Unpaid"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBillPaid(idx)}
                    className="text-green-700 hover:underline"
                  >
                    {bill.paid ? "Mark Unpaid" : "Mark Paid"}
                  </button>
                  <button
                    onClick={() => removeBill(idx)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Credits Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Family Credits</h2>
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Credit Name"
              value={creditInput.name}
              onChange={(e) => handleCreditInput("name", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <input
              type="number"
              min="0"
              placeholder="Amount"
              value={creditInput.amount}
              onChange={(e) => handleCreditInput("amount", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <input
              type="date"
              value={creditInput.date}
              onChange={(e) => handleCreditInput("date", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            {scenario === "multi" && (
              <>
                <select
                  value={creditInput.from}
                  onChange={(e) => handleCreditInput("from", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 flex-1"
                >
                  {people.map((p, i) => (
                    <option key={i}>{p.name || `Person ${i + 1}`}</option>
                  ))}
                </select>
                <select
                  value={creditInput.to}
                  onChange={(e) => handleCreditInput("to", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 flex-1"
                >
                  {people.map((p, i) => (
                    <option key={i}>{p.name || `Person ${i + 1}`}</option>
                  ))}
                </select>
              </>
            )}
            <select
              value={creditInput.status}
              onChange={(e) => handleCreditInput("status", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            >
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="paid">Paid</option>
            </select>
            <button
              onClick={addCredit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Credit
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {credits.length === 0 && (
              <li className="text-gray-400 py-2">No credits yet.</li>
            )}
            {credits.map((credit, idx) => (
              <li key={idx} className="flex items-center justify-between py-2">
                <div>
                  <span className="font-semibold text-gray-900">
                    {credit.name}
                  </span>{" "}
                  - {currencySymbol}
                  {credit.amount.toLocaleString()} - {credit.date}
                  {scenario === "multi" && (
                    <span className="ml-2 text-xs text-blue-700">
                      ({credit.from} → {credit.to})
                    </span>
                  )}
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded ${
                      credit.status === "received"
                        ? "bg-green-100 text-green-700"
                        : credit.status === "paid"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {credit.status.charAt(0).toUpperCase() +
                      credit.status.slice(1)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markCreditReceived(idx)}
                    className="text-green-700 hover:underline"
                  >
                    Mark Received
                  </button>
                  <button
                    onClick={() => removeCredit(idx)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#2563eb"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Bills & Credits Breakdown
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[...billsChartData, ...creditsChartData]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#6366f1"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
