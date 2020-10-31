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

const contactInputs = [
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
];

function recordContact(label, index) {
  switch (label) {
    case 'Country':
    case 'County':
      return $(getLabelForId(label)).children().first().children().text();
    default:
      return $(getLabelForId(label, index)).val();
  }
}

function recordContactForm() {
  const contactForm = contactInputs.map((contactInput) => {
    return {
      ...contactInput,
      value: recordContact(contactInput.label, contactInput.index),
    };
  });
  chrome.storage.sync.set({ contactForm });
}

function fillContact(label, value, index) {
  switch (label) {
    case 'Country':
    case 'County':
      $(getLabelForId(label)).children().first().children().text(value);
      break;
    default:
      $(getLabelForId(label, index)).val(value);
      break;
  }
}

function fillContactForm() {
  chrome.storage.sync.get(['contactForm'], function (result) {
    result.contactForm.forEach((contactInput) =>
      fillContact(contactInput.label, contactInput.value, contactInput.index)
    );
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  switch (request.message) {
    case 'record':
      recordContactForm();
      break;
    case 'fill':
      fillContactForm();
      break;
    default:
      console.log('Unknown message');
      break;
  }
});
