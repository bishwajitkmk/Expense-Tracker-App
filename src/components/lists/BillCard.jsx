import { useFamily } from "../../contexts/FamilyContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import Button from "../ui/Button";

const BillCard = ({ bill, onEdit, onDelete }) => {
  const { getCurrencyCode } = useSettings();
  const { formatAmount } = useExchangeRate();

  const displayCurrency = getCurrencyCode();

  const getCategoryIcon = (category) => {
    switch (category) {
      case "utilities":
        return "⚡";
      case "rent":
        return "🏠";
      case "mortgage":
        return "🏦";
      case "insurance":
        return "🛡️";
      case "phone":
        return "📱";
      case "subscriptions":
        return "📺";
      case "credit-cards":
        return "💳";
      case "loans":
        return "💰";
      case "medical":
        return "🏥";
      default:
        return "📋";
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "utilities":
        return "Utilities";
      case "rent":
        return "Rent";
      case "mortgage":
        return "Mortgage";
      case "insurance":
        return "Insurance";
      case "phone":
        return "Phone/Internet";
      case "subscriptions":
        return "Subscriptions";
      case "credit-cards":
        return "Credit Cards";
      case "loans":
        return "Loans";
      case "medical":
        return "Medical";
      default:
        return "Other";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "utilities":
        return "bg-blue-100 text-blue-800";
      case "rent":
        return "bg-green-100 text-green-800";
      case "mortgage":
        return "bg-purple-100 text-purple-800";
      case "insurance":
        return "bg-yellow-100 text-yellow-800";
      case "phone":
        return "bg-pink-100 text-pink-800";
      case "subscriptions":
        return "bg-indigo-100 text-indigo-800";
      case "credit-cards":
        return "bg-red-100 text-red-800";
      case "loans":
        return "bg-orange-100 text-orange-800";
      case "medical":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "overdue":
        return "Overdue";
      case "upcoming":
        return "Upcoming";
      default:
        return "Pending";
    }
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  const getDueDateColor = () => {
    if (daysUntilDue < 0) return "text-red-600";
    if (daysUntilDue <= 7) return "text-yellow-600";
    return "text-gray-600";
  };

  const getDueDateText = () => {
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return "Due today";
    if (daysUntilDue === 1) return "Due tomorrow";
    return `${daysUntilDue} days until due`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{getCategoryIcon(bill.category)}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {bill.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                    bill.category
                  )}`}
                >
                  {getCategoryLabel(bill.category)}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    bill.status
                  )}`}
                >
                  {getStatusLabel(bill.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={() => onEdit(bill)} variant="outline" size="sm">
              Edit
            </Button>
            <Button
              onClick={() => onDelete(bill.id)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Amount</p>
            <p className="text-lg font-semibold text-red-600">
              {formatAmount(bill.amount, displayCurrency)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Due Date</p>
            <p className="text-lg text-gray-900">{formatDate(bill.dueDate)}</p>
            <p className={`text-sm ${getDueDateColor()}`}>{getDueDateText()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Frequency</p>
            <p className="text-lg text-gray-900 capitalize">{bill.frequency}</p>
          </div>
        </div>

        {/* Notes */}
        {bill.notes && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {bill.notes}
            </p>
          </div>
        )}

        {/* Urgency Indicator */}
        {daysUntilDue <= 7 && daysUntilDue >= 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-yellow-500 mr-2">⏰</div>
              <p className="text-sm text-yellow-800">
                This bill is due soon! Make sure to pay it on time.
              </p>
            </div>
          </div>
        )}

        {daysUntilDue < 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-500 mr-2">⚠️</div>
              <p className="text-sm text-red-800">
                This bill is overdue! Please pay it as soon as possible.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillCard;
