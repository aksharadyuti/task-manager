const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
//const { cookie } = require('express-validator')
var Cookies = require('cookies')
const Task = require('../models/task')

const router = new express.Router()
router.use(express.urlencoded({extended:true}))

router.get('/register',async(req,res)=>{
    res.status(200).render('register')
})

router.get('/', async(req,res)=>{
    res.status(200).render('login')
})

router.post('/register', async (req, res) => {

    try {
        const user = new User(req.body)

        await user.save()
        const token = await user.generateAuthToken()
        var cookies = new Cookies(req,res)
        cookies.set('token',token)
        res.status(201).redirect("/users/me")
    } catch (e) {
        console.log(e)
        res.status(400).redirect("/")
    }
})

router.post('/', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        var cookies = new Cookies(req,res)
        cookies.set('token', token)
        const tasks = await Task.find({owner:user._id})
        res.status(200).redirect('/users/me')
    } catch (e) {
        console.log(e);
        const error = "Unable to login"
        res.status(400).render('login',{error})
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).redirect('/')
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    const user = req.user
    var tasks = await Task.findTasks(user._id)
    res.status(200).render('dashboard',{name:user.name,tasks:tasks})
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router