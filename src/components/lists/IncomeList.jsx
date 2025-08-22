import IncomeItem from "./IncomeItem";
import PropTypes from "prop-types";

const IncomeList = ({ incomes, onEdit, onDelete, displayCurrency = "USD" }) => {
  if (!incomes.length) {
    return (
      <div className="bg-green-50 rounded-lg p-4 shadow">
        <p className="text-center text-green-400">No income added yet.</p>
      </div>
    );
  }

  return (
    <section className="mb-6">
      <ul className="space-y-4 bg-green-50 rounded-lg p-4 shadow">
        {incomes.map((income) => (
          <IncomeItem
            key={income.id}
            income={income}
            onEdit={onEdit}
            onDelete={onDelete}
            displayCurrency={displayCurrency}
          />
        ))}
      </ul>
    </section>
  );
};

IncomeList.propTypes = {
  incomes: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  displayCurrency: PropTypes.string,
};

export default IncomeList;
