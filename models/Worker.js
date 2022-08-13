import { mongoose } from 'mongoose'

const workerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    verified: { type: Boolean, default: false },
    location: {
        area: String,
        city: String,
        state: String,
        coordinates: { latitude: String, longitude: String },
        pincode: Number
    },
    contactDetails: {
        number: String,
        email: String,
    },
    // Jobs assigned to and done by the worker
    jobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
})

export default mongoose.model('Worker', workerSchema)
