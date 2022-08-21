import { mongoose } from 'mongoose'

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, required: true },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
            default: null,
        },
        status: { type: String, required: true, default: 'UNASSIGNED' },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        location: {
            area: String,
            city: String,
            state: String,
            coordinates: { latitude: Number, longitude: Number },
        },
    },
    { timestamps: true },
)

jobSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

export default mongoose.model('Job', jobSchema)