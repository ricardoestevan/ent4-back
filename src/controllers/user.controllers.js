const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');



const getAll = catchError(async (req, res) => {
    const results = await User.findAll({include: [Post]});
    return res.json(results);
});

const create = catchError(async (req, res) => {
    // Desctructuring body and creating variable for password with the key value 
    const { password } = req.body
    // Encrypt variable on keyEncripted
    const encryptedKey = await bcrypt.hash(password, 10)
    // Destructure body and assign encrypted key to password
    const body = { ...req.body, password: encryptedKey }
    const result = await User.create(body);
    return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id, {include: [Post]});
    if (!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    const result = await User.destroy({ where: { id } });
    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
    delete req.body.password
    delete req.body.email
    const { id } = req.params;
    const result = await User.update(
        req.body,
        { where: { id }, returning: true }
    );
    if (result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid Entry' })
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).json({ error: 'Invalid Entry' })
    const token = jwt.sign(
        { user }, process.env.TOKEN_SECRET, { expiresIn: '1d' }
    )
    return res.json({ user, token })
})

const logged = catchError(async(req, res) => {
    const user = req.user
    return res.json(user)
})

const setPosts = catchError(async(req, res) =>{
    const {id} = req.params
    const user = await User.findByPk(id)
    await user.setPosts(req.body)
    const posts = await user.getPosts()
    return res.json(posts)
})


module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login,
    logged,
    setPosts
}