const { userController } = require('../app/controllers')
const { upload } = require('../utils')
const { isAdmin } = require('../middleware/auth')

module.exports = (app) => {
    app.group('/users', (app) => {
        app.get('/', isAdmin, userController.getAllUsers);
        app.get('/:id', isAdmin, userController.getUserById);
        app.put('/update/:id', isAdmin, upload.single("image"), userController.updateUser);
        app.delete('/delete/:id', isAdmin, userController.deleteUser);
    });
};