import PropTypes from "prop-types";

const SummaryCard = ({
  title,
  value,
  icon,
  variant = "primary",
  currencySymbol = "$",
}) => {
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600",
    success: "bg-gradient-to-r from-green-500 to-green-600",
    warning: "bg-gradient-to-r from-orange-500 to-orange-600",
    error: "bg-gradient-to-r from-red-500 to-red-600",
  };

  return (
    <div
      className={`${variantClasses[variant]} text-white rounded-lg shadow-lg p-6`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-2xl font-bold">
            {currencySymbol}
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "success", "warning", "error"]),
  currencySymbol: PropTypes.string,
};

export default SummaryCard;
