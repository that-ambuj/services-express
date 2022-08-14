import { Router } from 'express'
import bcrypt from 'bcrypt'
import Customer from '../models/Customer.js'
import uid from 'uid-safe'

const customersRouter = new Router()

customersRouter.post('/signup', async (req, res) => {
    const customerData = req.body

    const passwordHash = await bcrypt.hash(customerData.password, 10)

    const newCustomer = new Customer({ ...customerData, passwordHash })
    const savedCustomer = newCustomer.save()

    return res.status(201).json(savedCustomer)
})

customersRouter.post('/login', async (req, res) => {
    const { username, password } = req.body

    const customer = await Customer.findOne({ username })

    const passwordIsCorrect =
        customer === null ? false : await bcrypt.compare(password, customer.passwordHash)

    if (!passwordIsCorrect) {
        return res.status(401).json({ error: 'incorrect password' })
    }

    const sessionId = uid.sync(24)
    customer.sessions = customer.sessions.concat(sessionId)
    await customer.save()

    res.cookie('sid', sessionId, { httpOnly: true, secure: true })
    res.status(202).end()
})

export default customersRouter