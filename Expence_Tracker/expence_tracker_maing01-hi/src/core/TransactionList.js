//@@viewOn:imports
import { createVisualComponent, useContext } from "uu5g04-hooks";
import "uu5g04-bricks";
import UU5 from "uu5g04";
import { GlobalContext } from "../context/GlobalState";
import Transaction from "./Transaction";
import Calls from "../calls";
import AuthPage from "./use-paging-list-data";
//@@viewOff:imports

const TransactionList = createVisualComponent({
  //@@viewOn:statics
  displayName: "UU5.Demo.TransactionList",
  nestingLevel: "box",
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks
    const { transactions } = useContext(GlobalContext);
    const _handleRedirect = () => {
      UU5.Environment.setRoute({
        component: <AuthPage />,
        url: { useCase: "list", parameters: {} }
      });
    };
    //@@viewOff:hooks

    //@@viewOn:render
    return (
      <>
        <UU5.Bricks.Button colorSchema={"info"} onClick={_handleRedirect} content={"Look at history"} />
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
