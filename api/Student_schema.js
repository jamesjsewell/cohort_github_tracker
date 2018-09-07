const mongoose = require('mongoose')

// mongoose schema class
const Schema = mongoose.Schema

// instance of mongoose Schema class
var Student = new Schema({
  gh: { type: String },
  cohort: { type: String }
}, { collection: 'gh_usernames', timestamps: true })

module.exports = mongoose.model('Student', Student)
