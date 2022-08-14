import { Router } from 'express'
import bcrypt from 'bcrypt'
import uid from 'uid-safe'

import Customer from '../models/Customer.js'
import customerParser from '../utils/customerParser.js'

const customersRouter = new Router()

customersRouter.post('/signup', async (req, res) => {
    const customerData = req.body

    const passwordHash = await bcrypt.hash(customerData.password, 10)

    const newCustomer = new Customer({ ...customerData, passwordHash })
    const savedCustomer = await newCustomer.save()

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

    res.cookie('sid', sessionId, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
    })

    res.cookie('cid', customer.id, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
    })
    return res.status(202).end()
})

// TODO add identity verification with password for clearing sessions ( possibly in frontend )
customersRouter.post('/clearAllSessions', customerParser, async (req, res) => {
    const customer = req.customer

    customer.sessions = []
    await customer.save()

    res.cookie('cid', '', { maxAge: 0 })
    res.cookie('sid', '', { maxAge: 0 })

    return res.status(202).json({ message: 'All Sessions Destroyed' }).end()
})

export default customersRouter