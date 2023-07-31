const JobModel = require("../models/Job");
const {StatusCodes} = require("http-status-codes");
const NotFoundError = require("../errors/not-found");

const getAllJobs= async (req,res)=>{
    const jobs = await JobModel.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getSingleJob= async (req,res)=>{
    let {user:{userId,name},params:{id:jobId}} = req;

    let job = await JobModel.find({createdBy:userId,_id:jobId}).sort();

    if(!job){
        throw new NotFoundError(`There is no job with that id:${jobId}`);
    }

    return res.status(StatusCodes.OK).json({job});
   
}

const createJob= async (req,res)=>{
    req.body.createdBy = req.user.userId;

    let jobs = await JobModel.create(req.body);

    res.status(StatusCodes.OK).json(jobs);

}
const deleteJob= async (req,res)=>{
    let {user:{userId,name},params:{id:jobId}} = req;

    let job = await JobModel.findOneAndDelete({createdBy:userId,_id:jobId});

    if(!job){
        throw new NotFoundError(`There is no job with that id:${jobId}`);
    }

    return res.status(StatusCodes.OK).json({message:"Delete Success"});
}


const updateJob= async (req,res)=>{
    let {user:{userId,name},params:{id:jobId}} = req;

    let job = await JobModel.findOneAndUpdate({createdBy:userId,_id:jobId},req.body,{new:true,runValidators:true});

    if(!job){
        throw new NotFoundError(`There is no job with that id:${jobId}`);
    }

    return res.status(StatusCodes.OK).json(job);

}

module.exports={
    getAllJobs,
    getSingleJob,
    deleteJob,
    updateJob,
    createJob
}