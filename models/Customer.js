import { mongoose } from 'mongoose'

const customerSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    name: String,
    addresses: [
        {
            building: String,
            street: String,
            area: String,
            city: String,
            state: String,
            pincode: Number
        }
    ],
    contactDetails: {
        number: String,
        email: String
    },
    // Jobs created by the user
    jobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
})

export default mongoose.model('Customer', customerSchema)