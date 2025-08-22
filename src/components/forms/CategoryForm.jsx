import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CategoryForm = ({
  onAddCategory,
  editingCategory,
  onUpdateCategory,
  onCancelEdit,
  categoryType = "expense", // "expense" or "income"
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [icon, setIcon] = useState("📦");

  const iconOptions = [
    "🍽️",
    "✈️",
    "⚡",
    "🛍️",
    "🏥",
    "🎬",
    "📦",
    "💰",
    "💼",
    "📈",
    "🏢",
    "🏠",
    "🚗",
    "📱",
    "💻",
    "🎮",
    "📚",
    "🏋️",
    "🍺",
    "☕",
    "🍕",
    "🍔",
    "👕",
    "👖",
    "👟",
    "💄",
    "🧴",
    "💊",
    "🩺",
    "🏃",
    "🚴",
    "🏊",
    "🎯",
  ];

  const colorOptions = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#6B7280",
    "#059669",
    "#DC2626",
    "#7C3AED",
    "#DB2777",
    "#1F2937",
    "#0EA5E9",
    "#84CC16",
  ];

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || "");
      setColor(editingCategory.color || "#3B82F6");
      setIcon(editingCategory.icon || "📦");
    } else {
      setName("");
      setColor("#3B82F6");
      setIcon("📦");
    }
  }, [editingCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    const categoryData = {
      name: name.trim(),
      color,
      icon,
    };

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        ...categoryData,
      });
    } else {
      onAddCategory(categoryData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {editingCategory
          ? "Edit Category"
          : `Add ${categoryType === "expense" ? "Expense" : "Income"} Category`}
      </h3>

      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${categoryType} category name`}
            required
          />
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon
          </label>
          <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
            {iconOptions.map((iconOption) => (
              <button
                key={iconOption}
                type="button"
                onClick={() => setIcon(iconOption)}
                className={`w-8 h-8 text-lg rounded-md flex items-center justify-center transition-colors ${
                  icon === iconOption
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                {iconOption}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="grid grid-cols-7 gap-2">
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                onClick={() => setColor(colorOption)}
                className={`w-8 h-8 rounded-md border-2 transition-all ${
                  color === colorOption
                    ? "border-gray-800 scale-110"
                    : "border-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: colorOption }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md bg-gray-50">
            <span className="text-xl">{icon}</span>
            <span className="font-medium" style={{ color }}>
              {name || "Category Name"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {editingCategory ? "Update Category" : "Add Category"}
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

CategoryForm.propTypes = {
  onAddCategory: PropTypes.func.isRequired,
  editingCategory: PropTypes.object,
  onUpdateCategory: PropTypes.func,
  onCancelEdit: PropTypes.func,
  categoryType: PropTypes.oneOf(["expense", "income"]),
};

export default CategoryForm;
