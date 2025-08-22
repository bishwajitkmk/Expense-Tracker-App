import { useState, useEffect } from "react";
import { useFamily } from "../../contexts/FamilyContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const BillForm = ({ bill = null, onSave, onCancel }) => {
  const { getCurrencyCode } = useSettings();
  const { formatAmount } = useExchangeRate();
  const { dispatch } = useFamily();

  const displayCurrency = getCurrencyCode();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    frequency: "monthly",
    category: "utilities",
    status: "pending",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name || "",
        amount: bill.amount || "",
        dueDate: bill.dueDate
          ? new Date(bill.dueDate).toISOString().split("T")[0]
          : "",
        frequency: bill.frequency || "monthly",
        category: bill.category || "utilities",
        status: bill.status || "pending",
        notes: bill.notes || "",
      });
    }
  }, [bill]);

  const billCategories = [
    { value: "utilities", label: "Utilities" },
    { value: "rent", label: "Rent" },
    { value: "mortgage", label: "Mortgage" },
    { value: "insurance", label: "Insurance" },
    { value: "phone", label: "Phone/Internet" },
    { value: "subscriptions", label: "Subscriptions" },
    { value: "credit-cards", label: "Credit Cards" },
    { value: "loans", label: "Loans" },
    { value: "medical", label: "Medical" },
    { value: "other", label: "Other" },
  ];

  const frequencies = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
    { value: "one-time", label: "One Time" },
  ];

  const statuses = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
    { value: "upcoming", label: "Upcoming" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Bill name is required";
    }

    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    ) {
      newErrors.amount = "Valid amount is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const billData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (bill) {
      dispatch({
        type: "UPDATE_BILL",
        payload: { ...billData, id: bill.id },
      });
    } else {
      dispatch({
        type: "ADD_BILL",
        payload: billData,
      });
    }

    onSave && onSave();
  };

  const getDaysUntilDue = () => {
    if (!formData.dueDate) return null;
    const today = new Date();
    const dueDate = new Date(formData.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "overdue":
        return "text-red-600";
      case "upcoming":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {bill ? "Edit Bill" : "Add Bill"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bill Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Electricity Bill, Rent"
                error={errors.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ({displayCurrency}) *
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                error={errors.amount}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                options={[
                  { value: "", label: "Select a category" },
                  ...billCategories,
                ]}
                error={errors.category}
              />
            </div>
          </div>

          {/* Date and Status */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                error={errors.dueDate}
              />
              {daysUntilDue !== null && (
                <p
                  className={`text-sm mt-1 ${
                    daysUntilDue < 0
                      ? "text-red-600"
                      : daysUntilDue <= 7
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {daysUntilDue < 0
                    ? `${Math.abs(daysUntilDue)} days overdue`
                    : daysUntilDue === 0
                    ? "Due today"
                    : `${daysUntilDue} days until due`}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <Select
                value={formData.frequency}
                onChange={(e) => handleInputChange("frequency", e.target.value)}
                options={frequencies}
                placeholder="Select frequency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                options={statuses}
                placeholder="Select status"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Additional notes about this bill..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Bill Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {formData.amount
                  ? formatAmount(parseFloat(formData.amount), displayCurrency)
                  : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p
                className={`text-lg font-semibold ${getStatusColor(
                  formData.status
                )}`}
              >
                {statuses.find((s) => s.value === formData.status)?.label ||
                  "Not set"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit">{bill ? "Update Bill" : "Add Bill"}</Button>
      </div>
    </form>
  );
};

export default BillForm;
