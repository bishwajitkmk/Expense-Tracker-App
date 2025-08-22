import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const SubscriptionsContext = createContext();

export const useSubscriptions = () => {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error(
      "useSubscriptions must be used within a SubscriptionsProvider"
    );
  }
  return context;
};

export const SubscriptionsProvider = ({ children }) => {
  // Load subscriptions from localStorage or use defaults
  const [subscriptions, setSubscriptions] = useState(() => {
    const savedSubscriptions = localStorage.getItem("expansePro-subscriptions");
    if (savedSubscriptions) {
      return JSON.parse(savedSubscriptions);
    }
    return [
      {
        id: 1,
        name: "Netflix",
        amount: 15.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        category: "Entertainment",
        status: "active",
        description: "Streaming service",
        website: "https://netflix.com",
        autoRenew: true,
        reminderDays: 3,
        icon: "🎬",
        color: "#E50914",
      },
      {
        id: 2,
        name: "Spotify Premium",
        amount: 9.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: new Date(
          Date.now() + 25 * 24 * 60 * 60 * 1000
        ).toISOString(),
        category: "Entertainment",
        status: "active",
        description: "Music streaming service",
        website: "https://spotify.com",
        autoRenew: true,
        reminderDays: 5,
        icon: "🎵",
        color: "#1DB954",
      },
      {
        id: 3,
        name: "Adobe Creative Cloud",
        amount: 52.99,
        currency: "USD",
        billingCycle: "monthly",
        nextBillingDate: new Date(
          Date.now() + 15 * 24 * 60 * 60 * 1000
        ).toISOString(),
        category: "Software",
        status: "active",
        description: "Creative software suite",
        website: "https://adobe.com",
        autoRenew: true,
        reminderDays: 7,
        icon: "🎨",
        color: "#FF0000",
      },
    ];
  });

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "expansePro-subscriptions",
      JSON.stringify(subscriptions)
    );
  }, [subscriptions]);

  // Add new subscription
  const addSubscription = (subscription) => {
    const newSubscription = {
      ...subscription,
      id: Math.max(...subscriptions.map((s) => s.id), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    setSubscriptions((prev) => [...prev, newSubscription]);
  };

  // Update subscription
  const updateSubscription = (updatedSubscription) => {
    setSubscriptions((prev) =>
      prev.map((subscription) =>
        subscription.id === updatedSubscription.id
          ? updatedSubscription
          : subscription
      )
    );
  };

  // Delete subscription
  const deleteSubscription = (subscriptionToDelete) => {
    setSubscriptions((prev) =>
      prev.filter((subscription) => subscription.id !== subscriptionToDelete.id)
    );
  };

  // Toggle subscription status
  const toggleSubscriptionStatus = (subscriptionId) => {
    setSubscriptions((prev) =>
      prev.map((subscription) =>
        subscription.id === subscriptionId
          ? {
              ...subscription,
              status: subscription.status === "active" ? "paused" : "active",
            }
          : subscription
      )
    );
  };

  // Get subscriptions by status
  const getSubscriptionsByStatus = (status) => {
    return subscriptions.filter(
      (subscription) => subscription.status === status
    );
  };

  // Get subscriptions by category
  const getSubscriptionsByCategory = (category) => {
    return subscriptions.filter(
      (subscription) => subscription.category === category
    );
  };

  // Get upcoming renewals (within specified days)
  const getUpcomingRenewals = (days = 7) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return subscriptions.filter((subscription) => {
      if (subscription.status !== "active") return false;
      const nextBilling = new Date(subscription.nextBillingDate);
      return nextBilling >= now && nextBilling <= futureDate;
    });
  };

  // Get total monthly cost
  const getTotalMonthlyCost = () => {
    return subscriptions
      .filter((subscription) => subscription.status === "active")
      .reduce((total, subscription) => {
        const multiplier = subscription.billingCycle === "yearly" ? 1 / 12 : 1;
        return total + subscription.amount * multiplier;
      }, 0);
  };

  // Get total yearly cost
  const getTotalYearlyCost = () => {
    return subscriptions
      .filter((subscription) => subscription.status === "active")
      .reduce((total, subscription) => {
        const multiplier = subscription.billingCycle === "monthly" ? 12 : 1;
        return total + subscription.amount * multiplier;
      }, 0);
  };

  // Calculate next billing date based on billing cycle
  const calculateNextBillingDate = (currentDate, billingCycle) => {
    const date = new Date(currentDate);

    switch (billingCycle) {
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }

    return date.toISOString();
  };

  // Mark subscription as renewed (advance billing date)
  const markAsRenewed = (subscriptionId) => {
    setSubscriptions((prev) =>
      prev.map((subscription) =>
        subscription.id === subscriptionId
          ? {
              ...subscription,
              nextBillingDate: calculateNextBillingDate(
                subscription.nextBillingDate,
                subscription.billingCycle
              ),
            }
          : subscription
      )
    );
  };

  const value = {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleSubscriptionStatus,
    getSubscriptionsByStatus,
    getSubscriptionsByCategory,
    getUpcomingRenewals,
    getTotalMonthlyCost,
    getTotalYearlyCost,
    calculateNextBillingDate,
    markAsRenewed,
  };

  return (
    <SubscriptionsContext.Provider value={value}>
      {children}
    </SubscriptionsContext.Provider>
  );
};

SubscriptionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
