const { addressController} = require('../app/controllers');

module.exports = async (app) => {
    app.group('/address', (app) => {
        app.get('/province', addressController.allProvince),
        app.get('/city/:id', addressController.allCity);
        app.get('/villages/:id', addressController.allVillageInDistrict);
        app.get('/villages', addressController.allVillage);
    })
}