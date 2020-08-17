//@@viewOn:imports
import { createVisualComponent, useContext } from "uu5g04-hooks";
import "uu5g04-bricks";
import { GlobalContext } from "../context/GlobalState";
import Transaction from "./Transaction";
import Calls from "../calls";
//@@viewOff:imports

const TransactionList = createVisualComponent({
  //@@viewOn:statics
  displayName: "UU5.Demo.TransactionList",
  nestingLevel: "box",
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks
    const { transactions } = useContext(GlobalContext);

    //@@viewOff:hooks

    //@@viewOn:render
    return (
      <>
        <h3>History</h3>
        <ul className="list">
          {transactions.length ? (
            transactions.map(transaction => <Transaction transaction={transaction} key={transaction.id} />)
          ) : (
            <h1>Loading history...</h1>
          )}
        </ul>
      </>
    );
    //@@viewOff:render
  }
});

export default TransactionList;
