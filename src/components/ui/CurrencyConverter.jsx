import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import CurrencySelector from "./CurrencySelector";

const CurrencyConverter = ({
  initialAmount = 0,
  initialFromCurrency = "USD",
  initialToCurrency = "EUR",
  showSwapButton = true,
  showRateInfo = true,
  className = "",
}) => {
  const {
    convertAmount,
    formatAmount,
    getExchangeRate,
    getRateStatus,
    loading,
  } = useExchangeRate();

  const [amount, setAmount] = useState(initialAmount);
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);

  // Calculate converted amount
  const convertedAmount = useMemo(() => {
    if (!amount || amount <= 0) return 0;
    return convertAmount(amount, fromCurrency, toCurrency);
  }, [amount, fromCurrency, toCurrency, convertAmount]);

  // Get exchange rate
  const exchangeRate = useMemo(() => {
    return getExchangeRate(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency, getExchangeRate]);

  const rateStatus = getRateStatus();

  // Handle currency swap
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Format amounts for display
  const formattedFromAmount = formatAmount(amount, fromCurrency);
  const formattedToAmount = formatAmount(convertedAmount, toCurrency);

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      <div className="space-y-4">
        {/* From Currency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            From
          </label>
          <div className="flex space-x-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            <CurrencySelector
              value={fromCurrency}
              onChange={setFromCurrency}
              className="w-32"
              disabled={loading}
            />
          </div>
        </div>

        {/* Swap Button */}
        {showSwapButton && (
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-150 disabled:opacity-50"
              title="Swap currencies"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>
        )}

        {/* To Currency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">To</label>
          <div className="flex space-x-3">
            <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
              <span className="text-gray-900 font-medium">
                {loading ? "Loading..." : formattedToAmount}
              </span>
            </div>
            <CurrencySelector
              value={toCurrency}
              onChange={setToCurrency}
              className="w-32"
              disabled={loading}
            />
          </div>
        </div>

        {/* Exchange Rate Info */}
        {showRateInfo && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>Exchange Rate:</span>
                <span className="font-medium">
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </span>
              </div>

              {/* Rate Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    rateStatus.status === "live"
                      ? "bg-green-500"
                      : rateStatus.status === "fallback"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-xs">{rateStatus.message}</span>
              </div>
            </div>

            {rateStatus.lastUpdated && (
              <div className="text-xs text-gray-500 mt-1">
                Last updated: {rateStatus.lastUpdated.toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* Conversion Summary */}
        {amount > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">Conversion Summary:</div>
              <div className="space-y-1">
                <div>
                  {formattedFromAmount} ({fromCurrency})
                </div>
                <div className="text-blue-600">↓</div>
                <div className="font-semibold">
                  {formattedToAmount} ({toCurrency})
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CurrencyConverter.propTypes = {
  initialAmount: PropTypes.number,
  initialFromCurrency: PropTypes.string,
  initialToCurrency: PropTypes.string,
  showSwapButton: PropTypes.bool,
  showRateInfo: PropTypes.bool,
  className: PropTypes.string,
};

export default CurrencyConverter;
