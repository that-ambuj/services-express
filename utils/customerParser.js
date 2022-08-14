import Customer from '../models/Customer.js'

const customerParser = async (req, res, next) => {
    const sessionId = await req.cookies.sid
    const customerId = await req.cookies.cid

    const customer = await Customer.findById(customerId)

    if (customer === null) {
        return res.status(406).json({ error: 'Invalid or Missing UserId' })
    }

    const customerHasSession = (await customer.sessions?.indexOf(sessionId)) > -1

    if (!customerHasSession) {
        return res.status(403).json({ error: 'Invalid Session' })
    }

    req.customer = customer
    next()
}

export default customerParser