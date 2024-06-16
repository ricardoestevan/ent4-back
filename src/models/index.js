const Post = require("./Post");
const User = require("./User");

//One to Many relationship
// Post.belongsTo(User)
// User.hasMany(Post)

//Updated relationship to many to many for bonus point activity.
User.belongsToMany(Post,{through: 'favorites'})
Post.belongsToMany(User, {through: 'favorites'})
