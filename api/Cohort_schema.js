const mongoose = require('mongoose')

// mongoose schema class
const Schema = mongoose.Schema

// instance of mongoose Schema class
var Cohort = new Schema({
  name: { type: String }
}, { collection: 'cohorts', timestamps: true })

module.exports = mongoose.model('Cohort', Cohort)
