import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5g04-block-layout";
import { Session } from "uu_appg01_oidc";
import { Client as UuAppClient } from "uu_appg01";
import {
  PagingAutoLoad,
  usePagingListData,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  createComponent,
  createVisualComponent
} from "uu5g04-hooks";

let serverList = null;
const Client = {
  async get(uri, data) {
    // let response = await UuAppClient.get(uri, data);

    // mock loading of data so that loading next data page after delete/create/update doesn't
    // rollback those operations; we'll initially load (umocked) 100 items and then the rest will be mocked
    if (!serverList) {
      let response = await UuAppClient.get(uri, { ...data, pageInfo: { pageIndex: 0, pageSize: 100 } });
      serverList = response.data.itemList;
    }

    let { pageIndex = 0, pageSize } = data.pageInfo;
    console.log(
      uri
        .split("/")
        .slice(-2)
        .join("/") +
        "?pageInfo=" +
        JSON.stringify({ pageIndex, pageSize })
    );
    let itemList = serverList.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
    let response = { data: { itemList, pageInfo: { pageIndex, pageSize, total: serverList.length } } };

    let partialList = response.data.itemList;
    let oldLoadedList = await db.get();
    let loadedList = new Array(response.data.pageInfo.total).fill(undefined);
    let from = response.data.pageInfo.pageIndex * response.data.pageInfo.pageSize;
    let to = from + Math.min(from + response.data.pageInfo.pageSize, partialList.length);
    for (let i = 0; i < loadedList.length; i++)
      loadedList[i] = (from <= i && i < to ? partialList[i - from] : oldLoadedList[i]) || null;
    db.setSync(loadedList);

    return response;
  },

  async post(uri, data) {
    let list = db.getSync();
    let item;
    switch (uri.match(/[^/]+$/)[0]) {
      case "create":
        data = { ...data, id: UU5.Common.Tools.generateUUID() };
        list.push(data);
        if (serverList) serverList.push(data);
        item = data;
        break;
      case "update":
        let i = list.findIndex(item => item && item.id === data.id);
        item = list[i] = { ...list[i], ...data };
        if (serverList) serverList[serverList.findItem(item => item && item.id === data.id)] = item;
        break;
      case "delete":
        let j = list.findIndex(item => item && item.id === data.id);
        item = null;
        list.splice(j, 1);
        if (serverList) serverList.splice(serverList.findIndex(item => item && item.id === data.id), 1);
        break;
    }

    await db.set(list);
    return { data: JSON.parse(JSON.stringify(item)) };
  }
};

let error = false;
let localStorage = {};

class LocalStorage {
  static DELAY = 1000;

  constructor(key, defaultData = []) {
    this.key = key;
    this.defaultData = defaultData;
  }

  getSync() {
    let json = localStorage[this.key];
    return json ? JSON.parse(json) : JSON.parse(JSON.stringify(this.defaultData));
  }

  async get() {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!error) {
          resolve(this.getSync());
        } else {
          let error = new Error("Test Error");
          error.status = 500;
          reject(error);
        }
      }, this.constructor.DELAY);
    });
  }

  setSync(data = this.defaultData) {
    let json = JSON.stringify(data);
    localStorage[this.key] = json;
    return JSON.parse(json);
  }

  async set(data = this.defaultData) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!error) {
          resolve(this.setSync(data));
        } else {
          let error = new Error("Test Error");
          error.status = 500;
          reject(error);
        }
      }, this.constructor.DELAY);
    });
  }
}

const db = new LocalStorage("uu5g04-hooks-usepaginglistdata.0", []);

/*@@viewOn:example*/
const Calls = {
  async load(dtoIn) {
    console.log(dtoIn, "dtoIn");
    let commandUri = Calls.getCommandUri("transaction/list");
    let data = await Calls.call(
      "get",
      commandUri,
      // dtoIn
      {
        pageInfo: {
          // pageIndex: 10
          // pageSize: 100
        }
      }
    );
    return data;
  },

  async create(newJoke) {
    try {
      let commandUri = Calls.getCommandUri("transaction/create");
      let data = await Calls.call("post", commandUri, newJoke);
      return data;
    } catch (e) {
      return Promise.reject({ error: true }); // keep the created item, just mark it as being in error state
    }
  },

  async update(id, updatedJoke) {
    try {
      let commandUri = Calls.getCommandUri("transaction/update");
      let data = await Calls.call("post", commandUri, { ...updatedJoke, id, error: undefined });
      return data;
    } catch (e) {
      return Promise.reject({ error: true }); // keep the updated item, just mark it as being in error state
    }
  },

  async delete(id) {
    try {
      let commandUri = Calls.getCommandUri("transaction/delete");
      let data = await Calls.call("post", commandUri, { id });
      return data;
    } catch (e) {
      return Promise.reject({ error: true }); // keep the deleted item, just mark it as being in error state
    }
  }
};
/*@@viewOff:example*/

