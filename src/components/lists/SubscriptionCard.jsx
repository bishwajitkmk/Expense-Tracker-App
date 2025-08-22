import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import PropTypes from "prop-types";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";

const SubscriptionCard = ({
  subscription,
  onEdit,
  onDelete,
  onToggleStatus,
  onMarkRenewed,
  displayCurrency,
}) => {
  const { formatAmount, convertAmount } = useExchangeRate();
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the subscription "${subscription.name}"?`
    );
    if (confirmDelete) {
      onDelete(subscription);
    }
  };

  const handleMarkRenewed = () => {
    const confirmRenew = window.confirm(
      `Mark "${subscription.name}" as renewed? This will update the next billing date.`
    );
    if (confirmRenew) {
      onMarkRenewed(subscription.id);
    }
  };

  // Calculate days until next billing
  const daysUntilBilling = differenceInDays(
    new Date(subscription.nextBillingDate),
    new Date()
  );

  // Convert amount to display currency
  const convertedAmount = convertAmount(
    subscription.amount,
    subscription.currency,
    displayCurrency
  );

  // Get status configuration
  const getStatusConfig = () => {
    switch (subscription.status) {
      case "active":
        return {
          label: "Active",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          dotColor: "bg-emerald-500",
        };
      case "paused":
        return {
          label: "Paused",
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          dotColor: "bg-amber-500",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          dotColor: "bg-red-500",
        };
      default:
        return {
          label: "Unknown",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          dotColor: "bg-gray-500",
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Get urgency configuration
  const getUrgencyConfig = () => {
    if (subscription.status !== "active") return null;

    if (daysUntilBilling <= 0) {
      return {
        label: "Due today",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    } else if (daysUntilBilling <= subscription.reminderDays) {
      return {
        label: `Due in ${daysUntilBilling} days`,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      };
    } else if (daysUntilBilling <= 7) {
      return {
        label: `Due in ${daysUntilBilling} days`,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    }
    return null;
  };

  const urgencyConfig = getUrgencyConfig();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">{subscription.icon || "📦"}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {subscription.name}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {subscription.category}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${statusConfig.dotColor} mr-2`}
              ></div>
              {statusConfig.label}
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              title="Toggle details"
            >
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  showDetails ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Amount and Billing Info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatAmount(convertedAmount, displayCurrency)}
            </p>
            <p className="text-sm text-gray-500 capitalize">
              per {subscription.billingCycle}
            </p>
          </div>

          {urgencyConfig && (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${urgencyConfig.bgColor} ${urgencyConfig.color} border ${urgencyConfig.borderColor}`}
            >
              {urgencyConfig.label}
            </div>
          )}
        </div>

        {/* Billing Date */}
        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center space-x-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-700">Next billing</p>
              <p className="text-sm text-gray-900">
                {format(
                  new Date(subscription.nextBillingDate),
                  "MMMM dd, yyyy"
                )}
              </p>
            </div>
          </div>

          {subscription.status === "active" && (
            <div className="text-right">
              <p
                className={`text-sm font-medium ${
                  daysUntilBilling <= 0
                    ? "text-red-600"
                    : daysUntilBilling <= 3
                    ? "text-amber-600"
                    : daysUntilBilling <= 7
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {daysUntilBilling > 0
                  ? `${daysUntilBilling} days remaining`
                  : daysUntilBilling === 0
                  ? "Due today"
                  : `${Math.abs(daysUntilBilling)} days overdue`}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {subscription.status === "active" && (
            <button
              onClick={handleMarkRenewed}
              className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-150"
            >
              Mark Renewed
            </button>
          )}
          <button
            onClick={() => onToggleStatus(subscription.id)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ${
              subscription.status === "active"
                ? "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {subscription.status === "active" ? "Pause" : "Activate"}
          </button>
          <button
            onClick={() => onEdit(subscription)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150"
          >
            Delete
          </button>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
            {subscription.description && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {subscription.description}
                </p>
              </div>
            )}

            {subscription.website && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Website
                </h4>
                <a
                  href={subscription.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline inline-flex items-center space-x-1"
                >
                  <span>{subscription.website}</span>
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Auto Renew
                </h4>
                <p
                  className={`text-sm font-medium ${
                    subscription.autoRenew ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {subscription.autoRenew ? "Enabled" : "Disabled"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Reminder
                </h4>
                <p className="text-sm font-medium text-gray-600">
                  {subscription.reminderDays} days before
                </p>
              </div>
            </div>

            {subscription.currency !== displayCurrency && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Original Amount
                </h4>
                <p className="text-sm font-medium text-gray-600">
                  {formatAmount(subscription.amount, subscription.currency)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SubscriptionCard.propTypes = {
  subscription: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    billingCycle: PropTypes.string.isRequired,
    nextBillingDate: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    description: PropTypes.string,
    website: PropTypes.string,
    autoRenew: PropTypes.bool.isRequired,
    reminderDays: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onMarkRenewed: PropTypes.func.isRequired,
  displayCurrency: PropTypes.string.isRequired,
};

export default SubscriptionCard;
