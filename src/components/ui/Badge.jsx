import PropTypes from "prop-types";

const Badge = ({ children, variant = "primary", className = "", ...props }) => {
  const baseClasses = "badge";

  const variantClasses = {
    primary: "badge--primary",
    success: "badge--success",
    warning: "badge--warning",
    error: "badge--error",
  };

  const classes = [baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "success", "warning", "error"]),
  className: PropTypes.string,
};

export default Badge;
