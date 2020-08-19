import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5g04-block-layout";
import {
  useDataList,
  createVisualComponent,
  useState,
  useRef,
  PagingAutoLoad,
  useMemo,
  useCallback,
  useEffect,
  usePreviousValue,
  useUnmountedRef
} from "uu5g04-hooks";
import { Session } from "uu_appg01_oidc";
import { Client } from "uu_appg01";

let callDelay = 1500;
let error = false;

const Calls = {
  // ...
  load(dtoIn) {
    const commandUri = Calls.getCommandUri("transaction/list");
    return Calls.call("get", commandUri, dtoIn);
  },

  loadItem(dtoIn) {
    const commandUri = Calls.getCommandUri("transaction/get");
    return Calls.call("get", commandUri, dtoIn);
  },

  updateItem(newData) {
    const commandUri = Calls.getCommandUri("transaction/update");
    return Calls.call("post", commandUri, newData);
  },

  createItem(newData) {
    const commandUri = Calls.getCommandUri("transaction/create");
    return Calls.call("post", commandUri, newData);
  },

  deleteItem(dtoIn) {
    const commandUri = Calls.getCommandUri("transaction/delete");
    return Calls.call("post", commandUri, dtoIn);
  }
};

const Joke = UU5.Common.Component.memo(
  createVisualComponent({
    render(props) {
      const { onUpdate, onDelete, data, processingItem = {} } = props;
      const attrs = UU5.Common.VisualComponent.getAttrs(props);
      return (
        <UU5.BlockLayout.Tile {...attrs} colorSchema={processingItem.errorData ? "danger" : undefined}>
          <UU5.BlockLayout.Block
            actions={[
              {
                content: "Update",
                icon: "mdi-update",
                active: true,
                disabled: !onUpdate,
                colorSchema: "primary",
                onClick: () => onUpdate(processingItem)
              },
              {
                content: "Delete",
                icon: "mdi-delete",
                active: true,
                disabled: !onDelete,
                colorSchema: "danger",
                onClick: () => onDelete(processingItem)
              }
            ]}
          >
            <UU5.BlockLayout.Row weight="primary" ellipses>
              {data.name}
            </UU5.BlockLayout.Row>
            <UU5.BlockLayout.Row>{data.text}</UU5.BlockLayout.Row>
          </UU5.BlockLayout.Block>
        </UU5.BlockLayout.Tile>
      );
    }
  })
);

