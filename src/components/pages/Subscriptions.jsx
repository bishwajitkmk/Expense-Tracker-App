import { useState, useMemo } from "react";
import { useSubscriptions } from "../../contexts/SubscriptionsContext";
import { useSettings } from "../../contexts/SettingsContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import PageHeader from "../layout/PageHeader";
import SubscriptionForm from "../forms/SubscriptionForm";
import SubscriptionCard from "../lists/SubscriptionCard";

const Subscriptions = () => {
  const { getCurrencyCode } = useSettings();
  const { formatAmount, convertAmount } = useExchangeRate();
  const {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleSubscriptionStatus,
    markAsRenewed,
    getSubscriptionsByStatus,
    getUpcomingRenewals,
    getTotalMonthlyCost,
    getTotalYearlyCost,
  } = useSubscriptions();

  const displayCurrency = getCurrencyCode();
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter options
  const filters = [
    { value: "all", label: "All", count: subscriptions.length },
    {
      value: "active",
      label: "Active",
      count: getSubscriptionsByStatus("active").length,
    },
    {
      value: "paused",
      label: "Paused",
      count: getSubscriptionsByStatus("paused").length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: getSubscriptionsByStatus("cancelled").length,
    },
    {
      value: "upcoming",
      label: "Upcoming",
      count: getUpcomingRenewals(7).length,
    },
  ];

  // Filter and search subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions;

    // Filter by status
    if (activeFilter === "active") {
      filtered = getSubscriptionsByStatus("active");
    } else if (activeFilter === "paused") {
      filtered = getSubscriptionsByStatus("paused");
    } else if (activeFilter === "cancelled") {
      filtered = getSubscriptionsByStatus("cancelled");
    } else if (activeFilter === "upcoming") {
      filtered = getUpcomingRenewals(7);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (subscription) =>
          subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.category
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (subscription.description &&
            subscription.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [
    subscriptions,
    activeFilter,
    searchTerm,
    getSubscriptionsByStatus,
    getUpcomingRenewals,
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeSubscriptions = getSubscriptionsByStatus("active");
    const totalMonthlyCost = getTotalMonthlyCost();
    const totalYearlyCost = getTotalYearlyCost();

    // Convert costs to display currency
    const convertedMonthlyCost = convertAmount(
      totalMonthlyCost,
      "USD",
      displayCurrency
    );
    const convertedYearlyCost = convertAmount(
      totalYearlyCost,
      "USD",
      displayCurrency
    );

    return {
      total: subscriptions.length,
      active: activeSubscriptions.length,
      paused: getSubscriptionsByStatus("paused").length,
      cancelled: getSubscriptionsByStatus("cancelled").length,
      upcoming: getUpcomingRenewals(7).length,
      monthlyCost: convertedMonthlyCost,
      yearlyCost: convertedYearlyCost,
    };
  }, [
    subscriptions,
    getSubscriptionsByStatus,
    getTotalMonthlyCost,
    getTotalYearlyCost,
    getUpcomingRenewals,
    convertAmount,
    displayCurrency,
  ]);

  // Handle subscription operations
  const handleAddSubscription = (subscriptionData) => {
    addSubscription(subscriptionData);
  };

  const handleUpdateSubscription = (updatedSubscription) => {
    updateSubscription(updatedSubscription);
    setEditingSubscription(null);
  };

  const handleDeleteSubscription = (subscriptionToDelete) => {
    deleteSubscription(subscriptionToDelete);
  };

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
  };

  const handleCancelEdit = () => {
    setEditingSubscription(null);
  };

  const handleToggleStatus = (subscriptionId) => {
    toggleSubscriptionStatus(subscriptionId);
  };

  const handleMarkRenewed = (subscriptionId) => {
    markAsRenewed(subscriptionId);
  };

  return (
    <div className="p-8 min-h-screen">
      <PageHeader
        title="Subscriptions"
        subtitle="Manage your recurring subscriptions and payments"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                Total Subscriptions
              </p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="text-3xl opacity-80">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Active</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <div className="text-3xl opacity-80">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Monthly Cost</p>
              <p className="text-2xl font-bold">
                {formatAmount(stats.monthlyCost, displayCurrency)}
              </p>
            </div>
            <div className="text-3xl opacity-80">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">
                Upcoming (7 days)
              </p>
              <p className="text-2xl font-bold">{stats.upcoming}</p>
            </div>
            <div className="text-3xl opacity-80">⏰</div>
          </div>
        </div>
      </div>

      {/* Yearly Cost Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Annual Subscription Cost
            </h3>
            <p className="text-sm text-gray-600">
              Total yearly cost for all active subscriptions
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              {formatAmount(stats.yearlyCost, displayCurrency)}
            </p>
            <p className="text-sm text-gray-500">per year</p>
          </div>
        </div>
      </div>

      {/* Subscription Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <SubscriptionForm
          onAddSubscription={handleAddSubscription}
          editingSubscription={editingSubscription}
          onUpdateSubscription={handleUpdateSubscription}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      {/* Search, Filter, and Subscriptions List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
                  activeFilter === filter.value
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Subscriptions List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subscriptions
          </h3>

          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No subscriptions found" : "No subscriptions yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Add your first subscription to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onEdit={handleEditSubscription}
                  onDelete={handleDeleteSubscription}
                  onToggleStatus={handleToggleStatus}
                  onMarkRenewed={handleMarkRenewed}
                  displayCurrency={displayCurrency}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
