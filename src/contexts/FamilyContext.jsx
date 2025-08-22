import { createContext, useContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

const FamilyContext = createContext();

// Action types
const ACTIONS = {
  SET_FAMILY_TYPE: "SET_FAMILY_TYPE",
  ADD_FAMILY_MEMBER: "ADD_FAMILY_MEMBER",
  UPDATE_FAMILY_MEMBER: "UPDATE_FAMILY_MEMBER",
  REMOVE_FAMILY_MEMBER: "REMOVE_FAMILY_MEMBER",
  ADD_INCOME_SOURCE: "ADD_INCOME_SOURCE",
  UPDATE_INCOME_SOURCE: "UPDATE_INCOME_SOURCE",
  REMOVE_INCOME_SOURCE: "REMOVE_INCOME_SOURCE",
  ADD_EXPENSE: "ADD_EXPENSE",
  UPDATE_EXPENSE: "UPDATE_EXPENSE",
  REMOVE_EXPENSE: "REMOVE_EXPENSE",
  ADD_BILL: "ADD_BILL",
  UPDATE_BILL: "UPDATE_BILL",
  REMOVE_BILL: "REMOVE_BILL",
  ADD_MORTGAGE: "ADD_MORTGAGE",
  UPDATE_MORTGAGE: "UPDATE_MORTGAGE",
  REMOVE_MORTGAGE: "REMOVE_MORTGAGE",
  ADD_SAVINGS_GOAL: "ADD_SAVINGS_GOAL",
  UPDATE_SAVINGS_GOAL: "UPDATE_SAVINGS_GOAL",
  REMOVE_SAVINGS_GOAL: "REMOVE_SAVINGS_GOAL",
  ADD_INVESTMENT: "ADD_INVESTMENT",
  UPDATE_INVESTMENT: "UPDATE_INVESTMENT",
  REMOVE_INVESTMENT: "REMOVE_INVESTMENT",
  UPDATE_FAMILY_SETTINGS: "UPDATE_FAMILY_SETTINGS",
};

// Initial state
const initialState = {
  familyType: "single", // "single" or "multiple"
  familyMembers: [],
  incomeSources: [],
  expenses: [],
  bills: [],
  mortgages: [],
  savingsGoals: [],
  investments: [],
  settings: {
    emergencyFundTarget: 0,
    monthlyBudget: 0,
    savingsRate: 0.2, // 20% default
    investmentRate: 0.1, // 10% default
  },
};

// Reducer function
const familyReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_FAMILY_TYPE:
      return {
        ...state,
        familyType: action.payload,
      };

    case ACTIONS.ADD_FAMILY_MEMBER:
      return {
        ...state,
        familyMembers: [
          ...state.familyMembers,
          { ...action.payload, id: Date.now() },
        ],
      };

    case ACTIONS.UPDATE_FAMILY_MEMBER:
      return {
        ...state,
        familyMembers: state.familyMembers.map((member) =>
          member.id === action.payload.id ? action.payload : member
        ),
      };

    case ACTIONS.REMOVE_FAMILY_MEMBER:
      return {
        ...state,
        familyMembers: state.familyMembers.filter(
          (member) => member.id !== action.payload
        ),
      };

    case ACTIONS.ADD_INCOME_SOURCE:
      return {
        ...state,
        incomeSources: [
          ...state.incomeSources,
          { ...action.payload, id: Date.now() },
        ],
      };

    case ACTIONS.UPDATE_INCOME_SOURCE:
      return {
        ...state,
        incomeSources: state.incomeSources.map((source) =>
          source.id === action.payload.id ? action.payload : source
        ),
      };

    case ACTIONS.REMOVE_INCOME_SOURCE:
      return {
        ...state,
        incomeSources: state.incomeSources.filter(
          (source) => source.id !== action.payload
        ),
      };

    case ACTIONS.ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: Date.now() }],
      };

    case ACTIONS.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };

    case ACTIONS.REMOVE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
      };

    case ACTIONS.ADD_BILL:
      return {
        ...state,
        bills: [...state.bills, { ...action.payload, id: Date.now() }],
      };

    case ACTIONS.UPDATE_BILL:
      return {
        ...state,
        bills: state.bills.map((bill) =>
          bill.id === action.payload.id ? action.payload : bill
        ),
      };

    case ACTIONS.REMOVE_BILL:
      return {
        ...state,
        bills: state.bills.filter((bill) => bill.id !== action.payload),
      };

    case ACTIONS.ADD_MORTGAGE:
      return {
        ...state,
        mortgages: [...state.mortgages, { ...action.payload, id: Date.now() }],
      };

    case ACTIONS.UPDATE_MORTGAGE:
      return {
        ...state,
        mortgages: state.mortgages.map((mortgage) =>
          mortgage.id === action.payload.id ? action.payload : mortgage
        ),
      };

    case ACTIONS.REMOVE_MORTGAGE:
      return {
        ...state,
        mortgages: state.mortgages.filter(
          (mortgage) => mortgage.id !== action.payload
        ),
      };

    case ACTIONS.ADD_SAVINGS_GOAL:
      return {
        ...state,
        savingsGoals: [
          ...state.savingsGoals,
          { ...action.payload, id: Date.now() },
        ],
      };

    case ACTIONS.UPDATE_SAVINGS_GOAL:
      return {
        ...state,
        savingsGoals: state.savingsGoals.map((goal) =>
          goal.id === action.payload.id ? action.payload : goal
        ),
      };

    case ACTIONS.REMOVE_SAVINGS_GOAL:
      return {
        ...state,
        savingsGoals: state.savingsGoals.filter(
          (goal) => goal.id !== action.payload
        ),
      };

    case ACTIONS.ADD_INVESTMENT:
      return {
        ...state,
        investments: [
          ...state.investments,
          { ...action.payload, id: Date.now() },
        ],
      };

    case ACTIONS.UPDATE_INVESTMENT:
      return {
        ...state,
        investments: state.investments.map((investment) =>
          investment.id === action.payload.id ? action.payload : investment
        ),
      };

    case ACTIONS.REMOVE_INVESTMENT:
      return {
        ...state,
        investments: state.investments.filter(
          (investment) => investment.id !== action.payload
        ),
      };

    case ACTIONS.UPDATE_FAMILY_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    default:
      return state;
  }
};

