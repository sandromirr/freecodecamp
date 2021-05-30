const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  username: String,
  exercise: [
    {
      description: String, // Can't be called 'type' because Mongoose will think this is a type declaration for the object ie. 'String' || 'Number' etc.
      duration: Number,
      date: Date
    }
  ]
})

const User = mongoose.model('User',UserSchema);
module.exports = {
  User,
}