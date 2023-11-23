const { authController } = require('../app/controllers');
require('express-group-routes');

module.exports = (app) => {
    app.group("/auth", (app) => {
        app.post("/register", authController.register)
        app.post("/login", authController.login)
        app.get("/logout", authController.logout)
    })
}