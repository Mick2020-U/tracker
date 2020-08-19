//@@viewOn:imports
import { createVisualComponent, useLsi } from "uu5g04-hooks";
import "uu5g04-bricks";
import UU5 from "uu5g04";
//@@viewOff:imports

const LanguageLabel = createVisualComponent({
  //@@viewOn:statics
  displayName: "UU5.Demo.Language.Label",
  nestingLevel: "box",
  propTypes: {
    lsi: UU5.PropTypes.object
  },
  defaultProps: {
    lsi: {}
  },
  //@@viewOff:statics

  render() {
    const item = useLsi({ cs: "Jméno", en: "Name" });
    const inputLsi = useLsi({
      cs: { placeholder: "Jméno Příjmení", message: "Vložte jméno a příjmení." },
      en: { placeholder: "Name Surname", message: "Insert name and surname." }
    });
    //@@viewOn:hooks
    //@@viewOff:hooks

    //@@viewOn:render
    return (
      <>
        <UU5.Bricks.LanguageSelector displayedLanguages={["en", "cs"]} />
        <UU5.Forms.Text label={item} placeholder={inputLsi.placeholder} message={inputLsi.message} />
      </>
    );
    //@@viewOff:render
  }
});

export default LanguageLabel;
