import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  function fillContactPage() {
    console.log('Trying to fill contact page');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { greeting: 'hello' }, function (
        response
      ) {
        console.log(response.farewell);
      });
    });
  }
  return (
    <div className="App">
      <header className="App-header">
        <button className="primary" onClick={fillContactPage}>
          Fill contact page
        </button>
      </header>
    </div>
  );
};

export default Popup;
