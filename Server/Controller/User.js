const User = require('../Models/User')
const bcrypt = require('bcrypt')

const registerUser = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body
        if (!name || !email || !password || !mobile) {
            return res.status(400).json({
                errormessage: 'Bad request'
            })
        }
        const isExistingUser = await User.findOne({ email: email });

        if (isExistingUser) {
            return res
                .status(409)
                .json({ errormessage: 'User already exists' })
        }
        const hashedpassword = await bcrypt.hash(password, 10)

        const userData = new User({
            name,
            email,
            password: hashedpassword,
            mobile
        })
        await userData.save()
        res.json({ message: "User register successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ errormessage: 'Something went wrong!' })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res
                .status(400)
                .json({ errormessage: 'Bad request invalid Credentials!' })
        }
        const UserDetails = await User.findOne({ email: email })

        if (!UserDetails) {
            return res
                .status(401)
                .json({ errormessage: 'invalid Credentials!' })
        }

        const passwardMatches = bcrypt.compare(password, UserDetails.password)

        if (!passwardMatches) {
            return res
                .status(401)
                .json({ errormessage: 'invalid Credentials!' })

        }
        res.json({ message: 'User Login SuccessFully' })


    } catch (error) {
        console.log(error)
        res.status(500).json({ errormessage: 'Something went wrong' })
    }
}

module.exports = { registerUser, userLogin }