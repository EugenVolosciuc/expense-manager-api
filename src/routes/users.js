const express = require('express')

const auth = require('../middleware/auth')
const { getAuthedUser, createUser, loginUser, logoutUser, updateUser, deleteUser } = require('../controllers/userController')

const router = new express.Router()

// @desc    Get logged in user
// @route   GET /users/me
router.get('/me', auth, getAuthedUser)

// @desc    Create user
// @route   POST /users
router.post('/', createUser)

// @desc    Login user
// @route   POST /users/login
router.post('/login', loginUser)

// @desc    Logout user
// @route   POST /users/logout
router.post('/logout', auth, logoutUser)

// @desc    Update user
// @route   POST /users/:id
router.patch('/:id', auth, updateUser)

// @desc    Delete user
// @route   DELETE /users/:id
router.delete('/:id', auth, deleteUser)

module.exports = router