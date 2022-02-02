const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
  company:{
    type: String,
    required: [true, 'Пожалуйста, укажите название компании'],
    maxlength:50
  },
  position:{
    type: String,
    required: [true, 'Пожалуйста, укажите позицию'],
    maxlength:100
  },
  status:{
    type: String,
    enum:['interview', 'declined', 'pending'],
    default:'pending'
  },
  createdBy:{
    type:mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Пожалуйста, укажите пользователя']
  }
},{timestamps:true})

module.exports = mongoose.model('Job', JobSchema)