import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import exchangeRateService from "../services/exchangeRateService";

const ExchangeRateContext = createContext();

export const useExchangeRate = () => {
  const context = useContext(ExchangeRateContext);
  if (!context) {
    throw new Error(
      "useExchangeRate must be used within an ExchangeRateProvider"
    );
  }
  return context;
};

export const ExchangeRateProvider = ({ children }) => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState("USD");

  // Fetch exchange rates
  const fetchRates = useCallback(async (currency = "USD") => {
    setLoading(true);
    setError(null);

    try {
      const ratesData = await exchangeRateService.fetchExchangeRates(currency);
      setRates(ratesData);
      setBaseCurrency(currency);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch exchange rates:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Convert amount between currencies
  const convertAmount = useCallback(
    (amount, fromCurrency, toCurrency) => {
      if (!rates || !rates.rates) return amount;
      return exchangeRateService.convertCurrency(
        amount,
        fromCurrency,
        toCurrency,
        rates
      );
    },
    [rates]
  );

  // Format currency amount
  const formatAmount = useCallback((amount, currencyCode) => {
    return exchangeRateService.formatCurrency(amount, currencyCode);
  }, []);

  // Get exchange rate between two currencies
  const getExchangeRate = useCallback(
    (fromCurrency, toCurrency) => {
      if (!rates || !rates.rates) return 1;
      return exchangeRateService.getExchangeRate(
        fromCurrency,
        toCurrency,
        rates
      );
    },
    [rates]
  );

  // Get supported currencies
  const getSupportedCurrencies = useCallback(() => {
    return exchangeRateService.getSupportedCurrencies();
  }, []);

  // Get currency by code
  const getCurrencyByCode = useCallback((code) => {
    return exchangeRateService.getCurrencyByCode(code);
  }, []);

  // Refresh rates manually
  const refreshRates = useCallback(() => {
    exchangeRateService.clearCache();
    fetchRates(baseCurrency);
  }, [fetchRates, baseCurrency]);

  // Auto-refresh rates every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (rates && !rates.isFallback) {
        fetchRates(baseCurrency);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchRates, baseCurrency, rates]);

  // Initial fetch on mount
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Convert all transactions to a specific currency
  const convertTransactions = useCallback(
    (transactions, targetCurrency) => {
      if (!rates || !rates.rates) return transactions;

      return transactions.map((transaction) => ({
        ...transaction,
        originalAmount: transaction.amount,
        originalCurrency: transaction.currency || "USD",
        amount: convertAmount(
          transaction.amount,
          transaction.currency || "USD",
          targetCurrency
        ),
        currency: targetCurrency,
      }));
    },
    [rates, convertAmount]
  );

  // Get rate status information
  const getRateStatus = useCallback(() => {
    if (!rates)
      return { status: "loading", message: "Loading exchange rates..." };

    if (rates.isFallback) {
      return {
        status: "fallback",
        message: "Using fallback rates (offline mode)",
        lastUpdated: lastUpdated,
      };
    }

    return {
      status: "live",
      message: "Live exchange rates",
      lastUpdated: lastUpdated,
    };
  }, [rates, lastUpdated]);

  const value = {
    // State
    rates,
    loading,
    error,
    lastUpdated,
    baseCurrency,

    // Actions
    fetchRates,
    refreshRates,
    convertAmount,
    formatAmount,
    getExchangeRate,
    convertTransactions,

    // Utilities
    getSupportedCurrencies,
    getCurrencyByCode,
    getRateStatus,

    // Service methods
    service: exchangeRateService,
  };

  return (
    <ExchangeRateContext.Provider value={value}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

ExchangeRateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
