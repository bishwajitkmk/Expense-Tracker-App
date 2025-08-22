import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";

const CurrencySelector = ({
  value,
  onChange,
  placeholder = "Select currency",
  className = "",
  disabled = false,
  showSearch = true,
  size = "md",
}) => {
  const { getSupportedCurrencies, getRateStatus } = useExchangeRate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const currencies = getSupportedCurrencies();
  const rateStatus = getRateStatus();

  // Filter currencies based on search term
  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return currencies;

    return currencies.filter(
      (currency) =>
        currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currencies, searchTerm]);

  // Get selected currency info
  const selectedCurrency = currencies.find((c) => c.code === value);

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  const handleSelect = (currencyCode) => {
    onChange(currencyCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Currency Display */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between
          border border-gray-300 rounded-lg
          ${sizeClasses[size]}
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white hover:bg-gray-50"
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-150
        `}
      >
        <div className="flex items-center space-x-2">
          {selectedCurrency ? (
            <>
              <span className="text-lg">{selectedCurrency.symbol}</span>
              <span className="font-medium">{selectedCurrency.code}</span>
              <span className="text-gray-500 text-sm hidden sm:inline">
                ({selectedCurrency.name})
              </span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Rate Status Indicator */}
          <div
            className={`w-2 h-2 rounded-full ${
              rateStatus.status === "live"
                ? "bg-green-500"
                : rateStatus.status === "fallback"
                ? "bg-yellow-500"
                : "bg-gray-400"
            }`}
            title={rateStatus.message}
          />

          {/* Dropdown Arrow */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
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
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          {showSearch && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          )}

          {/* Currency List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleSelect(currency.code)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3
                    hover:bg-gray-50 focus:bg-gray-50
                    ${
                      value === currency.code
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-900"
                    }
                    transition-colors duration-150
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{currency.symbol}</span>
                    <div className="text-left">
                      <div className="font-medium">{currency.code}</div>
                      <div className="text-sm text-gray-500">
                        {currency.name}
                      </div>
                    </div>
                  </div>

                  {value === currency.code && (
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                No currencies found
              </div>
            )}
          </div>

          {/* Rate Status Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>{rateStatus.message}</span>
              {rateStatus.lastUpdated && (
                <span>
                  Updated: {rateStatus.lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

CurrencySelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showSearch: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default CurrencySelector;
