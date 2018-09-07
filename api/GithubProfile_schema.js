const mongoose = require('mongoose')

// mongoose schema class
const Schema = mongoose.Schema

// instance of mongoose Schema class
var GithubProfile = new Schema({
  gh: { type: String },
  cohort: { type: String }
}, { collection: 'gh_profiles', timestamps: true })

module.exports = mongoose.model('GithubProfile', GithubProfile)