// server mock
Calls.getCommandUri = useCase => {
  return "http://localhost:8080/expence-tracker-maing01/22222222222222222222222222222222/" + useCase;
};
Calls.call = async (method, uri, dtoIn) => {
  let response = await Client[method](uri, dtoIn);
  return response.data;
};

const Joke = createVisualComponent({
  propTypes: {
    data: UU5.PropTypes.shape({
      id: UU5.PropTypes.string,
      name: UU5.PropTypes.string,
      text: UU5.PropTypes.string,
      error: UU5.PropTypes.bool
    }),
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func
  },

  defaultProps: {
    data: {},
    onUpdate: undefined,
    onDelete: undefined
  },

  render(props) {
    let attrs = UU5.Common.VisualComponent.getAttrs(props);
    return (
      <UU5.BlockLayout.Tile {...attrs} colorSchema={props.data.error ? "danger" : undefined}>
        <UU5.BlockLayout.Block
          actions={[
            {
              content: "Update",
              icon: "mdi-update",
              active: true,
              colorSchema: "primary",
              onClick: () => props.onUpdate(props.data)
            },
            {
              content: "Delete",
              icon: "mdi-delete",
              active: true,
              colorSchema: "danger",
              onClick: () => props.onDelete(props.data)
            }
          ]}
        >
          <UU5.BlockLayout.Row weight="primary" ellipses>
            {props.data.name}
          </UU5.BlockLayout.Row>
          <UU5.BlockLayout.Row>{props.data.text}</UU5.BlockLayout.Row>
        </UU5.BlockLayout.Block>
      </UU5.BlockLayout.Tile>
    );
  }
});

