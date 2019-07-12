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
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },

}, {
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at'
  }
})

const Card_serial = mongoose.model('cards_serial', card_serialSchema, 'cards_serial')

export default Card_serial