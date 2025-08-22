import PropTypes from "prop-types";

const Alert = ({ children, variant = "info", className = "", ...props }) => {
  const baseClasses = "alert";

  const variantClasses = {
    info: "alert--info",
    success: "alert--success",
    warning: "alert--warning",
    error: "alert--error",
  };

  const classes = [baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["info", "success", "warning", "error"]),
  className: PropTypes.string,
};

export default Alert;
