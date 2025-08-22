import PropTypes from "prop-types";

const Card = ({
  children,
  variant = "default",
  className = "",
  padding = "lg",
  ...props
}) => {
  const baseClasses = "card";

  const variantClasses = {
    default: "",
    elevated: "card--elevated",
    flat: "card--flat",
  };

  const paddingClasses = {
    none: "p-0",
    xs: "p-xs",
    sm: "p-sm",
    md: "p-md",
    lg: "p-lg",
    xl: "p-xl",
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "elevated", "flat"]),
  className: PropTypes.string,
  padding: PropTypes.oneOf(["none", "xs", "sm", "md", "lg", "xl"]),
};

export default Card;
