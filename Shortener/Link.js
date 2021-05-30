const mongoose = require('mongoose')

const schema = mongoose.Schema({
  original_url:{
    type:String,
    required:true
  },
  short_url:{
    type:String,
    required:true
  }
})

const Link = mongoose.model("Link",schema)

module.exports = Link