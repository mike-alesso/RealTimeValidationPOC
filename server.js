const express = require('express');
const fs = require('fs');
const sqlite = require('sql.js');
const bodyParser = require('body-parser');
const host = 'REDACTED';

const filebuffer = fs.readFileSync('db/usda-nnd.sqlite3');

const db = new sqlite.Database(filebuffer);

const app = express();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

const COLUMNS = [
  'carbohydrate_g',
  'protein_g',
  'fa_sat_g',
  'fa_mono_g',
  'fa_poly_g',
  'kcal',
  'description',
];

app.use(bodyParser.json());

var getRtv = function (req, res, next) {
const host = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const endpoint =  '/smartpaymentsapi/v3/Commerce/Payments/CreditCard/Validate';
const https = require('https');
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'SPApiKey': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Authorization': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}; 

const method = 'POST';

var body = {
    'language': 'EN',
    'country': 'US',
    'region': 'US',
    'currency': 'USD',
    'salesChannel': 'US_19',
    'cards': [
      {
      'cardNumber': req.body.cardNumber,
      'cid': req.body.cardCvv,
      'cardHolderName': 'Michael Jones',
      'expiryYear': '2020',
      'expiryMonth': '04',
      'billingAddress': {
        'address1': '1 NORTHEASTERN BLVD',
        'address2': '',
        'address3': '',
        'zipCode': '03109-1234',
        'city': 'BEDFORD',
        'state': 'NH',
        'country': 'US',
        'phoneNumber': '9035171619'
      },
    'installments': '1',
    'cardinalTransactionId': 'Hid1E9FtSo4tN2r3nDD0'
    }
  ]
}

var jsonRequest = JSON.stringify(body);

const options = {
  host: host,
  path: endpoint,
  method: method,
  headers: headers
};

var request = https.request(options, function(response) {
  response.setEncoding('utf-8');

  var responseString = '';

  response.on('data', function(data) {
    responseString += data;
  });

  response.on('end', function() {
    console.log(responseString);
    req.getRtv = JSON.parse(responseString);
    next();
  });
});

  request.write(jsonRequest);
  request.end();

  
};

app.use(getRtv);

app.post('/api/card', (req, res) => {
  if (!req.body) return res.sendStatus(400)
  console.log(req.body);
  var rtvResults = req.getRtv;
  res.setHeader('Content-Type', 'application/json');
console.log(rtvResults);
res.send(JSON.stringify(rtvResults));

})



app.get('/api/food', (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: 'Missing required parameter `q`',
    });
    return;
  }

  // WARNING: Not for production use! The following statement
  // is not protected against SQL injections.
  const r = db.exec(`
    select ${COLUMNS.join(', ')} from entries
    where description like '%${param}%'
    limit 100
  `);

  if (r[0]) {
    res.json(
      r[0].values.map((entry) => {
        const e = {};
        COLUMNS.forEach((c, idx) => {
          // combine fat columns
          if (c.match(/^fa_/)) {
            e.fat_g = e.fat_g || 0.0;
            e.fat_g = (
              parseFloat(e.fat_g, 10) + parseFloat(entry[idx], 10)
            ).toFixed(2);
          } else {
            e[c] = entry[idx];
          }
        });
        return e;
      }),
    );
  } else {
    res.json([]);
  }
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
