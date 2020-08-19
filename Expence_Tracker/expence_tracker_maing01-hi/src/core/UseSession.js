import { createVisualComponent, useSession, SessionProvider } from "uu5g04-hooks";
import UU5 from "uu5g04";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: "UU5.Bricks.Identity",
  nestingLevel: "box"
  //@@viewOff:statics
};

const Identity = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    lsi: UU5.PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    lsi: {}
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    const { sessionState, identity, isExpiring, login, logout } = useSession();
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    const attrs = UU5.Common.VisualComponent.getAttrs(props);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    let name = null,
      buttonProps;
    switch (sessionState) {
      case "authenticated":
        name = identity.name;
        buttonProps = {
          onClick: () => logout(),
          children: "Logout"
        };
        break;
      case "notAuthenticated":
        name = "Logged out";
        buttonProps = {
          onClick: () => login(),
          children: "Login"
        };
        break;
      default:
        name = "Pending...";
    }

    // console.log("identity", identity, isExpiring, sessionState);
    const { uuIdentity } = identity;

    return currentNestingLevel ? (
      <div {...attrs}>
        <h4>Username is:</h4> <h2>{name}</h2>{" "}
        {buttonProps && <UU5.Bricks.Button colorSchema={"danger"} {...buttonProps} />}
        <div>
          <h3>uuIdentity is:</h3>
          <h5>{uuIdentity}</h5>
        </div>
      </div>
    ) : null;
    //@@viewOn:render
  }
});

export default Identity;
