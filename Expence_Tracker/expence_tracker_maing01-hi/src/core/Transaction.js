//@@viewOn:imports
import { createVisualComponent, useContext } from "uu5g04-hooks";
import "uu5g04-bricks";
import UU5 from "uu5g04";
import { GlobalContext } from "../context/GlobalState";
//@@viewOff:imports

const Transaction = createVisualComponent({
  //@@viewOn:statics
  displayName: "UU5.Demo.Transaction",
  // nestingLevel: "box",
  //@@viewOff:statics

  render({ transaction }) {
    const { deleteTransaction } = useContext(GlobalContext);
    const sign = transaction.amount < 0 ? "-" : "+";

    //@@viewOn:hooks
    //@@viewOff:hooks

    //@@viewOn:render
    return (
      <li className={transaction.amount < 0 ? "minus" : "plus"}>
        {transaction.text}
        <UU5.Bricks.Span>
          {sign}${Math.abs(transaction.amount)}
        </UU5.Bricks.Span>
        <button onClick={() => deleteTransaction(transaction.id)} className="delete-btn">
          X
        </button>
      </li>
    );
    //@@viewOff:render
  }
});

export default Transaction;
