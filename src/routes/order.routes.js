const { orderController } = require('../app/controllers');
const { isAdmin } = require('../middleware/auth')

module.exports = (app) => {
    app.group('/orders', (app) => {
        app.get('/', isAdmin, orderController.getAllOrders)
        app.get('/:id', orderController.getOrderById)
        app.post('/search', isAdmin, orderController.searchData)
    })
}