import { useReducer, useEffect, useState } from "uu5g04-hooks";
import UU5 from "uu5g04";
import AppReducer from "./AppReducer";
import Config from "../config/config";
import Calls from "../calls";

const initialState = {
  transactions: []
  // transactions: JSON.parse(localStorage.getItem("transactions")) || []
};

export const GlobalContext = UU5.Common.Context.create(initialState);
export const GlobalProvider = ({ children }) => {
  const [data, setData] = useState(initialState);
  const [state, dispatch] = useReducer(AppReducer, data);
  const { transactions } = data;

  useEffect(() => {
    // localStorage.setItem("transactions", JSON.stringify(transactions));
    Calls.list().then(result => {
      setData({ transactions: result.data.itemList });
    });
  }, [state]);

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