const ControlPanel = createVisualComponent({
  render(props) {
    const { dataListResult } = props;
    const { state, data, newData, errorData, pendingData, handlerMap } = dataListResult;
    const [errorFlag, setErrorFlag] = useState(false);

    return (
      <UU5.Bricks.Panel
        className={UU5.Common.Css.css`margin: 16px 0;`}
        iconExpanded="mdi-chevron-up"
        iconCollapsed="mdi-chevron-down"
        mountContent="onFirstExpand"
        expanded={false}
        controlled={false}
        header="Settings"
      >
        <UU5.Forms.Checkbox
          label="Server Error"
          inputWidth="32px"
          value={errorFlag}
          onChange={({ value }) => {
            error = value;
            setErrorFlag(value);
          }}
        />
        <UU5.Forms.Slider
          label="Server Call Delay [ms]"
          labelWidth="auto"
          value={callDelay}
          controlled={false}
          onChange={opt => {
            opt.component.onChangeDefault(opt);
            callDelay = opt.value;
          }}
          min={0}
          max={5000}
          step={500}
        />
        <UU5.Bricks.Pre className={UU5.Common.Css.css`height: 400px; overflow: auto;`}>
          {JSON.stringify(
            {
              state,
              data: data ? JSON.stringify(data).replace(/"/g, "'") : null,
              newData: newData ? JSON.stringify(newData).replace(/"/g, "'") : null,
              pendingData: pendingData ? JSON.stringify(pendingData).replace(/"/g, "'") : null,
              errorData,
              handlerMap: Object.keys(handlerMap).reduce((r, k) => ((r[k] = handlerMap[k] ? "fn(...)" : null), r), {}),
              "data[0].handlerMap":
                data && data[0]
                  ? Object.keys(data[0].handlerMap).reduce(
                      (r, k) => ((r[k] = data[0].handlerMap[k] ? "fn(...)" : null), r),
                      {}
                    )
                  : null
            },
            null,
            2
          )}
        </UU5.Bricks.Pre>
      </UU5.Bricks.Panel>
    );
  }
});
const Example = createVisualComponent({
  render() {
    const pageSize = 8;
    const dataListResult = useDataList({
      pageSize,
      handlerMap: {
        load: Calls.load,
        createItem: Calls.createItem
      },
      itemHandlerMap: {
        load: Calls.loadItem,
        update: Calls.updateItem,
        delete: Calls.deleteItem
      }
      // skipInitialLoad: false,
      // initialDtoIn: undefined,
      // initialData: undefined, // [{"name":"A0 Skydiving","text":"Why don't blind people skydive? Because it scares the crap out of their dogs.","averageRating":0,"ratingCount":0,"visibility":false,"uuIdentity":"127-0000-0000-1","uuIdentityName":"Milan Šatka","awid":"4ef6a7b01b5942ecbfb925b249af987f","categoryList":[],"sys":{"cts":"2020-06-09T08:23:30.699Z","mts":"2020-06-09T08:23:30.699Z","rev":0},"id":"5edf47021d5ce800255e7000","uuAppErrorMap":{}}]
    });
    const { state, data, newData, errorData, pendingData, handlerMap } = dataListResult;
    console.log(dataListResult);

    const modalRef = useRef();
    const alertBusRef = useRef();

    const [shownPageIndex, setShownPageIndex] = useState(0);
    const dataToRender = data ? data.slice(shownPageIndex * pageSize, shownPageIndex * pageSize + pageSize) : [];
    const notLoadedItemsCount = !data ? pageSize : dataToRender.filter(it => it == null).length;
    const total = data ? data.length : 0;
    const unmountedRef = useUnmountedRef();
    const currentValuesRef = useRef();
    currentValuesRef.current = { data, shownPageIndex }; // so that async handling after item creation has access to current values

    const onPaginationChange = useCallback((pagination, newIndex) => {
      setShownPageIndex(cur => (newIndex === "next" ? cur + 1 : newIndex === "prev" ? cur - 1 : newIndex));
    }, []);

    const prevShownPageIndex = usePreviousValue(shownPageIndex, 0);
    useEffect(() => {
      const isLoad = (state === "pending" || state === "pendingNoData") && pendingData.operation === "load";
      const isLoadNextWithCurrentPage =
        (state === "pending" || state === "pendingNoData") &&
        pendingData.operation === "loadNext" &&
        pendingData.dtoIn.pageInfo.pageIndex === shownPageIndex;
      const isLoadNextWithCurrentPageError =
        (state === "error" || state === "errorNoData") &&
        errorData.operation === "loadNext" &&
        errorData.dtoIn.pageInfo.pageIndex === shownPageIndex;
      const skip = notLoadedItemsCount === 0 || isLoad || isLoadNextWithCurrentPage || isLoadNextWithCurrentPageError;
      if (!skip) {
        handlerMap.loadNext({ pageInfo: { pageIndex: shownPageIndex } });
      }
    }, [notLoadedItemsCount, shownPageIndex, prevShownPageIndex, handlerMap.loadNext]);

    const showModal = useCallback((joke, onSave) => {
      const modal = modalRef.current;
      modal.open({
        header: joke ? "Edit Joke" : "Create Joke",
        content: (
          <UU5.Forms.Form
            onSave={onSave}
            onSaveDone={opt => {
              modal.close();
            }}
            onSaveFail={opt => {
              opt.component
                .getAlertBus()
                .setAlert({ content: `${joke ? "Updating" : "Creating"} on server failed.`, colorSchema: "danger" });
            }}
            onCancel={() => modal.close()}
            controlled={false}
          >
            <UU5.Forms.Text label="Name" name="name" value={joke ? joke.name : undefined} controlled={false} />
            <UU5.Forms.TextArea label="Text" name="text" value={joke ? joke.text : undefined} controlled={false} />
            <UU5.Forms.Controls controlled={false} />
          </UU5.Forms.Form>
        )
      });
    }, []);

    const handleJokeUpdate = useCallback(
      item => {
        showModal(item.data, async ({ component, values }) => {
          let data, error;
          try {
            data = await item.handlerMap.update(values);
          } catch (e) {
            error = e;
          }
          if (unmountedRef.current) return;
          if (error) component.saveFail(error);
          else component.saveDone(data);
        });
      },
      [showModal, unmountedRef]
    );

    const handleJokeDelete = useCallback(item => {
      item.handlerMap.delete();
    }, []);

    return (
      <UU5.Bricks.Div>
        <UU5.Bricks.Button
          disabled={!handlerMap.createItem}
          colorSchema="success"
          onClick={() => {
            showModal(null, async ({ component, values }) => {
              let data, error;
              try {
                data = await handlerMap.createItem(values);
              } catch (e) {
                error = e;
              }
              if (unmountedRef.current) return;
              if (error) component.saveFail(error);
              else component.saveDone(data);
              alertBusRef.current.setAlert({
                content: error ? (
                  `Creating joke '${values.name}' failed.`
                ) : (
                  <div>
                    Joke{" "}
                    <UU5.Bricks.Link
                      onClick={() => {
                        let { data: allData } = currentValuesRef.current;
                        let index = allData.findIndex(item => item && item.data.id === data.id);
                        if (index !== -1) setShownPageIndex(Math.floor(index / pageSize));
                        else UU5.Common.Tools.scrollToTarget(data.id);
                      }}
                    >
                      {data.name}
                    </UU5.Bricks.Link>{" "}
                    has been created.
                  </div>
                ),
                colorSchema: error ? "danger" : undefined
              });
              // let { shownPageIndex } = currentValuesRef.current;
              // handlerMap.load({ pageInfo: { pageIndex: shownPageIndex } });
            });
          }}
        >
          Create item
        </UU5.Bricks.Button>{" "}
        <UU5.Bricks.Button
          disabled={!handlerMap.load}
          onClick={() => handlerMap.load({ pageInfo: { pageIndex: shownPageIndex } })}
        >
          Load current page & reset others
        </UU5.Bricks.Button>{" "}
        <ControlPanel dataListResult={dataListResult} />
        <UU5.Bricks.AlertBus ref_={alertBusRef} />
        <UU5.Bricks.Section header="New Data" level={3}>
          {newData.length === 0 ? (
            "No new data."
          ) : (
            <UU5.Bricks.Row display="flex">
              {newData.map(item => (
                <UU5.Bricks.Column colWidth="m-6 l-4 xl-3" key={item.data.id}>
                  <Joke
                    id={item.data.id}
                    data={item.data}
                    onUpdate={!item.handlerMap.update ? null : handleJokeUpdate}
                    onDelete={!item.handlerMap.delete ? null : handleJokeDelete}
                    processingItem={item}
                  />
                </UU5.Bricks.Column>
              ))}
            </UU5.Bricks.Row>
          )}
        </UU5.Bricks.Section>
        <UU5.Bricks.Section header="Data" level={3}>
          <UU5.Bricks.Pagination
            activeIndex={shownPageIndex}
            items={new Array(Math.ceil(total / pageSize)).fill(null).map((_, i) => i + 1)}
            onChange={onPaginationChange}
            disabled={!data || !handlerMap.loadNext}
          />
          <UU5.Bricks.Row display="flex">
            {notLoadedItemsCount > 0 && (state === "error" || state === "errorNoData") ? (
              <UU5.Bricks.Button
                content="Reload (load failed)"
                onClick={() => handlerMap.loadNext({ pageInfo: { pageIndex: shownPageIndex } })}
              />
            ) : !data || (notLoadedItemsCount > 0 && notLoadedItemsCount === dataToRender.length) ? (
              // there's no item loaded in this data page => show 1 loading for whole page
              // (if there's 1 or more already-loaded items in the current data page then
              // we'll show 1/more loading indication(s) at the place(s) of not-yet-loaded items)
              <UU5.Bricks.Loading />
            ) : (
              dataToRender.map((item, i) =>
                !item ? (
                  <UU5.Bricks.Column colWidth="m-6 l-4 xl-3" key={i}>
                    <UU5.Bricks.Loading />
                  </UU5.Bricks.Column>
                ) : (
                  <UU5.Bricks.Column colWidth="m-6 l-4 xl-3" key={item.data.id}>
                    <Joke
                      id={item.data.id}
                      data={item.data}
                      onUpdate={!item.handlerMap.update ? null : handleJokeUpdate}
                      onDelete={!item.handlerMap.delete ? null : handleJokeDelete}
                      processingItem={item}
                    />
                  </UU5.Bricks.Column>
                )
              )
            )}
          </UU5.Bricks.Row>
        </UU5.Bricks.Section>
        <UU5.Bricks.Modal controlled={false} ref_={modalRef} mountContent="onEachOpen" />
      </UU5.Bricks.Div>
    );
  }
});

export default Example;
