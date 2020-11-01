console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

function getLabelForId(label, index) {
  const labelElements = $('label:contains("' + label + '")');
  const labelElement = index ? $(labelElements[index]) : labelElements.first();
  return (
    '#' +
    labelElement
      .attr('for')
      .replace(/\./g, '\\.')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
  );
}

const inputs = {
  contact: [
    {
      label: 'Country',
    },
    {
      label: 'Given Name',
      index: 3,
    },
    {
      label: 'Family Name',
      index: 3,
    },
    {
      label: 'Address Line 1',
    },
    {
      label: 'Postal Code',
    },
    {
      label: 'County',
    },
    {
      label: 'Phone Number',
    },
  ],
  experience: [
    {
      label: 'Job Title',
      index: 0,
    },
    {
      label: 'Company',
      index: 0,
    },
    {
      label: 'Location',
      index: 0,
    },
    {
      label: 'From',
      index: 0,
    },
    {
      label: 'To',
      index: 0,
    },
    {
      label: 'Role Description',
      index: 0,
    },
    {
      label: 'Job Title',
      index: 1,
    },
    {
      label: 'Company',
      index: 1,
    },
    {
      label: 'Location',
      index: 1,
    },
    {
      label: 'From',
      index: 1,
    },
    {
      label: 'To',
      index: 1,
    },
    {
      label: 'Role Description',
      index: 1,
    },
    {
      label: 'School or University',
      index: 0,
    },
    {
      label: 'Degree',
      index: 0,
    },
    {
      label: 'Overall Result (GPA)',
      index: 0,
    },
    {
      label: 'From',
      index: 2,
    },
    {
      label: 'To (Actual or Expected)',
      index: 0,
    },
    {
      label: 'School or University',
      index: 1,
    },
    {
      label: 'Degree',
      index: 1,
    },
    {
      label: 'Overall Result (GPA)',
      index: 1,
    },
    {
      label: 'From',
      index: 3,
    },
    {
      label: 'To (Actual or Expected)',
      index: 1,
    },
    {
      label: 'URL',
      index: 0,
    },
    {
      label: 'LinkedIn:',
    },
  ],
};

function record(label, index) {
  switch (label) {
    case 'Country':
    case 'County':
    case 'Degree':
      return $(getLabelForId(label)).children().first().children().text();
    default:
      return $(getLabelForId(label, index)).val();
  }
}

function recordForm(formName) {
  const form = inputs[formName].map((input) => {
    return {
      ...input,
      value: record(input.label, input.index),
    };
  });
  let settings = {};
  settings[formName] = form;
  chrome.storage.sync.set(settings);
}

function fill(label, value, index) {
  let elementId = null;
  switch (label) {
    case 'Country':
    case 'County':
      elementId = getLabelForId(label);
      runDOMscript(
        function (elementId, value) {
          $(elementId).children().first().children().text(value).blur();
        },
        elementId,
        value
      );
      break;
    default:
      elementId = getLabelForId(label, index);
      runDOMscript(
        function (elementId, value) {
          $(elementId).val(value).blur();
        },
        elementId,
        value
      );
      break;
  }
}

function fillForm(formName) {
  chrome.storage.sync.get([formName], function (result) {
    result[formName].forEach((input) =>
      fill(input.label, input.value, input.index)
    );
  });
}

function injectJquery(cb, arg) {
  var script = document.createElement('script');
  script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
  document.getElementsByTagName('head')[0].appendChild(script);
  script.onload = function () {
    cb(arg);
  };
}

function runDOMscript(fn, elementId, value) {
  var script = document.head.appendChild(document.createElement('script'));
  script.text =
    '$(document).ready(function () {' +
    '(' +
    fn +
    ')(' +
    JSON.stringify(elementId) +
    ',' +
    JSON.stringify(value) +
    ')' +
    '})';
  script.remove();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  switch (request.message) {
    case 'record':
      recordForm(request.form);
      break;
    case 'fill':
      injectJquery(fillForm, request.form);
      break;
    default:
      console.log('Unknown message');
      break;
  }
});
