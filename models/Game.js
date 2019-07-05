import mongoose from 'mongoose'

const Schema = mongoose.Schema
const gameSchema = new Schema({
  title: { type: String, required: true },
  shortname: { type: String , required: true, index: true },
  description: { type: String, required:true },
  link: { type: String },
  picture_path: {type: String},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
const Game = mongoose.model('games', gameSchema, 'games')

export default Game