// Provider component
export const FamilyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(familyReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("familyData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach((key) => {
          if (key !== "settings" && Array.isArray(parsedData[key])) {
            parsedData[key].forEach((item) => {
              dispatch({
                type: `ADD_${key.toUpperCase().slice(0, -1)}`,
                payload: item,
              });
            });
          }
        });
        if (parsedData.settings && typeof parsedData.settings === "object") {
          dispatch({
            type: ACTIONS.UPDATE_FAMILY_SETTINGS,
            payload: parsedData.settings,
          });
        }
      } catch (error) {
        console.error("Error loading family data from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("familyData");
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("familyData", JSON.stringify(state));
  }, [state]);

  // Helper functions
  const getTotalMonthlyIncome = () => {
    return state.incomeSources.reduce((total, source) => {
      if (source.frequency === "monthly") return total + source.amount;
      if (source.frequency === "weekly") return total + source.amount * 4.33;
      if (source.frequency === "yearly") return total + source.amount / 12;
      return total;
    }, 0);
  };

  const getTotalMonthlyExpenses = () => {
    return state.expenses.reduce((total, expense) => {
      if (expense.frequency === "monthly") return total + expense.amount;
      if (expense.frequency === "weekly") return total + expense.amount * 4.33;
      if (expense.frequency === "yearly") return total + expense.amount / 12;
      return total;
    }, 0);
  };

  const getTotalMonthlyBills = () => {
    return state.bills.reduce((total, bill) => total + bill.amount, 0);
  };

  const getTotalMonthlyMortgage = () => {
    return state.mortgages.reduce(
      (total, mortgage) => total + mortgage.monthlyPayment,
      0
    );
  };

  const getNetMonthlyIncome = () => {
    const totalIncome = getTotalMonthlyIncome();
    const totalExpenses = getTotalMonthlyExpenses();
    const totalBills = getTotalMonthlyBills();
    const totalMortgage = getTotalMonthlyMortgage();
    return totalIncome - totalExpenses - totalBills - totalMortgage;
  };

  const getSavingsAmount = () => {
    const netIncome = getNetMonthlyIncome();
    return netIncome * state.settings.savingsRate;
  };

  const getInvestmentAmount = () => {
    const netIncome = getNetMonthlyIncome();
    return netIncome * state.settings.investmentRate;
  };

  const getDisposableIncome = () => {
    const netIncome = getNetMonthlyIncome();
    const savings = getSavingsAmount();
    const investments = getInvestmentAmount();
    return netIncome - savings - investments;
  };

  const getFamilyMemberById = (id) => {
    return state.familyMembers.find((member) => member.id === id);
  };

  const getIncomeSourcesByMember = (memberId) => {
    return state.incomeSources.filter((source) => source.memberId === memberId);
  };

  const getExpensesByMember = (memberId) => {
    return state.expenses.filter((expense) => expense.memberId === memberId);
  };

  const getUpcomingBills = (days = 30) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    return state.bills
      .filter((bill) => {
        const dueDate = new Date(bill.dueDate);
        return dueDate >= today && dueDate <= futureDate;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const getOverdueBills = () => {
    const today = new Date();
    return state.bills.filter((bill) => new Date(bill.dueDate) < today);
  };

  const getSavingsProgress = (goalId) => {
    const goal = state.savingsGoals.find((g) => g.id === goalId);
    if (!goal) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getInvestmentPerformance = () => {
    return state.investments.reduce((total, investment) => {
      const currentValue = investment.currentValue || investment.initialAmount;
      const gain = currentValue - investment.initialAmount;
      return total + gain;
    }, 0);
  };

  const value = {
    ...state,
    dispatch,
    getTotalMonthlyIncome,
    getTotalMonthlyExpenses,
    getTotalMonthlyBills,
    getTotalMonthlyMortgage,
    getNetMonthlyIncome,
    getSavingsAmount,
    getInvestmentAmount,
    getDisposableIncome,
    getFamilyMemberById,
    getIncomeSourcesByMember,
    getExpensesByMember,
    getUpcomingBills,
    getOverdueBills,
    getSavingsProgress,
    getInvestmentPerformance,
  };

  return (
    <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
  );
};

FamilyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the family context
export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error("useFamily must be used within a FamilyProvider");
  }
  return context;
};
