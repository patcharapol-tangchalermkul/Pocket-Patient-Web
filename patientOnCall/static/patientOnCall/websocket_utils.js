function create_websocket(openFunction, messageFunction) {
  let connectionString = ''
  if (window.location.protocol == "https:") {
    connectionString += 'wss://';
  } else {
    connectionString += 'ws://';
  }
  connectionString += window.location.host + '/ws/patientoncall/'
                      + sessionStorage.getItem("patientUsername") + '/'

  let websocket = new WebSocket(connectionString);

  websocket.onopen = openFunction

  websocket.onmessage = messageFunction;

  return websocket;
}


function reconnectWebsocket() {
  sessionStorage.setItem("websocket", create_websocket(sessionStorage.getItem("patientID"), sessionStorage.getItem("patientName")));
  console.log("websocket reconnected");
}