//@@viewOn:imports
import { createVisualComponent, useState, useContext } from "uu5g04-hooks";
import "uu5g04-bricks";
import UU5 from "uu5g04";
import { GlobalContext } from "../context/GlobalState";
//@@viewOff:imports

const AddTransaction = createVisualComponent({
  //@@viewOn:statics
  displayName: "UU5.Demo.AddTransaction",
  nestingLevel: "box",
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks
    const [text, setText] = useState("");
    const [amount, setAmount] = useState(0);
    //@@viewOff:hooks
    const { addTransaction } = useContext(GlobalContext);

    const onSubmit = () => {
      const newTransaction = {
        id: Math.floor(Math.random() * 100),
        text,
        amount: +amount
      };
      addTransaction(newTransaction);
      setText("");
      setAmount(0);
    };
    //@@viewOn:render
    return (
      <UU5.Forms.Form onSave={onSubmit}>
        <h3>Add new Expense</h3>
        <div className="form-control">
          <label htmlFor="text">Expense name</label>
          <input
            type="text"
            required={true}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter Expense..."
          />
        </div>
        <div className="form-control">
          <label htmlFor="amount">Price</label>
          <input
            required={true}
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter price..."
          />
        </div>
        <button className="btn">Add Activity</button>
      </UU5.Forms.Form>
    );
    //@@viewOff:render
  }
});

export default AddTransaction;
