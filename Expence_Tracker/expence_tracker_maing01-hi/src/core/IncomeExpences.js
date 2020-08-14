//@@viewOn:imports
import { createVisualComponent, useContext } from "uu5g04-hooks";
import "uu5g04-bricks";
import { GlobalContext } from "../context/GlobalState";
//@@viewOff:imports

const IncomeExpenses = createVisualComponent({
  //@@viewOn:statics
  displayName: "UU5.Demo.IncomeExpenses",
  nestingLevel: "box",
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks
    //@@viewOff:hooks
    const { transactions } = useContext(GlobalContext);
    const amounts = transactions.map(transaction => transaction.amount);

    const income = amounts
      .filter(item => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);

    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);
    //@@viewOn:render
    return (
      <div className="inc-exp-container">
        <div>
          <h4>Income</h4>
          <p className="money plus">{income}</p>
        </div>
        <div>
          <h4>Outcome</h4>
          <p className="money minus">{expense}</p>
        </div>
      </div>
    );
    //@@viewOff:render
  }
});

export default IncomeExpenses;
