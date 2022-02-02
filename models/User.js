const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Пожалуйста, укажите имя'],
    minlength: 3,
    maxlength: 16,
  },
  email:{
    type: String,
    required: [true, 'Пожалуйста, укажите адрес электронной почты'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Пожалуйста, укажите действительный адрес электронной почты',
    ],
    unique: true,
  },
  password:{
    type: String,
    required: [true, 'Пожалуйста, укажите пароль'],
    minlength: 3,
  },
})
UserSchema.pre('save', async function(){

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

})

UserSchema.methods.createJWT = function(){
  return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function (canditatePassword){
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)