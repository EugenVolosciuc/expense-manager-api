const User = require('../models/User');

const { ErrorHandler } = require('../helpers/error')

exports.getAuthedUser = async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error)
        // throw new ErrorHandler(500, 'Could not check authed user', error)
        // res.status(500).send(error)
    }
}

exports.createUser = async (req, res, next) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send({ user })

    } catch (error) {
        next(error)
        // throw new ErrorHandler(400, 'Could not create user', error)
        // res.status(400).send(error)
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        if (!user) {
            throw new ErrorHandler(400, 'Could not login with provided credentials')
        }

        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        next(error)
        // throw new ErrorHandler(400, 'Could not login with provided credentials', error)
        // res.status(400).send()
    }
}

exports.logoutUser = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()

        res.send()
    } catch (error) {
        next(error)
        // throw new ErrorHandler(500, 'Error logging out', error)
        // res.status(500).send(error)
    }
}

exports.updateUser = async (req, res, next) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'email', 'password', ]
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        throw new ErrorHandler(400, 'Invalid updates')
        // return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            throw new ErrorHandler(404, 'No user found')
            // return res.status(404).send()
        }

        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (error) {
        next(error)
        // throw new ErrorHandler(400, 'Error updating user', error)
        // res.status(400).send(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            throw new ErrorHandler(404, 'No user found')
            // return res.status(404).send({ error: 'No user found!' })
        }

        res.send(user)
    } catch (error) {
        next(error)
        // throw new ErrorHandler(400, 'Error deleting user', error)
        // res.status(500).send(error)
    }
}