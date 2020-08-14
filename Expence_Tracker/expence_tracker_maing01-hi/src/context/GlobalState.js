import { useReducer, useEffect } from "uu5g04-hooks";
import UU5 from "uu5g04";
import AppReducer from "./AppReducer";
import Config from "../config/config";

const initialState = {
  transactions: JSON.parse(localStorage.getItem("transactions")) || []
};

export const GlobalContext = UU5.Common.Context.create(initialState);
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const { transactions } = state;

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const deleteTransaction = id => {
    dispatch({ type: Config.ACTION_TYPE.DELETE_TRANSACTION, payload: id });
  };

  function addTransaction(transaction) {
    dispatch({ type: Config.ACTION_TYPE.ADD_TRANSACTION, payload: transaction });
  }

  return (
    <GlobalContext.Provider value={{ transactions, deleteTransaction, addTransaction }}>
      {children}
    </GlobalContext.Provider>
  );
};
