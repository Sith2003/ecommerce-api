const { elasticsearchController } = require('../app/controllers');
const { isAdmin } = require('../middleware/auth')

module.exports = (app) => {
    app.group('/search', (app) => {
        app.get('/users', isAdmin, elasticsearchController.searchUserByname)
        app.get('/products', isAdmin, elasticsearchController.searchProductByname)
        app.post('/insert', isAdmin, elasticsearchController.insertData)
    })
}