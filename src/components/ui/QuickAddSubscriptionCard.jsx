import PropTypes from "prop-types";

const QuickAddSubscriptionCard = ({ subscription, onAdd }) => {
  const handleAdd = () => {
    onAdd(subscription);
  };

  // SVG logos for each service
  const getLogo = (name) => {
    switch (name.toLowerCase()) {
      case "netflix":
        return (
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current">
            <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 6.435 19.584 2.423-6.98 4.02-11.986 4.02-11.986L24 0H5.398zM1.809 24c.42-.907.84-1.752 1.23-2.458 1.893-3.33 3.8-6.64 5.704-9.94 1.9-3.3 3.8-6.6 5.7-9.9.42-.907.84-1.752 1.23-2.458H1.809z" />
          </svg>
        );
      case "amazon prime":
        return (
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zM12 4.5L20 9v6l-8 4.5V4.5z" />
            <path d="M12 8l-4 2.5v6l4 2.5 4-2.5v-6L12 8z" />
          </svg>
        );
      case "spotify premium":
        return (
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-5" />
          </svg>
        );
      case "disney+":
        return (
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      case "youtube premium":
        return (
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case "adobe creative cloud":
        return (
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      case "microsoft 365":
        return (
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current">
            <path d="M11.5 2.75l-8.5 4.5v9.5c0 .83.67 1.5 1.5 1.5h14c.83 0 1.5-.67 1.5-1.5v-9.5l-8.5-4.5zM12 4.5l6.5 3.44v8.06c0 .28-.22.5-.5.5h-12c-.28 0-.5-.22-.5-.5V7.94L12 4.5z" />
            <path d="M12 8l-4 2.5v6l4 2.5 4-2.5v-6L12 8z" />
          </svg>
        );
      case "apple one":
        return (
          <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        );
      default:
        return <div className="text-6xl">{subscription.logo}</div>;
    }
  };

  return (
    <div
      onClick={handleAdd}
      className="relative group cursor-pointer transition-all duration-300 transform hover:scale-105"
    >
      {/* Main card with brand color */}
      <div
        className="w-40 h-28 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl relative overflow-hidden"
        style={{ backgroundColor: subscription.brandColor }}
      >
        {/* Logo - SVG logos for each service */}
        <div className="text-white transition-transform duration-300 group-hover:scale-110 z-10">
          {getLogo(subscription.name)}
        </div>

        {/* Hover overlay with price - improved animation */}
        <div className="absolute inset-0 bg-black bg-opacity-90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95">
          <div className="text-white text-center">
            <div className="text-xl font-bold mb-1">
              {subscription.currency}
              {subscription.price}
            </div>
            <div className="text-sm opacity-90">
              {subscription.billingCycle}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip for name - improved positioning */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 shadow-lg">
        {subscription.name}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
};

QuickAddSubscriptionCard.propTypes = {
  subscription: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    billingCycle: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    brandColor: PropTypes.string.isRequired,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default QuickAddSubscriptionCard;
