import PropTypes from "prop-types";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";

const CategoryCard = ({
  category,
  onEdit,
  onDelete,
  usageCount = 0,
  totalAmount = 0,
  currency = "USD",
}) => {
  const { formatAmount } = useExchangeRate();
  const handleDelete = () => {
    if (usageCount > 0) {
      const confirmDelete = window.confirm(
        `This category is used in ${usageCount} transaction(s). Are you sure you want to delete it?`
      );
      if (!confirmDelete) return;
    }
    onDelete(category);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h3
              className="font-semibold text-gray-900"
              style={{ color: category.color }}
            >
              {category.name}
            </h3>
            {usageCount > 0 && (
              <p className="text-sm text-gray-500">
                {usageCount} transaction{usageCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(category)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit category"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete category"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {usageCount > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold" style={{ color: category.color }}>
              {formatAmount(totalAmount, currency)}
            </span>
          </div>
        </div>
      )}

      {usageCount === 0 && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-400 italic">No transactions yet</p>
        </div>
      )}
    </div>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  usageCount: PropTypes.number,
  totalAmount: PropTypes.number,
  currency: PropTypes.string,
};

export default CategoryCard;
