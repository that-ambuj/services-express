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
        status: { type: String, required: true, default: 'unassigned' },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
        location: {
            area: String,
            city: String,
            state: String,
            coordinates: { latitude: Number, longitude: Number },
        },
    },
    { timestamps: true }
)

export default mongoose.model('Job', jobSchema)
