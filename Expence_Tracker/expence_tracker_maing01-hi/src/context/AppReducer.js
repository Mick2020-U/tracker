import Config from "../config/config";

export default (state, action) => {
  switch (action.type) {
    case Config.ACTION_TYPE.DELETE_TRANSACTION:
      return { ...state, transactions: state.transactions.filter(transaction => transaction.id !== action.payload) };
    case Config.ACTION_TYPE.ADD_TRANSACTION:
      return { ...state, transactions: [action.payload, ...state.transactions] };
    default:
      return state;
  }
};
