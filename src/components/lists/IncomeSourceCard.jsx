import { useFamily } from "../../contexts/FamilyContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import Button from "../ui/Button";

const IncomeSourceCard = ({ source, onEdit, onDelete }) => {
  const { getCurrencyCode } = useSettings();
  const { formatAmount } = useExchangeRate();
  const { familyMembers, getFamilyMemberById } = useFamily();

  const displayCurrency = getCurrencyCode();

  const getTypeIcon = (type) => {
    switch (type) {
      case "salary":
        return "💼";
      case "freelance":
        return "💻";
      case "business":
        return "🏢";
      case "investment":
        return "📈";
      case "rental":
        return "🏠";
      default:
        return "💰";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "salary":
        return "Salary/Wages";
      case "freelance":
        return "Freelance";
      case "business":
        return "Business";
      case "investment":
        return "Investment";
      case "rental":
        return "Rental";
      default:
        return "Other";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "salary":
        return "bg-blue-100 text-blue-800";
      case "freelance":
        return "bg-green-100 text-green-800";
      case "business":
        return "bg-purple-100 text-purple-800";
      case "investment":
        return "bg-yellow-100 text-yellow-800";
      case "rental":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return frequency;
    }
  };

  const getMonthlyAmount = () => {
    if (source.frequency === "monthly") return source.amount;
    if (source.frequency === "weekly") return source.amount * 4.33;
    if (source.frequency === "yearly") return source.amount / 12;
    return source.amount;
  };

  const familyMember = source.memberId
    ? getFamilyMemberById(source.memberId)
    : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{getTypeIcon(source.type)}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {source.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                    source.type
                  )}`}
                >
                  {getTypeLabel(source.type)}
                </span>
                {familyMember && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {familyMember.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={() => onEdit(source)} variant="outline" size="sm">
              Edit
            </Button>
            <Button
              onClick={() => onDelete(source.id)}
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
            <p className="text-lg font-semibold text-green-600">
              {formatAmount(source.amount, displayCurrency)}
            </p>
            <p className="text-sm text-gray-500">
              {getFrequencyLabel(source.frequency)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Monthly Equivalent
            </p>
            <p className="text-lg font-semibold text-blue-600">
              {formatAmount(getMonthlyAmount(), displayCurrency)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Type</p>
            <p className="text-lg text-gray-900">{getTypeLabel(source.type)}</p>
          </div>
        </div>

        {/* Notes */}
        {source.notes && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {source.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeSourceCard;
