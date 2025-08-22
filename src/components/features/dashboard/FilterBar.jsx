import PropTypes from "prop-types";

const FilterBar = ({
  filters,
  activeFilter,
  onFilterChange,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
                activeFilter === filter
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default FilterBar;
