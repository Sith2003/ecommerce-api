const User = require('../../models/user');
const config = require('../../../config')
const client = require('../../../utils/elasticsearch')

const register = async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const image = req.file ? req.file.filename : "";
        if (!username || !email || !password) return res.status(400).json({ message: config.statusMessage.ALL_FIELDS_NEED_REQUIRED})
        
        const usernameExisted = await User.findOne({ username })
        if (usernameExisted) return res.status(400).json({ message: config.statusMessage.USERNAME_ALREADY_EXIST})
        
        const emailExisted = await User.findOne({ email })
        if (emailExisted) return res.status(400).json({ message: config.statusMessage.EMAIL_ALREADY_EXIST})
        
        const userData = {
            username, 
            email, 
            password,
            image,
        }
        const user = await User.create(userData)
        await user.save()
        const accessToken = await user.getJWTToken()
        const data = { user, accessToken }
        await client.index({
            index: 'users',
            body: userData
        })
        return res.status(200).json({
            message: "Register successfully",
            data
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error); 
    }
};

const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: config.statusMessage.ALL_FIELDS_NEED_REQUIRED})

        const user = await User.findOne({ email }).select("+password")
        if (!user) return res.status(400).json({ message: 'Email or password is not correct'})
        const checkPassword = await user.comparePassword(password)
        if (!checkPassword) return res.status(400).json({ message: 'Password is not correct'})
        
        // const accessToken = await generateAccessToken(user)
        const accessToken = await user.getJWTToken()
        // const data = { user, accessToken }

        res.cookie('accessToken', accessToken, {
            maxAge: 300000,
            secure: true,
            httpOnly: true,
            sameSite: "none"
        })

        // req.session.userRole = user.role
        // req.session.user = user

        return res.status(200).json({
            message: "Login successfully",
            user,
            accessToken
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error); 
    }
};

const logout = async (req, res) => {
    try {
        await res.clearCookie('connect.sid');
        await res.clearCookie('accessToken');
        // res.setHeader('Cache-Control', 'no-store');
        if (req.session) {
            req.session.destroy(err => {
              if (err) {
                res.status(400).send('Unable to logout')
              } else {
                res.send('Logout successful')
                // res.redirect('/localhost:8888/checkout.html')
              }
            });
        } else {
            res.end()
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error); 
    }
}

module.exports = { login, register, logout }