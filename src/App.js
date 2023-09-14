import { useEffect, useState } from "react";
export default function App() {
  const [isLight, setIsLight] = useState(true);
  const [listArr, setListArr] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const [dimention, setDimention] = useState(window.innerWidth);
  const [filterTarget, setFilterTarget] = useState("all");

  function detectSize() {
    setDimention(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    setIsMobile(dimention <= 592 ? true : false);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [dimention]);

  const lightD = "hsl(236, 33%, 92%) url(./images/bg-desktop-light.jpg)";
  const lightM = "hsl(236, 33%, 92%) url(./images/bg-mobile-light.jpg)";
  const darkD = "hsl(235, 21%, 11%) url(./images/bg-desktop-dark.jpg)";
  const darkM = "hsl(235, 21%, 11%) url(./images/bg-mobile-dark.jpg)";

  function handleComplete(id) {
    setListArr((pre) =>
      pre.map((prev) =>
        prev.id === id ? { ...prev, checked: !prev.checked } : { ...prev }
      )
    );
  }

  function handleFiltered(e) {
    setFilterTarget(e.target.attributes.id.value);
  }

  let filteredItem = listArr.filter((prev) => {
    if (filterTarget === "active") {
      return prev.checked === false;
    } else if (filterTarget === "completed") {
      return prev.checked === true;
    } else {
      return prev;
    }
  });

  return (
    <div
      id="main"
      style={{
        background: `${
          isLight && isMobile
            ? lightM
            : isLight && !isMobile
            ? lightD
            : !isLight && isMobile
            ? darkM
            : darkD
        } no-repeat center top`,
      }}
      className="d-flex justify-content-center"
    >
      <Container
        isLight={isLight}
        setIsLight={setIsLight}
        onSetListArr={setListArr}
        listArr={listArr}
        isMobile={isMobile}
        onHandleComplete={handleComplete}
        onHandleFiltered={handleFiltered}
        filteredItem={filteredItem}
      />
    </div>
  );
}

function Container({
  isLight,
  setIsLight,
  newArray,
  onSetListArr,
  listArr,
  isMobile,
  onHandleComplete,
  onHandleFiltered,
  filteredItem,
}) {
  return (
    <div id="container" className="mt-5">
      <Header isLight={isLight} setIsLight={setIsLight} />
      <InputField onSetListArr={onSetListArr} isLight={isLight} />
      <Lists
        newArray={newArray}
        listArr={listArr}
        isMobile={isMobile}
        onHandleComplete={onHandleComplete}
        onSetListArr={onSetListArr}
        filteredItem={filteredItem}
        isLight={isLight}
      />
      <Footer
        listArr={listArr}
        onSetListArr={onSetListArr}
        isMobile={isMobile}
        onHandleFiltered={onHandleFiltered}
        isLight={isLight}
      />
      {listArr.length ? (
        <p className="text-center" style={{ color: `hsl(236, 9%, 61%)` }}>
          Drag and drop to reorder list
        </p>
      ) : (
        ""
      )}
    </div>
  );
}

function Header({ isLight, setIsLight }) {
  return (
    <div
      className="d-flex justify-content-between align-items-center"
      id="header"
    >
      <h1>TODO</h1>
      <img
        src={isLight ? "./images/icon-moon.svg" : "./images/icon-sun.svg"}
        alt="toggle-btn"
        onClick={() => setIsLight(!isLight)}
        className="pb-3 pe-3"
      />
    </div>
  );
}
function InputField({ onSetListArr, isLight }) {
  const [input, setInput] = useState("");
  function handleSumbit(e) {
    e.preventDefault();
    if (!input) return;
    const id = crypto.randomUUID();
    const ArrayN = {
      id,
      input,
      checked: false,
    };
    onSetListArr((prev) => [...prev, ArrayN]);
    setInput("");
  }
  return (
    <form action="" onSubmit={(e) => handleSumbit(e)}>
      <div
        className="input-field p-2"
        style={{
          background: `${isLight ? "hsl(0, 0%, 98%)" : "hsl(235, 24%, 19%)"}`,
        }}
      >
        <div
          style={{
            borderColor: `${
              isLight ? "hsl(233, 11%, 84%)" : "hsl(233, 14%, 35%)"
            }`,
          }}
        ></div>
        <input
          type="text"
          placeholder="Create a new todo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            color: `${isLight ? "hsl(235, 24%, 19%)" : "hsl(0, 0%, 98%)"}`,
          }}
        />
      </div>
    </form>
  );
}
function Lists({
  listArr,
  isMobile,
  onHandleComplete,
  onSetListArr,
  filteredItem,
  isLight,
}) {
  function handleDelete(id) {
    onSetListArr((prev) => prev.filter((pre) => pre.id !== id));
  }

  return (
    <ul
      className="lists w-100 mt-5"
      style={{
        background: `${isLight ? "hsl(0, 0%, 98%)" : "hsl(235, 24%, 19%)"}`,
      }}
    >
      {filteredItem.map((prev) => (
        <List
          description={prev.input}
          key={prev.id}
          checked={prev.checked}
          id={prev.id}
          onHandleComplete={onHandleComplete}
          onHandleDelete={handleDelete}
          isLight={isLight}
        />
      ))}
      {isMobile && listArr.length ? (
        <div
          className="d-flex justify-content-between p-3 align-items-center footer mb-4"
          style={{
            background: `${isLight ? "hsl(0, 0%, 98%)" : "hsl(235, 24%, 19%)"}`,
          }}
        >
          <span
            style={{
              color: "hsl(236, 9%, 61%)",
            }}
          >
            <span>
              {listArr.filter((prev) => prev.checked === false).length}{" "}
            </span>
            items left
          </span>

          <HandleClear onSetListArr={onSetListArr} isLight={isLight} />
        </div>
      ) : (
        ""
      )}
    </ul>
  );
}

