import { useState } from "react";
import { useFamily } from "../../contexts/FamilyContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import Button from "../ui/Button";

const FamilyMemberCard = ({ member, onEdit, onDelete }) => {
  const { getCurrencyCode } = useSettings();
  const { formatAmount } = useExchangeRate();
  const { getIncomeSourcesByMember } = useFamily();

  const displayCurrency = getCurrencyCode();
  const [isExpanded, setIsExpanded] = useState(false);

  const getRoleIcon = (role) => {
    switch (role) {
      case "primary-earner":
        return "👨‍💼";
      case "secondary-earner":
        return "👩‍💼";
      case "student":
        return "🎓";
      case "homemaker":
        return "👨‍👩‍👧‍👦";
      case "retired":
        return "👴";
      case "child":
        return "👶";
      default:
        return "👤";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "primary-earner":
        return "Primary Earner";
      case "secondary-earner":
        return "Secondary Earner";
      case "student":
        return "Student";
      case "homemaker":
        return "Homemaker";
      case "retired":
        return "Retired";
      case "child":
        return "Child";
      default:
        return "Other";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "primary-earner":
        return "bg-blue-100 text-blue-800";
      case "secondary-earner":
        return "bg-green-100 text-green-800";
      case "student":
        return "bg-purple-100 text-purple-800";
      case "homemaker":
        return "bg-pink-100 text-pink-800";
      case "retired":
        return "bg-gray-100 text-gray-800";
      case "child":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const incomeSources = getIncomeSourcesByMember(member.id);
  const totalMonthlyIncome = member.monthlyIncome || 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{getRoleIcon(member.role)}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {member.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                    member.role
                  )}`}
                >
                  {getRoleLabel(member.role)}
                </span>
                {member.isPrimaryEarner && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Primary Earner
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              size="sm"
            >
              {isExpanded ? "Hide Details" : "Show Details"}
            </Button>
            <Button onClick={() => onEdit(member)} variant="outline" size="sm">
              Edit
            </Button>
            <Button
              onClick={() => onDelete(member.id)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Age</p>
            <p className="text-lg text-gray-900">
              {member.age || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Occupation</p>
            <p className="text-lg text-gray-900">
              {member.occupation || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Monthly Income</p>
            <p className="text-lg font-semibold text-green-600">
              {formatAmount(totalMonthlyIncome, displayCurrency)}
            </p>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-100 pt-4 space-y-4">
            {/* Income Sources */}
            {incomeSources.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Income Sources
                </h4>
                <div className="space-y-2">
                  {incomeSources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {source.name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {source.frequency}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatAmount(source.amount, displayCurrency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {member.notes && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Notes
                </h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {member.notes}
                </p>
              </div>
            )}

            {/* Financial Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Financial Summary
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-blue-600">Total Income Sources</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {incomeSources.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Monthly Income</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {formatAmount(totalMonthlyIncome, displayCurrency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyMemberCard;
