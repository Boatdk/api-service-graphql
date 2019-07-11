import mongoose from 'mongoose'

const Schema = mongoose.Schema
const cardSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type:  [Number],
    required: true
  }
},{
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at'
  }
})

const Card = mongoose.model('cards', cardSchema, 'cards')

export default Card