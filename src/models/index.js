const Post = require("./Post");
const User = require("./User");


Post.belongsTo(User) //One to Many relationship
User.hasMany(Post)