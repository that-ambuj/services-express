import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import customersRouter from './routes/customersRouter.js'

const app = new express()

mongoose
    .connect('mongodb://localhost:27017/services-db')
    .then(() => {
        console.log('connected to mongodb')
    })
    .catch(err => {
        console.log('error connecting to mongodb : ', err)
    })

app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser())

app.get('/', (req, res) => {
    console.log(req.cookies)
    return res.json({ message: 'Hello Express!' })
})

app.use('/customer', customersRouter)

app.listen(3001, () => {
    console.log('Server is running at http://localhost:3001')
})