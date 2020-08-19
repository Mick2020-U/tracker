//@@viewOn:imports
import { createVisualComponent, useState, useContext, useLsi } from "uu5g04-hooks";
import "uu5g04-bricks";
import UU5 from "uu5g04";
import { GlobalContext } from "../context/GlobalState";
//@@viewOff:imports

const AddTransaction = createVisualComponent({
  //@@viewOn:statics
  displayName: "UU5.Demo.AddTransaction",
  nestingLevel: "box",
  propTypes: {
    lsi: UU5.PropTypes.object
  },
  defaultProps: {
    lsi: {}
  },
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks
    const [text, setText] = useState("");
    const [amount, setAmount] = useState(0);
    //@@viewOff:hooks
    const { addTransaction } = useContext(GlobalContext);
    const expense = useLsi({ cs: "Zadejte výdaje", en: "Enter expense" });
    const price = useLsi({ cs: "Zadejte cenu", en: "Enter price" });
    const addExpense = useLsi({ cs: "Přidat výdaje", en: "Add Expense" });
    const inputLsi = useLsi({
      cs: { placeholder: "Zadejte výdaje", message: "Vložte jméno a příjmení." },
      en: { placeholder: "Enter expense", message: "Insert name and surname." }
    });

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
        <UU5.Bricks.LanguageSelector displayedLanguages={["en", "cs"]} />
        <div className="form-control">
          <label htmlFor="text">{expense}</label>
          <input
            type="text"
            required={true}
            value={text}
            onChange={e => setText(e.target.value)}
            label={expense}
            placeholder={inputLsi.placeholder}
          />
          {/*<input label={item} placeholder={inputLsi.placeholder} message={inputLsi.message} />*/}
        </div>
        <div className="form-control">
          <label htmlFor="amount">{price}</label>
          <input
            required={true}
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter price..."
          />
        </div>
        <button className="btn">{addExpense}</button>
      </UU5.Forms.Form>
    );
    //@@viewOff:render
  }
});

export default AddTransaction;