/*@@viewOn:example*/
function Example({ pessimistic }) {
  let pageSize = 100;
  let pageIndex = 10;
  let listDataValues = usePagingListData({
    onLoad: Calls.load,
    onCreate: Calls.create,
    onUpdate: Calls.update,
    onDelete: Calls.delete
    // pageIndex,
    // pageSize
  });
  let {
    viewState,
    errorState,
    error,
    syncData,
    asyncData,
    pageInfo,
    operations,
    handleLoad,
    handleCreate,
    handleUpdate,
    handleDelete
  } = listDataValues;
  let data = pessimistic ? asyncData : syncData;
  let modalRef = useRef();

  let firstNotYetLoadedIndex = data ? data.findIndex(it => it == null) : 0;
  let dataToRender = data && firstNotYetLoadedIndex >= 0 ? data.slice(0, firstNotYetLoadedIndex) : data || [];

  useEffect(() => {
    console.table(operations, ["id", "type", "state", "result", "args"]);
  }, [operations]);

  function showModal(joke, onSave) {
    let modal = modalRef.current;
    modal.open({
      header: joke ? "Edit Joke" : "Create Joke",
      content: (
        <UU5.Forms.Form
          key={UU5.Common.Tools.generateUUID()}
          onSave={opt => {
            if (!pessimistic) {
              modal.close();
            }
            onSave(opt);
          }}
          onSaveDone={
            pessimistic
              ? opt => {
                  modal.close();
                }
              : undefined
          }
          onSaveFail={
            pessimistic
              ? opt => {
                  opt.component.getAlertBus().setAlert({
                    content: `${joke ? "Updating" : "Creating"} on server failed.`,
                    colorSchema: "danger"
                  });
                }
              : undefined
          }
          onCancel={() => modal.close()}
        >
          <UU5.Forms.Text label="Name" name="name" value={joke ? joke.name : undefined} />
          <UU5.Forms.TextArea label="Text" name="text" value={joke ? joke.text : undefined} />
          <UU5.Forms.Controls />
        </UU5.Forms.Form>
      )
    });
  }

  return (
    <UU5.Bricks.Div>
      <UU5.Bricks.Button
        disabled={!data}
        onClick={() => {
          handleLoad({ pageInfo: { pageIndex: 1 } }, true)
            .then(data => console.log("load ok", data))
            .catch(data => console.log("load ko", data));
        }}
      >
        Load 2nd page & merge
      </UU5.Bricks.Button>
      <UU5.Bricks.Button
        disabled={!data}
        onClick={() => {
          handleLoad()
            .then(data => console.log("load ok", data))
            .catch(data => console.log("load ko", data));
        }}
      >
        Load 1st page & reset others
      </UU5.Bricks.Button>
      <UU5.Bricks.Button
        disabled={!data}
        colorSchema="success"
        onClick={() => {
          showModal(null, ({ component, values }) => {
            handleCreate({ id: UU5.Common.Tools.generateUUID(), ...values })
              .then(data => {
                component.saveDone(data);
                console.log("create ok", data);
              })
              .catch(data => {
                component.saveFail(data);
                console.log("create ko", data);
              });
          });
        }}
      >
        Create
      </UU5.Bricks.Button>
      <UU5.Bricks.Pre className="margin">
        {JSON.stringify(
          {
            viewState,
            errorState,
            error,
            data: data ? JSON.stringify(data).replace(/"/g, "'") : null,
            handleLoad: "handleLoad(dtoIn)",
            handleCreate: "handleCreate(newItem)",
            handleUpdate: "handleUpdate(id, updatedItem)",
            handleDelete: "handleDelete(id)"
          },
          null,
          2
        )}
      </UU5.Bricks.Pre>

      <UU5.Bricks.Row display="flex">
        {dataToRender.map(item => (
          <UU5.Bricks.Column colWidth="m-6 l-4 xl-3" key={item.id}>
            <Joke
              data={item}
              onUpdate={itemData => {
                showModal(itemData, ({ component, values }) => {
                  handleUpdate(itemData.id, { ...itemData, error: false, ...values }).then(
                    data => {
                      component.saveDone(data);
                      console.log("update ok", data);
                    },
                    data => {
                      component.saveFail(data);
                      console.log("update ko", data);
                    }
                  );
                });
              }}
              onDelete={itemData => {
                handleDelete(itemData.id).then(
                  data => console.log("delete ok", data),
                  data => console.log("delete ko", data)
                );
              }}
            />
          </UU5.Bricks.Column>
        ))}
      </UU5.Bricks.Row>

      <PagingAutoLoad
        data={data}
        handleLoad={handleLoad}
        distance={window.innerHeight}
        pageSize={pageSize}
        error={({ error, reload }) => (
          <UU5.Bricks.Button onClick={() => reload()} content="Load more (auto-load failed)" />
        )}
      >
        <UU5.Bricks.Loading />
        <UU5.Bricks.Div className="uu5-common-center">(loading {pageSize} more...)</UU5.Bricks.Div>
      </PagingAutoLoad>

      <UU5.Bricks.Modal controlled={false} ref_={modalRef} />
    </UU5.Bricks.Div>
  );
}
/*@@viewOff:example*/

const Page = createVisualComponent({
  render(props) {
    let [pessimistic, setPessimistic] = useState(false);
    let [errorFlag, setErrorFlag] = useState(false);

    return (
      <UU5.Bricks.Container>
        <UU5.Forms.Checkbox
          label="Pessimistic"
          inputWidth="32px"
          value={pessimistic}
          onChange={({ value }) => setPessimistic(value)}
        />
        <UU5.Forms.Checkbox
          label="Server Error"
          inputWidth="32px"
          value={errorFlag}
          onChange={({ value }) => {
            error = value;
            setErrorFlag(value);
          }}
        />

        <Example pessimistic={pessimistic} />
      </UU5.Bricks.Container>
    );
  }
});

const AuthPage = createVisualComponent({
  render() {
    return (
      <UU5.Common.Session session={Session.currentSession}>
        <UU5.Common.Identity>
          {({ identity, login, logout, ...opt }) => {
            return identity ? (
              <Page />
            ) : identity === null ? (
              <UU5.Bricks.Button onClick={() => login()} content="Log in" />
            ) : null;
          }}
        </UU5.Common.Identity>
      </UU5.Common.Session>
    );
  }
});

export default AuthPage;
