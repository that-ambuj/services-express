import express from 'express'

const app = new express()

app.use(express.json())

app.get('/', (req, res) => {
    return res.json({ message: 'Hello Express!' })
})

app.listen(3001, () => {
    console.log('Server is running at http://localhost:3001')
})