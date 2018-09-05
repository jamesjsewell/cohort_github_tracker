
var students = null
var filteredStudents = null
var cohortArray = null
var selectedCohort = null
var inputSecret = null

function ajaxStatus (visible, content) {
  if (visible && content) {
    $ajaxContent.html(content)
    $ajaxWrapper.attr('class', '')
  } else {
    $ajaxWrapper.attr('class', 'hidden')
    $ajaxContent.attr('class', 'hidden')
  }
}

function authenticateStaffMember (e) {
  e.preventDefault()
  ajaxStatus(true, ajaxMessage)
  var secret = e.target.secret.value
  var ajaxMessage = `<div><p>checking if secret is correct</p></div>`

  var url = devEnv ? `${devApi}/edit` : '/edit'
  $.ajax({
    url: url,
    method: 'POST',
    success: onSuccess,
    error: onError,
    data: {secret: secret}
  })

  function onSuccess (response) {
    if (response) {
      if (response.authenticated === true) {
        inputSecret = secret
        if (selectedCohort) {
          $editCohortWrapper.html(`<form onsubmit="addUsername(event)" id="edit_cohort">
          change cohort name
          <input class="cohort_input" name="cohort_name" placeholder="cohort name" value="${selectedCohort.name}"/>
          add usernames
          <input class="cohort_input" name="username" placeholder="github username"/>
          <button id="edit_cohort_submit" type="submit">submit</button>
        </form>`)
        } else {
          $editCohortWrapper.html(`<div></div>`)
        }

        $('#create_cohort_link').attr('class', 'create_cohort_link')
      } else {
        resetEditCohortForm('incorrect secret')
      }
    } else {
      resetEditCohortForm()
    }
    ajaxStatus(false)
  }

  function onError (response) {
    resetEditCohortForm('server error')
    ajaxStatus(false)
  }
}

function resetEditCohortForm (message) {
  $editCohortWrapper.html(`<form onsubmit="authenticateStaffMember(event)" id="cohort_secret_input">
    <strong>staff member?</strong>
    <input type="password" name="secret" placeholder="secret" />
    <button type="submit">submit</button>
    ${message ? `<p>${message}</p>` : ''}
  </form>`)
}

function onCohortSelect (e, cohort) {
  if (e) {
    e.preventDefault()
  }

  if (!cohort) {
    var cohortId = e.target.id
    selectedCohort = cohortArray.find((cohort) => cohort._id === cohortId ? cohort : null)
  }

  if (selectedCohort && selectedCohort._id) {
    $cohortName.html(selectedCohort.name)
    $studentCardsWrapper.html('<div></div>')
    if (students && students.length) {
      filteredStudents = []
      students.map((student) => {
        if (student.cohort === selectedCohort._id) {
          var studentCard = new StudentGithub({userName: student.gh}).html()
          $studentCardsWrapper.append(studentCard)
          filteredStudents.push(student)
        }
      })

      if (inputSecret) {
        $editCohortWrapper.html(`<form onsubmit="addUsername(event)" id="edit_cohort">
          change cohort name
          <input class="cohort_input" name="cohort_name" placeholder="cohort name" value="${selectedCohort.name}"/>
          add usernames
          <input class="cohort_input" name="username" placeholder="github username"/>
          <button id="edit_cohort_submit" type="submit">submit</button>
        </form>`)
      }
    }
  }
}

function setCreateCohortForm (e) {
  e.preventDefault()
  $cohortName.html('')
  $studentCardsWrapper.html('<div></div>')
  $editCohortWrapper.html(`<form onsubmit="onCreateCohort(event)" id="add_create"><input placeholder="cohort name" name="cohort_name" /> <button type="submit">submit</button></form>`)
}

function onCreateCohort (e) {
  e.preventDefault()
  var ajaxMessage = `<div><p>creating cohort</p></div>`
  ajaxStatus(true, ajaxMessage)

  var cohortName = e.target.cohort_name.value
  var url = devEnv ? `${devApi}/cohorts` : '/cohorts'
  $.ajax({
    url: url,
    method: 'POST',
    success: onSuccess,
    error: onError,
    data: {name: cohortName, secret: inputSecret }
  })

  function onSuccess (response) {
    if (response) {
      if (response.created && response.created._id) {
        var cohort = response.created
        selectedCohort = cohort
        onCohortSelect(null, cohort)
      } else {

      }
    } else {

    }

    ajaxStatus(false)
  }

  function onError (response) {
    ajaxStatus(false)
  }
}

function addUsername (e) {
  e.preventDefault()

  if (selectedCohort && selectedCohort._id) {
    var gh = e.target.username.value

    e.preventDefault()
    var ajaxMessage = `<div><p>adding username</p></div>`
    ajaxStatus(true, ajaxMessage)
    var url = devEnv ? `${devApi}/students` : '/students'
    $.ajax({
      url: url,
      method: 'POST',
      success: onSuccess,
      error: onError,
      data: {gh: gh, secret: inputSecret, cohort: selectedCohort._id}
    })

    function onSuccess (response) {
      if (response) {
        if (response.created && response.created._id) {
          var username = response.created.gh
        } else {

        }
      } else {

      }

      ajaxStatus(false)
    }

    function onError (response) {
      ajaxStatus(false)
    }
  }
}

var App = class {
  constructor () {
    resetEditCohortForm()
    this.getCohortArray()
    this.getStudentArray()
  }

  getCohortArray () {
    var ajaxMessage = `<div><p>contacting the server, this may take a moment since it is hosted on heroku, free plan</p></div>`
    ajaxStatus(true, ajaxMessage)

    var url = devEnv ? `${devApi}/cohorts` : '/cohorts'
    $.ajax({
      url: url,
      method: 'GET',
      success: onSuccess,
      error: onError
    })

    function onSuccess (response) {
      if (response && response.length && response[0]._id) {
        cohortArray = response

        $cohortNavWrapper.html(`${
          cohortArray.map((cohort) => {
            return `<a href="" id="${cohort._id}" class="cohort_link" onclick="onCohortSelect(event)">${cohort.name}</a>`
          })}`)

        $cohortNavWrapper.append(`<a id="create_cohort_link" onclick="setCreateCohortForm(event)" class="create_cohort_link hidden" onclick="" href="">create</a>`)

        ajaxStatus(false)
      }
    }

    function onError (response) {
      var ajaxMessage = `<div><p>could not get cohort data from server</p></div>`
      ajaxStatus(true, ajaxMessage)
    }
  }

  getStudentArray () {
    var url = devEnv ? `${devApi}/students` : '/students'
    $.ajax({
      url: url,
      method: 'GET',
      success: onSuccess,
      error: onError
    })

    function onSuccess (response) {
      if (response && response.length && response[0]._id) {
        students = response
      }
      ajaxStatus(false)
    }

    function onError (response) {
      var ajaxMessage = `<div><p>could not get student data from server</p></div>`
      ajaxStatus(true, ajaxMessage)
    }
  }
}
