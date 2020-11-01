import React from 'react';
import './Popup.css';

function sendToContent(message, form) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message, form });
  });
}

function fillContact() {
  sendToContent('fill', 'contact');
}

function recordContact() {
  sendToContent('record', 'contact')
}

function fillExperience() {
  sendToContent('fill', 'experience');
}

function recordExperience() {
  sendToContent('record', 'experience')
}

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <button className="primary" onClick={recordContact}>
          Record contact page
        </button>
        <button className="primary" onClick={fillContact}>
          Fill contact page
        </button>
        <button className="primary" onClick={recordExperience}>
          Record experience page
        </button>
        <button className="primary" onClick={fillExperience}>
          Fill experience page
        </button>
      </header>
    </div>
  );
};

export default Popup;
