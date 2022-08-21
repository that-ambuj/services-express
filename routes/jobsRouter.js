import { Router } from 'express'
import Job from '../models/Job.js'
import Worker from '../models/Worker.js'

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

jobsRouter.put('/:id/assign-worker', async (req, res) => {
    const workerId = req.body.workerId
    const job = await Job.findById(req.params.id)

    const workerExists = (await Worker.findById(workerId)) !== undefined

    if (!workerExists) {
        return res.status(404).json({ error: 'worker with that id does not exist' })
    }

    job.assignedTo = workerId
    job.status = 'ACTIVE'
    const savedJob = await job.save()

    return res.status(202).json({
        message: `${savedJob.id} has been assigned to ${
            savedJob.populate('assignedTo').assignedTo
        }`,
    })
})

jobsRouter.post('/:id/set-done', async (req, res) => {
    const job = await Job.findById(req.params.id)

    if (job.status === 'ACTIVE') {
        return res
            .status(400)
            .json({
                error: 'The job must be assigned to a worker before setting it done',
            })
    }

    if (job.status === 'DONE') {
        return res
            .status(400)
            .json({ error: "A finished job's status cannot be changed." })
    }

    job.status = 'DONE'
    await job.save()

    return res.json({ message: `Job ${job.id} has been done!` })
})

export default jobsRouter