//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, SessionProvider, useUnmountedRef } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import { Session } from 'uu_appg01_oidc';
import Config from "./config/config.js";
import Header from "../core/Header";
import "./home.css";
import Balance from "../core/Balance";
import IncomeExpenses from "../core/IncomeExpences";
import TransactionList from "../core/TransactionList";
import AddTransaction from "../core/AddTransaction";
import { GlobalProvider } from "../context/GlobalState";
import Identity from "../core/UseSession";
import Page from "../core/useDataList";
import Example from "../core/useDataList";
import AuthPage from "../core/use-paging-list-data";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Home",
  nestingLevel: "box"
  //@@viewOff:statics
};

const CLASS_NAMES = {
  welcomeRow: () => Config.Css.css`
    padding: 56px 0 20px;
    max-width: 624px;
    margin: 0 auto;
    text-align: center;

    ${UU5.Utils.ScreenSize.getMinMediaQueries("s", `text-align: left;`)}

    .uu5-bricks-header {
      margin-top: 8px;
    }

    .plus4u5-bricks-user-photo {
      margin: 0 auto;
    }
  `
};

export const Home = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = UU5.Common.VisualComponent.getAttrs(props);
    return (
      <div {...attrs} className="totalWrapper">
        <Plus4U5.App.ArtifactSetter territoryBaseUri="" artifactId="" />
        <GlobalProvider>
          {/*<LanguageLabel/>*/}
          <SessionProvider session={Session.currentSession}>
            <Identity />
          </SessionProvider>
          <Header />
          <div className="container">
            <Balance />
            <IncomeExpenses />
            <TransactionList />
            <AddTransaction />
            {/*<AuthPage/>*/}
            {/*<Example/>*/}
            {/*<Page/>*/}
            {/*<UU5.Bricks.Container>*/}
            {/*  <UseLevel>*/}
            {/*    <UseLevel>*/}
            {/*      <UseLevel>*/}
            {/*        <UseLevel>*/}
            {/*          <UseLevel>*/}
            {/*            <UU5.Bricks.Section header="Nested Level">*/}
            {/*              <UseLevel />*/}
            {/*            </UU5.Bricks.Section>*/}
            {/*          </UseLevel>*/}
            {/*        </UseLevel>*/}
            {/*      </UseLevel>*/}
            {/*    </UseLevel>*/}
            {/*  </UseLevel>*/}
            {/*</UU5.Bricks.Container>*/}
          </div>
        </GlobalProvider>

        {/*<UU5.Bricks.Row className={CLASS_NAMES.welcomeRow()}>*/}
        {/*  <UU5.Bricks.Column colWidth="x-12 s-3">*/}
        {/*    <Plus4U5.Bricks.UserPhoto width="100px" />*/}
        {/*  </UU5.Bricks.Column>*/}
        {/*  <UU5.Bricks.Column colWidth="x-12 s-9">*/}
        {/*    <UU5.Bricks.Header level="2" content={<UU5.Bricks.Lsi lsi={Lsi.auth.welcome} />} />*/}
        {/*    <UU5.Common.Identity>*/}
        {/*      {({ identity }) => <UU5.Bricks.Header level="2" content={identity.name} />}*/}
        {/*    </UU5.Common.Identity>*/}
        {/*  </UU5.Bricks.Column>*/}
        {/*</UU5.Bricks.Row>*/}
        {/*<WelcomeRow textPadding="14px" icon="mdi-human-greeting">*/}
        {/*  <UU5.Bricks.Lsi lsi={Lsi.auth.intro} />*/}
        {/*</WelcomeRow>*/}
        {/*<WelcomeRow textPadding="10px" icon="mdi-monitor">*/}
        {/*  <UU5.Bricks.Lsi lsi={Lsi.auth.clientSide} />*/}
        {/*</WelcomeRow>*/}
        {/*<WelcomeRow textPadding="8px" icon="mdi-server">*/}
        {/*  <UU5.Bricks.Lsi lsi={Lsi.auth.serverSide} />*/}
        {/*</WelcomeRow>*/}
      </div>
    );
    //@@viewOff:render
  }
});

export default Home;
