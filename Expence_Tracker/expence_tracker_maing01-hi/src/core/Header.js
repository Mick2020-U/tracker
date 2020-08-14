//@@viewOn:imports
import { createVisualComponent } from "uu5g04-hooks";
import "uu5g04-bricks";
import UU5 from "uu5g04";
//@@viewOff:imports

const Header = createVisualComponent({
  //@@viewOn:statics
  displayName: "UU5.Demo.Header",
  nestingLevel: "box",
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks
    //@@viewOff:hooks

    //@@viewOn:render
    return <UU5.Bricks.Header level="0" className="header" content={"Money Manager"} />;
    //@@viewOff:render
  }
});

export default Header;
