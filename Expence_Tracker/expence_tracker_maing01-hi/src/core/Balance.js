//@@viewOn:imports
import { createVisualComponent, useContext } from "uu5g04-hooks";
import "uu5g04-bricks";
import { GlobalContext } from "../context/GlobalState";
//@@viewOff:imports

const Balance = createVisualComponent({
  //@@viewOn:statics
  displayName: "UU5.Demo.Balance",
  nestingLevel: "box",
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks
    //@@viewOff:hooks
    const { transactions } = useContext(GlobalContext);
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    //@@viewOn:render
    return (
      <>
        <h4 className=""> Balance </h4>
        <h1>${total}</h1>
      </>
    );
    //@@viewOff:render
  }
});

export default Balance;
