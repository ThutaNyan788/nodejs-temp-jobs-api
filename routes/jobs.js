const express = require("express");
const router = express.Router();
const  {
    getAllJobs,
    getSingleJob,
    deleteJob,
    updateJob,
    createJob
}= require("../controllers/jobs");



router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").delete(deleteJob).patch(updateJob).get(getSingleJob);

module.exports = router;