const { productController } = require('../app/controllers')
const { isAdmin, isUser } = require("../middleware/auth")

module.exports = (app) => {
    app.group('/products', (app) => {
        app.get('/', isAdmin, productController.getAllProducts)
        app.get('/search', isAdmin, productController.productPagination)
        app.post('/create', isAdmin, productController.createProducts)
        app.post('/buy/:id', isUser, productController.buyProduct)
        app.put('/update/:id', isAdmin, productController.updateProduct)
        app.patch('/update/many', isAdmin, productController.updateManyProductPrice)
        app.delete('/delete/:id', isAdmin, productController.deleteProduct)
    })
};