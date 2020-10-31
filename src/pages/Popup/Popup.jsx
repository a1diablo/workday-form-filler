import React from 'react';
import './Popup.css';

function sendToContent(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message });
  });
}

function fill() {
  sendToContent('fill');
}

function record() {
  sendToContent('record')
}

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <button className="primary" onClick={record}>
          Record contact page
        </button>
        <button className="primary" onClick={fill}>
          Fill contact page
        </button>
      </header>
    </div>
  );
};

export default Popup;
