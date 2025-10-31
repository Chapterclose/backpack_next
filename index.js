const ws = new WebSocket("wss://stream.binance.us:9443/ws/!ticker@arr");
ws.onopen = () => console.log("connected!");
ws.onmessage = (msg) => console.log(msg.data);
ws.onerror = (err) => console.error("error", err);
