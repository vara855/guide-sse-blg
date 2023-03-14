import "./style.css";

window.onload(() => {
  const client = new EventSource("/be/digits");

  const appContainer = document.getElementById("eventsContainer");

  const list = document.createElement("ul");
  list.setAttribute("id", "events");
  appContainer.appendChild(list);

  const closeButton = document.createElement("button");
  closeButton.innerText = "Close Connection";
  closeButton.addEventListener("click", (e) => {
    e.preventDefault();
    client.close();
  });
  appContainer.appendChild(closeButton);

  const createListItem = (text) => {
    const li = document.createElement("li");
    li.innerText = text;
    return li;
  };

  client.onmessage = (message) => {
    const li = createListItem(message.data);
    list.appendChild(li);
    console.log("message :>> ", message);
  };

  client.onerror = (e) => {
    console.warn("⚠️ Check that server running. Run `npm run server`");
    console.log("error :>>", e);
    const li = createListItem("ERROR");
    li.classList.add("error");
    list.appendChild(li);
  };

  client.onopen = (e) => {
    console.log("open :>>", e);
    const li = createListItem("OPEN");
    li.classList.add("open");
    list.appendChild(li);
  };
});
