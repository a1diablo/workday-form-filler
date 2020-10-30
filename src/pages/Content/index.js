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
    value: 'Ireland',
  },
  {
    label: 'Given Name',
    value: 'Lulu',
    index: 3,
  },
  {
    label: 'Family Name',
    value: 'Niu niu',
    index: 3,
  },
  {
    label: 'Address Line 1',
    value: '10 Linnetfields Park, Castaheany, Clonee',
  },
  {
    label: 'Postal Code',
    value: 'D15 N6F5',
  },
  {
    label: 'City',
    value: 'Dublin',
  },
  {
    label: 'Phone Number',
    value: '873444925',
  },
];

function fillContact(label, value, index) {
  switch (label) {
    case 'Country':
      $(getLabelForId(label)).children().first().children().text(value);
      break;
    default:
      $(getLabelForId(label, index)).val(value);
      break;
  }
}

function fillContactForm() {
  contactInputs.forEach((contactInput) =>
    fillContact(contactInput.label, contactInput.value, contactInput.index)
  );
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' });
  fillContactForm();
});
