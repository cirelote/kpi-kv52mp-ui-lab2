import '@testing-library/jest-dom';

class MockWebSocket {
  constructor(url) {
    this.url = url;
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 10);
  }
  send(msg) {}
  close() {}
}
global.WebSocket = MockWebSocket;
