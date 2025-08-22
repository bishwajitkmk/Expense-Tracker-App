import { useState } from "react";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import { useSettings } from "../../contexts/SettingsContext";
import PageHeader from "../layout/PageHeader";
import { CurrencyConverter as CurrencyConverterComponent } from "../ui";
import { Button } from "../ui";

const CurrencyConverter = () => {
  const { getCurrencyCode } = useSettings();
  const {
    refreshRates,
    loading,
    error,
    getRateStatus,
    getSupportedCurrencies,
  } = useExchangeRate();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const defaultCurrency = getCurrencyCode();
  const currencies = getSupportedCurrencies();
  const rateStatus = getRateStatus();

  const popularConversions = [
    { from: "USD", to: "EUR", amount: 100 },
    { from: "USD", to: "GBP", amount: 100 },
    { from: "USD", to: "JPY", amount: 100 },
    { from: "EUR", to: "USD", amount: 100 },
    { from: "GBP", to: "USD", amount: 100 },
    { from: "USD", to: "INR", amount: 100 },
  ];

  return (
    <div className="p-8 min-h-screen">
      <PageHeader
        title="Currency Converter"
        subtitle="Real-time exchange rate conversion with live rates"
      />

      {/* Rate Status Banner */}
      <div
        className={`mb-6 p-4 rounded-lg border ${
          rateStatus.status === "live"
            ? "bg-green-50 border-green-200 text-green-800"
            : rateStatus.status === "fallback"
            ? "bg-yellow-50 border-yellow-200 text-yellow-800"
            : "bg-gray-50 border-gray-200 text-gray-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                rateStatus.status === "live"
                  ? "bg-green-500"
                  : rateStatus.status === "fallback"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
              }`}
            />
            <span className="font-medium">{rateStatus.message}</span>
          </div>
          <div className="flex items-center space-x-4">
            {rateStatus.lastUpdated && (
              <span className="text-sm">
                Updated: {rateStatus.lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              onClick={refreshRates}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? "Refreshing..." : "🔄 Refresh Rates"}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">⚠️</span>
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      {/* Main Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Primary Converter */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Currency Converter
          </h2>
          <CurrencyConverterComponent
            initialAmount={100}
            initialFromCurrency={defaultCurrency}
            initialToCurrency={defaultCurrency === "USD" ? "EUR" : "USD"}
            showSwapButton={true}
            showRateInfo={true}
            className="shadow-lg"
          />
        </div>

        {/* Popular Conversions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular Conversions
          </h2>
          <div className="space-y-4">
            {popularConversions.map((conversion, index) => (
              <CurrencyConverterComponent
                key={index}
                initialAmount={conversion.amount}
                initialFromCurrency={conversion.from}
                initialToCurrency={conversion.to}
                showSwapButton={false}
                showRateInfo={false}
                className="shadow-md"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Advanced Features
          </h2>
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced
          </Button>
        </div>

        {showAdvanced && (
          <div className="space-y-6">
            {/* Supported Currencies */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Supported Currencies ({currencies.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {currencies.map((currency) => (
                  <div
                    key={currency.code}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-lg">{currency.symbol}</span>
                    <div>
                      <div className="font-medium text-sm">{currency.code}</div>
                      <div className="text-xs text-gray-500">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Exchange Rate Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Data Source:</strong> ExchangeRate-API (Free tier)
                </div>
                <div>
                  <strong>Update Frequency:</strong> Every 5 minutes
                </div>
                <div>
                  <strong>Base Currency:</strong> USD
                </div>
                <div>
                  <strong>Cache Duration:</strong> 5 minutes
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Real-time exchange rates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>20+ supported currencies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Automatic rate updates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Offline fallback rates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Currency search & filtering</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Proper currency formatting</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