function List({
  description,
  checked,
  id,
  onHandleComplete,
  onHandleDelete,
  isLight,
}) {
  return (
    <li
      style={{
        borderColor: `${isLight ? "hsl(233, 11%, 84%)" : "hsl(233, 14%, 35%)"}`,
      }}
    >
      <span
        className="link-check me-3"
        style={{
          background: `${
            checked
              ? "url(./images/icon-check.png) no-repeat center center"
              : ""
          }`,
          borderColor: `${
            isLight ? "hsl(233, 11%, 84%)" : "hsl(233, 14%, 35%)"
          }`,
        }}
        onClick={() => onHandleComplete(id)}
      ></span>
      <span
        className="me-auto des"
        style={{
          textDecoration: `${checked ? "line-through" : ""}`,
          color: `${
            isLight && !checked
              ? "hsl(235, 21%, 11%)"
              : isLight && checked
              ? "hsl(234, 39%, 85%)"
              : !isLight && checked
              ? "hsl(233, 14%, 35%)"
              : "hsl(234, 39%, 85%)"
          }`,
        }}
        onClick={() => onHandleComplete(id)}
      >
        {description}
      </span>
      <img
        className="btn"
        src="./images/icon-cross.svg"
        alt="close"
        onClick={() => onHandleDelete(id)}
      />
    </li>
  );
}
function Footer({
  listArr,
  onSetListArr,
  isMobile,
  onHandleFiltered,
  isLight,
}) {
  const [isActive, setIsActive] = useState("all");
  function handleFilter(e) {
    let target = e.target.attributes.id.value;
    setIsActive(target);
    onHandleFiltered(e);
  }
  return (
    <>
      {listArr.length ? (
        <div
          className="d-flex justify-content-around align-items-center footer mb-4"
          style={{
            background: `${isLight ? "hsl(0, 0%, 98%)" : "hsl(235, 24%, 19%)"}`,
          }}
        >
          {!isMobile && (
            <span style={{ color: "hsl(236, 9%, 61%)" }}>
              <span>
                {listArr.map((item) => item.checked !== true).length}{" "}
              </span>
              items left
            </span>
          )}
          <div id="menus">
            <span
              onClick={(e) => handleFilter(e)}
              className={`flt btn border-0 me-4 ${
                isActive === "all" ? "active" : ""
              }`}
              id="all"
              style={{
                color: `hsl(236, 9%, 61%)`,
              }}
            >
              All
            </span>
            <span
              onClick={(e) => handleFilter(e)}
              className={`flt btn border-0 me-4 ${
                isActive === "active" ? "active" : ""
              }`}
              id="active"
              style={{
                color: `hsl(236, 9%, 61%)`,
              }}
            >
              Active
            </span>
            <span
              onClick={(e) => handleFilter(e)}
              className={`flt btn border-0 ${
                isActive === "completed" ? "active" : ""
              }`}
              id="completed"
              style={{
                color: "hsl(236, 9%, 61%)",
              }}
            >
              Completed
            </span>
          </div>
          {!isMobile && (
            <HandleClear onSetListArr={onSetListArr} isLight={isLight} />
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}

function HandleClear({ onSetListArr }) {
  function handleClear() {
    onSetListArr([]);
  }
  return (
    <span
      className="clear"
      onClick={handleClear}
      style={{ color: "hsl(236, 9%, 61%)" }}
    >
      Clear Completed
    </span>
  );
}
