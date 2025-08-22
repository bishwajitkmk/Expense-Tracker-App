import { useState, useEffect } from "react";
import { useFamily } from "../../contexts/FamilyContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const IncomeSourceForm = ({ source = null, onSave, onCancel }) => {
  const { getCurrencyCode } = useSettings();
  const { formatAmount } = useExchangeRate();
  const { familyMembers, dispatch } = useFamily();

  const displayCurrency = getCurrencyCode();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    frequency: "monthly",
    memberId: "",
    type: "salary",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (source) {
      setFormData({
        name: source.name || "",
        amount: source.amount || "",
        frequency: source.frequency || "monthly",
        memberId: source.memberId || "",
        type: source.type || "salary",
        notes: source.notes || "",
      });
    }
  }, [source]);

  const incomeTypes = [
    { value: "salary", label: "Salary/Wages" },
    { value: "freelance", label: "Freelance" },
    { value: "business", label: "Business Income" },
    { value: "investment", label: "Investment Returns" },
    { value: "rental", label: "Rental Income" },
    { value: "other", label: "Other" },
  ];

  const frequencies = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
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
      newErrors.name = "Income source name is required";
    }

    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    ) {
      newErrors.amount = "Valid amount is required";
    }

    if (!formData.frequency) {
      newErrors.frequency = "Frequency is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const sourceData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (source) {
      dispatch({
        type: "UPDATE_INCOME_SOURCE",
        payload: { ...sourceData, id: source.id },
      });
    } else {
      dispatch({
        type: "ADD_INCOME_SOURCE",
        payload: sourceData,
      });
    }

    onSave && onSave();
  };

  const getMonthlyAmount = () => {
    if (!formData.amount || isNaN(formData.amount)) return 0;
    const amount = parseFloat(formData.amount);
    if (formData.frequency === "monthly") return amount;
    if (formData.frequency === "weekly") return amount * 4.33;
    if (formData.frequency === "yearly") return amount / 12;
    return amount;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {source ? "Edit Income Source" : "Add Income Source"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income Source Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Main Job, Freelance Work"
                error={errors.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income Type
              </label>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                options={incomeTypes}
                placeholder="Select income type"
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
          </div>

          {/* Frequency and Member */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency *
              </label>
              <Select
                value={formData.frequency}
                onChange={(e) => handleInputChange("frequency", e.target.value)}
                options={frequencies}
                placeholder="Select frequency"
                error={errors.frequency}
              />
            </div>

            {familyMembers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Family Member
                </label>
                <Select
                  value={formData.memberId}
                  onChange={(e) =>
                    handleInputChange("memberId", e.target.value)
                  }
                  options={[
                    { value: "", label: "Select a family member" },
                    ...familyMembers.map((member) => ({
                      value: member.id,
                      label: member.name,
                    })),
                  ]}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about this income source..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Monthly Preview */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            Monthly Equivalent
          </h4>
          <p className="text-lg font-bold text-blue-900">
            {formatAmount(getMonthlyAmount(), displayCurrency)} per month
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          {source ? "Update Income Source" : "Add Income Source"}
        </Button>
      </div>
    </form>
  );
};

export default IncomeSourceForm;
