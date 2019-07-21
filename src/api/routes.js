
const models = require('./database/models');

const routes = (app) => {
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

  app.post('/api/wards/location', (req, res) => {
    const { body: { ward, name }} = req;
    if (ward && name) models.Location.create({ward, name})
      .then((location) => res.status(200).json({ location }))
      .catch((error) => res.status(400).json({ error }));
  else res.status(400).json({error: 'name and ward id required'})
  });

  app.get('/api/wards/location', (req, res) => {
    models.Location.findAll({include: [{model: models.Ward, as: 'ward_data'}]})
      .then((wardLocations) => res.status(200).json({ wardLocations }))
      .catch((error) => res.status(400).json({ error }))
  });

  app.post('/api/wards/sub-location', (req, res) => {
    const { body: { location, name }} = req;
    if (location && name) models.SubLocation.create({location, name})
      .then((subLocation) => res.status(200).json({ subLocation }))
      .catch((error) => res.status(400).json({ error }));
    else res.status(400).json({error: 'name and location id required'})
  });

  app.get('/api/wards/sub-location', (req, res) => {
    models.SubLocation.findAll({include: [{model: models.Location, as: 'location_data'}]})
      .then((subLocations) => res.status(200).json({ subLocations }))
      .catch((error) => res.status(400).json({ error }))
  });

  app.post('/api/wards/villages', (req, res) => {
    const { body: { subLocation, name }} = req;
    if (subLocation && name) models.Village.create({sub_location:subLocation, name})
      .then((village) => res.status(200).json({ village }))
      .catch((error) => res.status(400).json({ error }));
    else res.status(400).json({error: 'name and subLocation id required'})
  });

  app.get('/api/wards/villages', (req, res) => {
    models.Village.findAll({include: [{model: models.SubLocation, as: 'sub_location_data'}]})
      .then((villages) => res.status(200).json({ villages }))
      .catch((error) => res.status(400).json({ error }))
  })
};

module.exports = routes;
