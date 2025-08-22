import axios from "axios";

// Free exchange rate API (no API key required)
const API_BASE_URL = "https://api.exchangerate-api.com/v4/latest";

// Cache for exchange rates to avoid excessive API calls
const rateCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ExchangeRateService {
  constructor() {
    this.baseCurrency = "USD";
    this.supportedCurrencies = [
      { code: "USD", name: "US Dollar", symbol: "$" },
      { code: "EUR", name: "Euro", symbol: "€" },
      { code: "GBP", name: "British Pound", symbol: "£" },
      { code: "JPY", name: "Japanese Yen", symbol: "¥" },
      { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
      { code: "AUD", name: "Australian Dollar", symbol: "A$" },
      { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
      { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
      { code: "INR", name: "Indian Rupee", symbol: "₹" },
      { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
      { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
      { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
      { code: "KRW", name: "South Korean Won", symbol: "₩" },
      { code: "SEK", name: "Swedish Krona", symbol: "kr" },
      { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
      { code: "DKK", name: "Danish Krone", symbol: "kr" },
      { code: "PLN", name: "Polish Złoty", symbol: "zł" },
      { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
      { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
      { code: "RUB", name: "Russian Ruble", symbol: "₽" },
    ];
  }

  // Get supported currencies
  getSupportedCurrencies() {
    return this.supportedCurrencies;
  }

  // Get currency by code
  getCurrencyByCode(code) {
    return this.supportedCurrencies.find((currency) => currency.code === code);
  }

  // Check if cache is valid
  isCacheValid(timestamp) {
    return Date.now() - timestamp < CACHE_DURATION;
  }

  // Fetch exchange rates from API
  async fetchExchangeRates(baseCurrency = "USD") {
    try {
      // Check cache first
      const cacheKey = `rates_${baseCurrency}`;
      const cached = rateCache.get(cacheKey);

      if (cached && this.isCacheValid(cached.timestamp)) {
        return cached.rates;
      }

      // Fetch from API
      const response = await axios.get(`${API_BASE_URL}/${baseCurrency}`);

      if (response.data && response.data.rates) {
        const rates = {
          base: response.data.base,
          date: response.data.date,
          rates: response.data.rates,
          timestamp: Date.now(),
        };

        // Cache the result
        rateCache.set(cacheKey, rates);

        return rates;
      } else {
        throw new Error("Invalid response format from exchange rate API");
      }
    } catch (err) {
      console.error("Error fetching exchange rates:", err);

      // Return fallback rates if API fails
      return this.getFallbackRates(baseCurrency);
    }
  }

  // Fallback rates for when API is unavailable
  getFallbackRates(baseCurrency) {
    const fallbackRates = {
      USD: {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110,
        CAD: 1.25,
        AUD: 1.35,
        CHF: 0.92,
        CNY: 6.45,
        INR: 75,
        BDT: 85,
        SGD: 1.35,
        NZD: 1.45,
        KRW: 1150,
        SEK: 8.5,
        NOK: 8.8,
        DKK: 6.2,
        PLN: 3.8,
        CZK: 21.5,
        HUF: 300,
        RUB: 75,
      },
      EUR: {
        USD: 1.18,
        EUR: 1,
        GBP: 0.86,
        JPY: 129,
        CAD: 1.47,
        AUD: 1.59,
        CHF: 1.08,
        CNY: 7.6,
        INR: 88,
        BDT: 100,
        SGD: 1.59,
        NZD: 1.71,
        KRW: 1350,
        SEK: 10,
        NOK: 10.4,
        DKK: 7.3,
        PLN: 4.5,
        CZK: 25.3,
        HUF: 353,
        RUB: 88,
      },
    };

    return {
      base: baseCurrency,
      date: new Date().toISOString().split("T")[0],
      rates: fallbackRates[baseCurrency] || fallbackRates.USD,
      timestamp: Date.now(),
      isFallback: true,
    };
  }

  // Convert amount from one currency to another
  convertCurrency(amount, fromCurrency, toCurrency, rates) {
    if (!rates || !rates.rates) {
      return amount; // Return original amount if no rates available
    }

    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Convert to base currency first, then to target currency
    const baseRate = rates.rates[fromCurrency] || 1;
    const targetRate = rates.rates[toCurrency] || 1;

    const amountInBase = amount / baseRate;
    const convertedAmount = amountInBase * targetRate;

    return convertedAmount;
  }

  // Format currency amount with proper symbol and formatting
  formatCurrency(amount, currencyCode) {
    const currency = this.getCurrencyByCode(currencyCode);
    if (!currency) return `${amount.toFixed(2)}`;

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // Fallback formatting
      return `${currency.symbol}${amount.toFixed(2)}`;
    }
  }

  // Get exchange rate between two currencies
  getExchangeRate(fromCurrency, toCurrency, rates) {
    if (!rates || !rates.rates) return 1;

    if (fromCurrency === toCurrency) return 1;

    const fromRate = rates.rates[fromCurrency] || 1;
    const toRate = rates.rates[toCurrency] || 1;

    return toRate / fromRate;
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache() {
    rateCache.clear();
  }
}

export default new ExchangeRateService();
