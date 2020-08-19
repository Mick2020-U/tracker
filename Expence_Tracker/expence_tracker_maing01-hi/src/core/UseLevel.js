//@@viewOn:imports
import { createVisualComponent, useLevel, LevelProvider } from "uu5g04-hooks";
import "uu5g04-bricks";
import UU5 from "uu5g04";
//@@viewOff:imports

const STATICS = {
  displayName: "UU5.Demo.Level",
  nestingLevel: "box"
};

const UseLevel = createVisualComponent({
  //@@viewOn:statics
  ...STATICS,
  displayName: "UU5.Demo.UseLevel",
  nestingLevel: "box",
  //@@viewOff:statics

  render(props) {
    //@@viewOn:hooks
    const level = useLevel(); // level used by parent
    let myLevel = level != null ? level + 1 : 0; // make my level bigger than parent's
    console.log("level", myLevel);
    //@@viewOff:hooks

    //@@viewOn:render
    const attrs = UU5.Common.VisualComponent.getAttrs(props, UU5.Common.Css.css({ opacity: 1 - 0.05 * myLevel }));
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
       Level is {myLevel}.<LevelProvider level={myLevel}>{props.children}</LevelProvider>
      </div>
    ) : null;
    //@@viewOff:render
  }
});

export default UseLevel;
