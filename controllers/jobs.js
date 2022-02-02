const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError}= require('../errors')

const getAllJobs = async (req, res) =>{
  const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
  res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}
const getJob = async (req, res) =>{
  
  const job = await Job.findOne({
    _id:req.params.id
  })
  
  if(!job){
    throw new NotFoundError(`Нет поля с id ${req.params.id}`)
  }

  res.status(StatusCodes.OK).json({job})
}
const createJob = async (req, res) =>{
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({job })
}
const updateJob = async (req, res) =>{
  const {body:{company,position},user:{userId},params:{id:jobId}} = req

  if(company==='' || position===''){
    throw new BadRequestError('Поля Компания или Должность не могут быть пустыми')
  }

  const job = await Job.findByIdAndUpdate({_id:jobId, createdBy:userId},req.body, {new:true, runValidators:true})

  if(!job){
    throw new NotFoundError(`Нет поля с id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({job})
}
const deleteJob = async (req, res) =>{
  const job = await Job.findOneAndRemove({
    _id:req.params.id
  })

  if(!job){
    throw new NotFoundError(`Нет поля с id ${req.params.id}`)
  }

  res.status(StatusCodes.OK).send()
}

module.exports = {getAllJobs, getJob, createJob, updateJob, deleteJob}