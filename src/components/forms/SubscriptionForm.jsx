import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import { useSettings } from "../../contexts/SettingsContext";
import { useCategories } from "../../contexts/CategoriesContext";
import { CurrencySelector } from "../ui";

const SubscriptionForm = ({
  onAddSubscription,
  editingSubscription,
  onUpdateSubscription,
  onCancelEdit,
}) => {
  const { getCurrencyCode } = useSettings();
  const { getExpenseCategoryNames } = useCategories();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(getCurrencyCode());
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [nextBillingDate, setNextBillingDate] = useState(new Date());
  const [category, setCategory] = useState("Entertainment");
  const [status, setStatus] = useState("active");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [autoRenew, setAutoRenew] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const nameInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const availableCategories = getExpenseCategoryNames();
  const billingCycles = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  // Popular subscription suggestions with basic plan prices
  const subscriptionSuggestions = [
    {
      name: "Netflix",
      amount: 15.99,
      category: "Entertainment",
      website: "https://netflix.com",
    },
    {
      name: "Amazon Prime",
      amount: 12.99,
      category: "Shopping",
      website: "https://amazon.com/prime",
    },
    {
      name: "Spotify Premium",
      amount: 9.99,
      category: "Entertainment",
      website: "https://spotify.com",
    },
    {
      name: "Disney+",
      amount: 7.99,
      category: "Entertainment",
      website: "https://disneyplus.com",
    },
    {
      name: "YouTube Premium",
      amount: 11.99,
      category: "Entertainment",
      website: "https://youtube.com/premium",
    },
    {
      name: "Adobe Creative Cloud",
      amount: 52.99,
      category: "Software",
      website: "https://adobe.com/creativecloud",
    },
    {
      name: "Microsoft 365",
      amount: 6.99,
      category: "Software",
      website: "https://microsoft365.com",
    },
    {
      name: "Apple One",
      amount: 16.95,
      category: "Entertainment",
      website: "https://apple.com/apple-one",
    },
    {
      name: "Hulu",
      amount: 7.99,
      category: "Entertainment",
      website: "https://hulu.com",
    },
    {
      name: "HBO Max",
      amount: 15.99,
      category: "Entertainment",
      website: "https://hbomax.com",
    },
    {
      name: "Crunchyroll",
      amount: 7.99,
      category: "Entertainment",
      website: "https://crunchyroll.com",
    },
    {
      name: "Dropbox",
      amount: 9.99,
      category: "Software",
      website: "https://dropbox.com",
    },
    {
      name: "Zoom Pro",
      amount: 14.99,
      category: "Software",
      website: "https://zoom.us",
    },
    {
      name: "Grammarly Premium",
      amount: 12.0,
      category: "Software",
      website: "https://grammarly.com",
    },
    {
      name: "Canva Pro",
      amount: 12.99,
      category: "Software",
      website: "https://canva.com",
    },
  ];

  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name || "");
      setAmount(editingSubscription.amount || "");
      setCurrency(editingSubscription.currency || getCurrencyCode());
      setBillingCycle(editingSubscription.billingCycle || "monthly");
      setNextBillingDate(
        editingSubscription.nextBillingDate
          ? new Date(editingSubscription.nextBillingDate)
          : new Date()
      );
      setCategory(editingSubscription.category || "Entertainment");
      setStatus(editingSubscription.status || "active");
      setDescription(editingSubscription.description || "");
      setWebsite(editingSubscription.website || "");
      setAutoRenew(editingSubscription.autoRenew !== false);
      setReminderDays(editingSubscription.reminderDays || 3);
    } else {
      setName("");
      setAmount("");
      setCurrency(getCurrencyCode());
      setBillingCycle("monthly");
      setNextBillingDate(new Date());
      setCategory("Entertainment");
      setStatus("active");
      setDescription("");
      setWebsite("");
      setAutoRenew(true);
      setReminderDays(3);
    }
  }, [editingSubscription, getCurrencyCode]);

  // Filter suggestions based on input
  useEffect(() => {
    if (name.trim()) {
      const filtered = subscriptionSuggestions.filter((suggestion) =>
        suggestion.name.toLowerCase().includes(name.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions(subscriptionSuggestions);
      setShowSuggestions(false);
    }
  }, [name]);

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setName(suggestion.name);
    setAmount(suggestion.amount.toString());
    setCategory(suggestion.category);
    setWebsite(suggestion.website);
    setShowSuggestions(false);
    nameInputRef.current?.focus();
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !nameInputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a subscription name");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const subscriptionData = {
      name: name.trim(),
      amount: parseFloat(amount),
      currency,
      billingCycle,
      nextBillingDate: nextBillingDate.toISOString(),
      category,
      status,
      description: description.trim(),
      website: website.trim(),
      autoRenew,
      reminderDays: parseInt(reminderDays),
    };

    if (editingSubscription) {
      onUpdateSubscription({
        ...editingSubscription,
        ...subscriptionData,
      });
    } else {
      onAddSubscription(subscriptionData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {editingSubscription ? "Edit Subscription" : "Add New Subscription"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="relative">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subscription Name *
            </label>
            <input
              ref={nameInputRef}
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Netflix, Spotify Premium"
              required
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-gray-900">
                      {suggestion.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${suggestion.amount} • {suggestion.category}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the service"
              rows="2"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Website
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount *
            </label>
            <div className="flex space-x-3">
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          <div>
            <label
              htmlFor="billingCycle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Billing Cycle
            </label>
            <select
              id="billingCycle"
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {billingCycles.map((cycle) => (
                <option key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="nextBillingDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Next Billing Date
            </label>
            <DatePicker
              id="nextBillingDate"
              selected={nextBillingDate}
              onChange={(date) => setNextBillingDate(date)}
              dateFormat="MMMM d, yyyy"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Auto Renew
            </label>
            <p className="text-xs text-gray-500">
              Automatically renew this subscription
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>

        <div>
          <label
            htmlFor="reminderDays"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reminder Days Before Renewal
          </label>
          <input
            id="reminderDays"
            type="number"
            value={reminderDays}
            onChange={(e) => setReminderDays(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            max="30"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          {editingSubscription ? "Update Subscription" : "Add Subscription"}
        </button>
        {editingSubscription && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

SubscriptionForm.propTypes = {
  onAddSubscription: PropTypes.func.isRequired,
  editingSubscription: PropTypes.object,
  onUpdateSubscription: PropTypes.func,
  onCancelEdit: PropTypes.func,
};

export default SubscriptionForm;
