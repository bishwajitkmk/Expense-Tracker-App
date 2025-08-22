import { format } from "date-fns";
import PropTypes from "prop-types";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";

const ExpenseItem = ({
  expense,
  onEdit,
  onDelete,
  displayCurrency = "USD",
}) => {
  const { convertAmount, formatAmount } = useExchangeRate();

  // Convert amount to display currency
  const convertedAmount = convertAmount(
    expense.amount || 0,
    expense.currency || "USD",
    displayCurrency
  );

  // Format the converted amount
  const formattedAmount = formatAmount(convertedAmount, displayCurrency);

  return (
    <li className="flex justify-between items-center bg-white rounded shadow p-4">
      <div>
        <div className="text-blue-800 font-medium">{expense.title}</div>
        <div className="text-xs text-blue-400">
          {format(new Date(expense.date), "PPpp")}
        </div>
        <div className="text-xs text-gray-500">
          {expense.category}
          {expense.currency && expense.currency !== displayCurrency && (
            <span className="ml-2 text-gray-400">
              (Original: {formatAmount(expense.amount, expense.currency)})
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-blue-700 font-bold text-lg">
          {formattedAmount}
        </span>
        <button
          onClick={() => onEdit(expense)}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(expense)}
          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

ExpenseItem.propTypes = {
  expense: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
      .isRequired,
    category: PropTypes.string.isRequired,
    currency: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  displayCurrency: PropTypes.string,
};

export default ExpenseItem;
