import { format } from "date-fns";
import PropTypes from "prop-types";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";

const IncomeItem = ({ income, onEdit, onDelete, displayCurrency = "USD" }) => {
  const { convertAmount, formatAmount } = useExchangeRate();

  // Convert amount to display currency
  const convertedAmount = convertAmount(
    income.amount || 0,
    income.currency || "USD",
    displayCurrency
  );

  // Format the converted amount
  const formattedAmount = formatAmount(convertedAmount, displayCurrency);

  return (
    <li className="flex justify-between items-center bg-white rounded shadow p-4">
      <div>
        <div className="text-green-800 font-medium">{income.source}</div>
        <div className="text-xs text-green-400">
          {format(new Date(income.date), "PPpp")}
        </div>
        {income.currency && income.currency !== displayCurrency && (
          <div className="text-xs text-gray-400">
            Original: {formatAmount(income.amount, income.currency)}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-green-700 font-bold text-lg">
          {formattedAmount}
        </span>
        <button
          onClick={() => onEdit(income)}
          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(income)}
          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

IncomeItem.propTypes = {
  income: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    source: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
      .isRequired,
    currency: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  displayCurrency: PropTypes.string,
};

export default IncomeItem;
