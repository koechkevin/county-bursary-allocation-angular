const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const models = require('./database/models');

// Bind heroku port from environment variables or assign the port number 4200 when tested on a different environment.
dotenv.config();
const port = process.env.PORT||5000;

// Create an express server.
const app = express();

app.use(bodyParser.json());
// Folder path where the bundled files reside in.
const DIST = path.resolve(__dirname, '..', '..', 'dist/county-allocation');

// Enable our express server to serve bundled static files.
app.use(express.static(DIST));

app.get('/api/list', function (req, res) {
  models.Subcounty.findAll()
    .then((result) => {
      models.Ward.findAll({include: [{model: models.Subcounty, as: 'parent'}]})
        .then((ward) => {
          res.status(200).json({
            wards: ward,
            subCounties: result
          })
        })
    });
});

app.post('/api/sub-county', function (req, res) {
  if(req.body.subCounty) {
    models.Subcounty.create({ name: req.body.subCounty })
      .then((subCounty) => {
        res.status(201).json({
          subCounty
        })
      });
  } else {
    res.status(400).json({
      error: 'please provide a valid sub county name'
    })
  }
});

app.post('/api/allocations', function (req, res) {
  if(req.body.amount && !isNaN(req.body.amount)) {
    models.Allocation.create({amount: req.body.amount})
      .then((allocation) => res.status(201).json({allocation}))
  } else {
    res.status(400).json({
      error: 'please provide a valid amount'
    })
  }
});

app.post('/api/wards', (req, res) => {
  const name = req.body.name;
  const subCounty = req.body.subCounty;
  if(name && !isNaN(subCounty)) {
    models.Ward.create({ name, sub_county: subCounty })
      .then((ward) => {
        res.status(201).json({ ward });
      })
      .catch((error) => {
        res.status(400)
          .json({error})
      })
  } else {
    res.status(400).json({
      error: 'please provide a valid amount'
    })
  }
});

app.get('/api/allocations', function (req, res){
  models.Allocation.findAll({
    limit: 5, order: [['id', 'DESC']]
  })
    .then((allocations) => {
      res.status(200).json({ allocations })
    })
});

// Redirects all other routes to index.html file in the DIST directory
app.use('*', (req, res) => res.sendFile(path.resolve(DIST, 'index.html')));

// run the server
app.listen(port, () => console.log(`listening on port ${port}`));
