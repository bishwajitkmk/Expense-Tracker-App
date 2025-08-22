import { useState } from "react";
import { useFamily } from "../../contexts/FamilyContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import PageHeader from "../layout/PageHeader";
import FamilyMemberForm from "../forms/FamilyMemberForm";
import FamilyMemberCard from "../lists/FamilyMemberCard";
import IncomeSourceForm from "../forms/IncomeSourceForm";
import IncomeSourceCard from "../lists/IncomeSourceCard";
import BillForm from "../forms/BillForm";
import BillCard from "../lists/BillCard";
import Button from "../ui/Button";

const FamilyPlanning = () => {
  const { getCurrencyCode } = useSettings();
  const { formatAmount } = useExchangeRate();
  const {
    familyType,
    familyMembers,
    incomeSources,
    bills,
    getTotalMonthlyIncome,
    getTotalMonthlyExpenses,
    getTotalMonthlyBills,
    getTotalMonthlyMortgage,
    getNetMonthlyIncome,
    getDisposableIncome,
    getUpcomingBills,
    getOverdueBills,
    dispatch,
  } = useFamily();

  const displayCurrency = getCurrencyCode();
  const [activeTab, setActiveTab] = useState("overview");
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [showBillForm, setShowBillForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  const handleSetFamilyType = (type) => {
    dispatch({ type: "SET_FAMILY_TYPE", payload: type });
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setShowMemberForm(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowMemberForm(true);
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm("Are you sure you want to delete this family member?")) {
      dispatch({ type: "REMOVE_FAMILY_MEMBER", payload: memberId });
    }
  };

  const handleSaveMember = () => {
    setShowMemberForm(false);
    setEditingMember(null);
  };

  const handleCancelMember = () => {
    setShowMemberForm(false);
    setEditingMember(null);
  };

  const handleAddIncome = () => {
    setEditingIncome(null);
    setShowIncomeForm(true);
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
    setShowIncomeForm(true);
  };

  const handleDeleteIncome = (incomeId) => {
    if (window.confirm("Are you sure you want to delete this income source?")) {
      dispatch({ type: "REMOVE_INCOME_SOURCE", payload: incomeId });
    }
  };

  const handleSaveIncome = () => {
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

  const handleCancelIncome = () => {
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

  const handleAddBill = () => {
    setEditingBill(null);
    setShowBillForm(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setShowBillForm(true);
  };

  const handleDeleteBill = (billId) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      dispatch({ type: "REMOVE_BILL", payload: billId });
    }
  };

  const handleSaveBill = () => {
    setShowBillForm(false);
    setEditingBill(null);
  };

  const handleCancelBill = () => {
    setShowBillForm(false);
    setEditingBill(null);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "members", label: "Family Members", icon: "👨‍👩‍👧‍👦" },
    { id: "income", label: "Income Sources", icon: "💰" },
    { id: "bills", label: "Bills & Payments", icon: "📋" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Family Type Setup */}
      {familyMembers.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Welcome to Family Planning!
          </h3>
          <p className="text-blue-700 mb-4">
            Let&apos;s start by setting up your family structure. Choose your
            family type:
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handleSetFamilyType("single")}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                familyType === "single"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="text-2xl mb-2">👤</div>
              <h4 className="font-semibold text-gray-900">
                Single Income Family
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                One primary earner with multiple income sources (job, side
                hustles, investments)
              </p>
            </button>
            <button
              onClick={() => handleSetFamilyType("multiple")}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                familyType === "multiple"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
              <h4 className="font-semibold text-gray-900">
                Multiple Income Family
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Multiple family members contributing to household income
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                Total Monthly Income
              </p>
              <p className="text-2xl font-bold">
                {formatAmount(getTotalMonthlyIncome(), displayCurrency)}
              </p>
            </div>
            <div className="text-3xl opacity-80">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                Total Monthly Expenses
              </p>
              <p className="text-2xl font-bold">
                {formatAmount(getTotalMonthlyExpenses(), displayCurrency)}
              </p>
            </div>
            <div className="text-3xl opacity-80">💸</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                Net Monthly Income
              </p>
              <p className="text-2xl font-bold">
                {formatAmount(getNetMonthlyIncome(), displayCurrency)}
              </p>
            </div>
            <div className="text-3xl opacity-80">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                Disposable Income
              </p>
              <p className="text-2xl font-bold">
                {formatAmount(getDisposableIncome(), displayCurrency)}
              </p>
            </div>
            <div className="text-3xl opacity-80">🎯</div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Income Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Primary Income</span>
              <span className="font-medium">
                {formatAmount(getTotalMonthlyIncome() * 0.7, displayCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Side Hustles</span>
              <span className="font-medium">
                {formatAmount(getTotalMonthlyIncome() * 0.2, displayCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Investments</span>
              <span className="font-medium">
                {formatAmount(getTotalMonthlyIncome() * 0.1, displayCurrency)}
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>
                  {formatAmount(getTotalMonthlyIncome(), displayCurrency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expense Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Living Expenses</span>
              <span className="font-medium">
                {formatAmount(getTotalMonthlyExpenses() * 0.4, displayCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bills & Utilities</span>
              <span className="font-medium">
                {formatAmount(getTotalMonthlyBills(), displayCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mortgage/Rent</span>
              <span className="font-medium">
                {formatAmount(getTotalMonthlyMortgage(), displayCurrency)}
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>
                  {formatAmount(
                    getTotalMonthlyExpenses() +
                      getTotalMonthlyBills() +
                      getTotalMonthlyMortgage(),
                    displayCurrency
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleAddMember}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">👤</div>
            <span className="text-sm font-medium">Add Family Member</span>
          </button>
          <button
            onClick={handleAddIncome}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">💰</div>
            <span className="text-sm font-medium">Add Income Source</span>
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">💸</div>
            <span className="text-sm font-medium">Add Expense</span>
          </button>
          <button
            onClick={handleAddBill}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <span className="text-sm font-medium">Add Bill</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        {getOverdueBills().length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">⚠️</div>
              <div>
                <h4 className="font-semibold text-red-900">Overdue Bills</h4>
                <p className="text-red-700 text-sm">
                  You have {getOverdueBills().length} overdue bill(s) that need
                  attention.
                </p>
              </div>
            </div>
          </div>
        )}

        {getUpcomingBills(7).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-yellow-500 mr-3">⏰</div>
              <div>
                <h4 className="font-semibold text-yellow-900">
                  Upcoming Bills
                </h4>
                <p className="text-yellow-700 text-sm">
                  You have {getUpcomingBills(7).length} bill(s) due in the next
                  7 days.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "members":
        return (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Family Members
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your family members and their financial information
                </p>
              </div>
              <Button onClick={handleAddMember}>Add Family Member</Button>
            </div>

            {/* Family Member Form */}
            {showMemberForm && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <FamilyMemberForm
                  member={editingMember}
                  onSave={handleSaveMember}
                  onCancel={handleCancelMember}
                />
              </div>
            )}

            {/* Family Members List */}
            {familyMembers.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Family Members Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your family members to track their income and
                  financial information.
                </p>
                <Button onClick={handleAddMember}>
                  Add Your First Family Member
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {familyMembers.map((member) => (
                  <FamilyMemberCard
                    key={member.id}
                    member={member}
                    onEdit={handleEditMember}
                    onDelete={handleDeleteMember}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case "income":
        return (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Income Sources
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your family&apos;s income sources and track monthly
                  earnings
                </p>
              </div>
              <Button onClick={handleAddIncome}>Add Income Source</Button>
            </div>

            {/* Income Source Form */}
            {showIncomeForm && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <IncomeSourceForm
                  source={editingIncome}
                  onSave={handleSaveIncome}
                  onCancel={handleCancelIncome}
                />
              </div>
            )}

            {/* Income Sources List */}
            {incomeSources.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Income Sources Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your income sources to track your
                  family&apos;s earnings.
                </p>
                <Button onClick={handleAddIncome}>
                  Add Your First Income Source
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {incomeSources.map((source) => (
                  <IncomeSourceCard
                    key={source.id}
                    source={source}
                    onEdit={handleEditIncome}
                    onDelete={handleDeleteIncome}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case "expenses":
        return (
          <div className="text-center py-12 text-gray-500">
            Expenses management coming soon...
          </div>
        );
      case "bills":
        return (
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Bills & Payments
                </h2>
                <p className="text-gray-600 mt-1">
                  Track your bills, due dates, and payment status
                </p>
              </div>
              <Button onClick={handleAddBill}>Add Bill</Button>
            </div>

            {/* Bill Form */}
            {showBillForm && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <BillForm
                  bill={editingBill}
                  onSave={handleSaveBill}
                  onCancel={handleCancelBill}
                />
              </div>
            )}

            {/* Bills List */}
            {bills.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Bills Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your bills to track due dates and payments.
                </p>
                <Button onClick={handleAddBill}>Add Your First Bill</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    onEdit={handleEditBill}
                    onDelete={handleDeleteBill}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case "mortgages":
        return (
          <div className="text-center py-12 text-gray-500">
            Mortgages management coming soon...
          </div>
        );
      case "savings":
        return (
          <div className="text-center py-12 text-gray-500">
            Savings Goals management coming soon...
          </div>
        );
      case "investments":
        return (
          <div className="text-center py-12 text-gray-500">
            Investments management coming soon...
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-12 text-gray-500">
            Family Settings coming soon...
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <PageHeader
        title="Family Planning"
        subtitle="Comprehensive family financial management hub"
      />

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default FamilyPlanning;
