const express = require('express')
const bodyParser = require('body-parser')
const Cohort = require('./Cohort_schema.js')
const GithubProfile = require('./GithubProfile_schema.js')
const mongoose = require('mongoose')
const path = require('path')

if (process.env.NODE_ENV == 'development') {
  require('dotenv').config()
}

// connects to a mongodb
const password = process.env.DB_PASS
console.log(password)
mongoose.connect(`mongodb://jamesjsewell:${password}@cluster0-shard-00-00-cants.mongodb.net:27017,cluster0-shard-00-01-cants.mongodb.net:27017,cluster0-shard-00-02-cants.mongodb.net:27017/digitalcrafts?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`, (err, db) => {
  if (err) {
    console.log(err)
  } else {
    console.log(
      '\n\n===== Connected to: ' + 'mongodb' + '=====\n\n'
    )
  }
})

// runs express app and sets defined port
var app = express()
const PORT = process.env.PORT || 3000
// app.set("port", PORT)

// middleware, transforms http request so that you can use req.body json format
// for accepting json data from http requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.all('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE') // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type') // If needed
  res.setHeader('Access-Control-Allow-Credentials', true) // If needed
  next()
})

app.post('/profiles', (req, res) => {
  var { gh, cohort, secret } = req.body
  if (gh && secret === process.env.COHORT_SECRET) {
    var NewGithubProfile = new GithubProfile({ gh: gh, cohort: cohort})
    NewGithubProfile.save(function (err, result) {
      if (err) {
        return res.status(200).json({ error: 'error, could not save' })
      }
      GithubProfile.find({cohort: cohort}, function (err, profiles) {
        if (err) {
          return res.status(200).json({ error: 'error, could not find profiles' })
        }

        return res.status(201).json(profiles)
      })
    })
  } else {
    res.end()
  }
})

app.get('/profiles', (req, res) => {
  GithubProfile.find((err, results) => {
    if (err) {
      return res.status(200).json({ error: 'error, could not get' })
    }

    return res.status(201).json(results)
  })
})

app.get('/profiles/:id', (req, res) => {
  GithubProfile.find(req.params.id ? { _id: req.params.id } : {}, (err, results) => {
    if (err) {
      return res.status(200).json({ error: 'error, could not get' })
    }

    return res.status(201).json(results)
  })
})

app.post('/profiles/filter', (req, res) => {
  GithubProfile.find(req.body, function (err, results) {
    if (err) {
      return res.status(200).json({ error: 'error, could not find cohort' })
    }

    return res.status(201).json(results)
  })
})

app.put('/profiles/:id', (req, res) => {
  var id = req.params.id

  GithubProfile.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true },
    function (err, results) {
      if (err) {
        return res.status(200).json({ error: 'error, could not update' })
      } else if (!results) {
        return res.status(200).json({ error: 'error, could not find profile' })
      } else {
        return res.status(201).json(results)
      }
    }
  )
})

app.post('/profiles/remove', (req, res) => {
  const { secret, id, cohort } = req.body
  if (secret === process.env.COHORT_SECRET) {
    GithubProfile.remove({ _id: id }, function (err) {
      if (err) {
        return res.status(200).json({ error: 'error, could not remove profile profile' })
      }

      GithubProfile.find({cohort: cohort}, function (err, profiles) {
        if (err) {
          return res.status(200).json({ error: 'error, could not find profiles' })
        }

        return res.status(201).json(profiles)
      })
    })
  }
})

// ---------- cohorts

app.post('/cohorts', (req, res) => {
  var { name, secret } = req.body

  if (name && secret === process.env.COHORT_SECRET) {
    var NewCohort = new Cohort({ name: name })
    NewCohort.save(function (err, result) {
      if (err) {
        return res.status(200).json({ error: 'error, could not save' })
      }
      res.status(201).json({ created: result })
    })
  } else {
    res.end()
  }
})

app.get('/cohorts', (req, res) => {
  Cohort.find((err, results) => {
    if (err) {
      return res.status(200).json({ error: 'error, could not get cohorts' })
    }

    return res.status(201).json(results)
  })
})

app.get('/cohorts/:id', (req, res) => {
  Cohort.find(req.params.id ? { _id: req.params.id } : {}, (err, results) => {
    if (err) {
      return res.status(200).json({ error: 'error, could not get' })
    }

    return res.status(201).json(results)
  })
})

app.post('/cohorts/filter', (req, res) => {
  Cohort.find(req.body, function (err, results) {
    if (err) {
      return res.status(200).json({ error: 'error, could not find cohort' })
    }

    return res.status(201).json(results)
  })
})

app.put('/cohorts/:id', (req, res) => {
  var id = req.params.id
  const { secret, name } = req.body

  if (secret === process.env.COHORT_SECRET) {
    Cohort.findByIdAndUpdate(
      { _id: id },
      {name: name},
      { new: true },
      function (err, results) {
        if (err) {
          return res.status(200).json({ error: 'error, could not update cohort' })
        } else if (!results) {
          return res.status(200).json({ error: 'error, could not find cohort' })
        } else {
          Cohort.find((err, results) => {
            if (err) {
              return res.status(200).json({ error: 'error, could not get cohorts' })
            }

            return res.status(201).json(results)
          })
        }
      }
    )
  }
})

app.delete('/cohorts/:id', (req, res) => {
  Cohort.remove({ _id: req.params.id }, function (err) {
    if (err) {
      return res.status(200).json({ error: 'error, could not remove cohort' })
    }

    return res.status(201).json({message: 'removed cohort'})
  })
})

app.post('/edit', (req, res) => {
  var { secret } = req.body
  if (secret === process.env.COHORT_SECRET) {
    return res.status(201).json({ authenticated: true })
  }

  return res.status(201).json({ authenticated: false })
})

// starts the app listening for requests
app.listen(PORT, function () {
  console.log(
    '\n\n===== listening for requests on port ' + PORT + ' =====\n\n'
  )
})
