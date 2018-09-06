
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
          $('.remove_student_button').attr('class', 'remove_student_button')
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
    filteredStudents = []
    students.map((student) => {
      if (student.cohort === selectedCohort._id) {
        filteredStudents.push(student)
      }
    })
    renderGithubCards()

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
    getCohortArray()
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
  }

  function onSuccess (response) {
    if (response) {
      if (response && response.length) {
        filteredStudents = response
        renderGithubCards()
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

function renderGithubCards () {
  if (filteredStudents && filteredStudents.length) {
    $cohortName.html(selectedCohort.name)
    $studentCardsWrapper.html('<div></div>')
    filteredStudents.map((student) => {
      var studentCard = new StudentGithub({userName: student.gh, id: student._id, cohort: student.cohort}).html()
      $studentCardsWrapper.append(studentCard)
    })
  } else {
    if (filteredStudents && !filteredStudents.length) {
      $studentCardsWrapper.html('<div></div>')
    }
  }
}

function getCohortArray () {
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

function getStudentArray () {
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

function deleteUsernamePrompt (e, visible, id, userName, cohort) {
  e.preventDefault()

  if (visible && id) {
    $modalContent.html(`
      <div>
        <p>are you sure you want to delete ${userName}?</p>
        <button onclick="deleteUsernamePrompt(event, false, null, null)">no</button> 
        <button onclick="deleteUsername(event, '${id}', '${cohort}')">yes</button>

      </div>
    
    
    `)
    $modalWrapper.attr('class', '')
    $modalContent.attr('class', '')
  } else {
    $modalWrapper.attr('class', 'hidden')
    $modalContent.attr('class', 'hidden')
  }
}

function deleteUsername (e, id, cohort) {
  e.preventDefault()

  if (id) {
    var ajaxMessage = `<div><p>removing profile</p></div>`
    ajaxStatus(true, ajaxMessage)
    var url = devEnv ? `${devApi}/students/remove` : '/students/remove'
    $.ajax({
      url: url,
      method: 'POST',
      success: onSuccess,
      error: onError,
      data: {id: id, secret: inputSecret, cohort: cohort }
    })
  }

  function onSuccess (response) {
    if (response) {
      if (response && response.length && !response.error) {
        filteredStudents = response
        $modalWrapper.attr('class', 'hidden')
        $modalContent.attr('class', 'hidden')
        renderGithubCards()
      } else {
        if (response && !response.error && !response.length) {
          filteredStudents = response
          $modalWrapper.attr('class', 'hidden')
          $modalContent.attr('class', 'hidden')
          renderGithubCards()
        }
      }
    } else {

    }

    ajaxStatus(false)
  }

  function onError (response) {
    ajaxStatus(false)
  }
}

const StudentGithub = class {
  constructor (student) {
    this.student = student
    this.renderGithubProfile()
    this.renderGithubRepos()
  }

  renderGithubProfile () {
    var student = this.student
    var url = `https://api.github.com/users/${this.student.userName}`
    $.ajax({
      url: url,
      method: 'GET',
      success: onSuccess,
      error: onError
    })

    function onSuccess (profileJson) {
      const { login, bio, name } = profileJson
      const htmlUrl = profileJson.html_url

      var avatar = profileJson.avatar_url
      const $profileWrapper = $(`#${student.userName}_profile`)

      $profileWrapper.html(`<div>
        ${htmlUrl ? `<a href="${htmlUrl}">${login ? `<strong>${login}</strong>` : 'view on github'}</a>` : null}
        ${avatar ? `<div class="avatar_wrapper u-full-width"><img class="u-max-full-width student_avatar" src=${avatar} /></div>` : ''}
        ${name ? `<strong>${name}</strong>` : ''}
        </div>
      `)
    }

    function onError () {
      const $profileWrapper = $(`#${student.userName}_profile`)
    }
  }

  renderGithubRepos () {
    var student = this.student
    var url = `https://api.github.com/users/${this.student.userName}/repos?sort=pushed`
    $.ajax({
      url: url,
      method: 'GET',
      success: onSuccess,
      error: onError
    })

    function onSuccess (repos) {
      const $reposWrapper = $(`#${student.userName}_repos`)

      var renderedRepos = ''

      repos.map((repo) => {
        renderedRepos += `
          <div id="${student.userName}_repos">
            <a href="${repo.html_url}">${repo.name}</a>
          </div>

        `
      })

      $reposWrapper.append(renderedRepos)
    }

    function onError () {
      // const $profileWrapper = $(`#${student.userName}_profile`)
    }
  }

  html () {
    return (`
      <div class="student_card column">

        <div class="student_card_content">
          <button onclick="deleteUsernamePrompt(event, true, '${this.student.id}', '${this.student.userName}', '${this.student.cohort}')" class="remove_student_button ${inputSecret ? '' : 'hidden'}">x</button>
          <div id="${this.student.userName}_profile" />
          
         
          <div id="${this.student.userName}_activity" class="gh_activity_wrapper">
              <p>Recent Github Activity</p>
            <img class="gh_activity_chart" src="http://ghchart.rshah.org/${this.student.userName}" alt="activity chart" />
            <div class="clearfix">&nbsp;</div>
          </div>
          <div class="repos_wrapper" id="${this.student.userName}_repos"><p>most recently updated repos, scroll up/down to see more</p></div>

        </div>
        
      </div>
    
    `)
  }
}

var initializeApp = function () {
  resetEditCohortForm()
  getCohortArray()
  getStudentArray()
}
