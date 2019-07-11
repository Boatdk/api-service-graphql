import mongoose from 'mongoose'

const Schema = mongoose.Schema
const card_serialSchema = new Schema({
    serial: {
        type: String
    },
    pin: {
        type: String
    },
    price: {
        type: Int,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Card_serial = mongoose.model('cards_serial', card_serialSchema, 'cards_serial')

export default Card_serial