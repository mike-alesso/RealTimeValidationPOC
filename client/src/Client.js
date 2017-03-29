/* eslint-disable no-undef */

function ccVerify(cardNum, cvv, cb) {
  return fetch('api/card', {
    accept: 'application/json',
    body: JSON.stringify({
    "cardNumber":cardNum,
    "cardCvv":cvv
    }),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    method: 'POST',
    //mode: 'cors'
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const Client = { ccVerify };
export default Client;
