import ExpenseItem from "./ExpenseItem";
import PropTypes from "prop-types";

const ExpenseList = ({
  expenses,
  onEdit,
  onDelete,
  displayCurrency = "USD",
}) => {
  if (!expenses.length) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 shadow">
        <p className="text-center text-blue-400">No expenses added yet.</p>
      </div>
    );
  }

  return (
    <section className="mb-6">
      <ul className="space-y-4 bg-blue-50 rounded-lg p-4 shadow">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
            displayCurrency={displayCurrency}
          />
        ))}
      </ul>
    </section>
  );
};

ExpenseList.propTypes = {
  expenses: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  displayCurrency: PropTypes.string,
};

export default ExpenseList;
