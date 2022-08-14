import { Router } from 'express'
import Job from '../models/Job.js'
import customerParser from '../utils/customerParser.js'

const jobsRouter = new Router()

jobsRouter.get('/', async (req, res) => {
    const customer = req.customer
    const jobs = await customer.jobs

    return res.json(jobs)
})

jobsRouter.get('/:id', async (req, res) => {
    const jobId = req.params.id

    const job = await Job.findById(jobId)

    if (job === undefined) {
        return res.status(404).json({ error: 'Job with that ID does not exist.' })
    }

    return res.json(job)
})

jobsRouter.post('/', async (req, res) => {
    const customer = req.customer
    const jobData = req.body

    const newJob = new Job({ ...jobData, createdBy: customer._id })
    const savedJob = await newJob.save()

    console.log(savedJob)

    customer.jobs = customer.jobs.concat(savedJob._id)
    await customer.save()

    return res.status(201).json(savedJob)
})

export default jobsRouter