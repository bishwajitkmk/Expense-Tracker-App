import { useState, useEffect } from "react";
import { useFamily } from "../../contexts/FamilyContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const FamilyMemberForm = ({ member = null, onSave, onCancel }) => {
  const { getCurrencyCode } = useSettings();
  const { formatAmount } = useExchangeRate();
  const { familyType, dispatch } = useFamily();

  const displayCurrency = getCurrencyCode();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    age: "",
    occupation: "",
    isPrimaryEarner: false,
    monthlyIncome: "",
    incomeSources: [],
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        role: member.role || "",
        age: member.age || "",
        occupation: member.occupation || "",
        isPrimaryEarner: member.isPrimaryEarner || false,
        monthlyIncome: member.monthlyIncome || "",
        incomeSources: member.incomeSources || [],
        notes: member.notes || "",
      });
    }
  }, [member]);

  const roles = [
    { value: "primary-earner", label: "Primary Earner" },
    { value: "secondary-earner", label: "Secondary Earner" },
    { value: "student", label: "Student" },
    { value: "homemaker", label: "Homemaker" },
    { value: "retired", label: "Retired" },
    { value: "child", label: "Child" },
    { value: "other", label: "Other" },
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
      newErrors.name = "Name is required";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (
      formData.age &&
      (isNaN(formData.age) || formData.age < 0 || formData.age > 120)
    ) {
      newErrors.age = "Age must be a valid number between 0 and 120";
    }

    if (
      formData.monthlyIncome &&
      (isNaN(formData.monthlyIncome) || formData.monthlyIncome < 0)
    ) {
      newErrors.monthlyIncome =
        "Monthly income must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const memberData = {
      ...formData,
      monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
      age: parseInt(formData.age) || null,
    };

    if (member) {
      dispatch({
        type: "UPDATE_FAMILY_MEMBER",
        payload: { ...memberData, id: member.id },
      });
    } else {
      dispatch({
        type: "ADD_FAMILY_MEMBER",
        payload: memberData,
      });
    }

    onSave && onSave();
  };

  const handleAddIncomeSource = () => {
    const newSource = {
      id: Date.now(),
      name: "",
      amount: "",
      frequency: "monthly",
      type: "salary",
    };

    setFormData((prev) => ({
      ...prev,
      incomeSources: [...prev.incomeSources, newSource],
    }));
  };

  const handleUpdateIncomeSource = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      incomeSources: prev.incomeSources.map((source, i) =>
        i === index ? { ...source, [field]: value } : source
      ),
    }));
  };

  const handleRemoveIncomeSource = (index) => {
    setFormData((prev) => ({
      ...prev,
      incomeSources: prev.incomeSources.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {member ? "Edit Family Member" : "Add Family Member"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter full name"
                error={errors.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role in Family *
              </label>
              <Select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                options={[{ value: "", label: "Select a role" }, ...roles]}
                error={errors.role}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="Enter age"
                min="0"
                max="120"
                error={errors.age}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occupation
              </label>
              <Input
                type="text"
                value={formData.occupation}
                onChange={(e) =>
                  handleInputChange("occupation", e.target.value)
                }
                placeholder="Enter occupation"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Income ({displayCurrency})
              </label>
              <Input
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) =>
                  handleInputChange("monthlyIncome", e.target.value)
                }
                placeholder="0.00"
                min="0"
                step="0.01"
                error={errors.monthlyIncome}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrimaryEarner"
                checked={formData.isPrimaryEarner}
                onChange={(e) =>
                  handleInputChange("isPrimaryEarner", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isPrimaryEarner"
                className="ml-2 block text-sm text-gray-700"
              >
                Primary Earner
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about this family member..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Income Sources Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Income Sources
          </h3>
          <Button
            type="button"
            onClick={handleAddIncomeSource}
            variant="outline"
            size="sm"
          >
            Add Income Source
          </Button>
        </div>

        {formData.incomeSources.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No income sources added yet. Click "Add Income Source" to get
            started.
          </p>
        ) : (
          <div className="space-y-4">
            {formData.incomeSources.map((source, index) => (
              <div
                key={source.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source Name
                    </label>
                    <Input
                      type="text"
                      value={source.name}
                      onChange={(e) =>
                        handleUpdateIncomeSource(index, "name", e.target.value)
                      }
                      placeholder="e.g., Main Job, Freelance"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount ({displayCurrency})
                    </label>
                    <Input
                      type="number"
                      value={source.amount}
                      onChange={(e) =>
                        handleUpdateIncomeSource(
                          index,
                          "amount",
                          e.target.value
                        )
                      }
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <Select
                      value={source.frequency}
                      onChange={(e) =>
                        handleUpdateIncomeSource(
                          index,
                          "frequency",
                          e.target.value
                        )
                      }
                      options={[
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                        { value: "yearly", label: "Yearly" },
                      ]}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => handleRemoveIncomeSource(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit">{member ? "Update Member" : "Add Member"}</Button>
      </div>
    </form>
  );
};

export default FamilyMemberForm;
