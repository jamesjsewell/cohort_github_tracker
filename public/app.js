
var students = null
var filteredStudents = null
var cohortArray = null
var selectedCohort = null
var inputSecret = null

function ajaxStatus (visible, content) {
  if (visible && content) {
    $ajaxContent.html(content)
    $ajaxWrapper.attr('class', '')
    $ajaxContent.attr('class', '')
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

          if(inputSecret){
            renderEditCohortForm()
          }
          
        } else {
          $editCohortWrapper.html(`<div></div>`)
        }
        $createCohortLink.attr('class', 'create_cohort_link')

        $secretFormWrapper.html('<div></div>')
      } else {
        renderSecretForm('incorrect secret')
      }
    } else {
      renderSecretForm()
    }
    ajaxStatus(false)
  }

  function onError (response) {
    renderSecretForm('server error')
    ajaxStatus(false)
  }
}

function renderSecretForm (message) {
  $editCohortWrapper.html(`<div></div>`)
  $secretFormWrapper.html(`<form onsubmit="authenticateStaffMember(event)" id="cohort_secret_input">
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

  students = []

  if (!cohort) {
    var cohortId = e.target.id
    selectedCohort = cohortArray.find((cohort) => cohort._id === cohortId ? cohort : null)
  }

  if (selectedCohort && selectedCohort._id) {
    getStudentArray()
    renderCohortNav()
    if (inputSecret) {
      
      renderEditCohortForm()
    }
  }
}

function renderEditCohortForm () {
  $editCohortWrapper.html(`<div class="edit_cohort_forms">
          <form onsubmit="editCohortName(event)" id="edit_cohort_form">
            <div class="form_contents">
              <p>change cohort name</p>
              <input class="cohort_name_input" name="cohort_name" placeholder="cohort name" value="${selectedCohort.name}"/>
              <button id="edit_name_submit" type="submit">submit</button>
            </div>
          </form>
  
          <form onsubmit="addUsername(event)" id="add_username_form">
            <div class="form_contents">
              <p>add usernames</p>
              <input class="username_input" name="username" placeholder="github username"/>
              <button id="add_username_submit" type="submit">submit</button>
            </div>
          </form></div>`)
}

function removeCreateCohortForm(e){
    e.preventDefault()
    $editCohortWrapper.html('<div></div>')
    
}

function renderCreateCohortForm (e) {

  if(e){
    e.preventDefault()
  }
 
  $cohortName.html('')
  $studentCardsWrapper.html('<div></div>')
  $editCohortWrapper.html(`<form class="" onsubmit="onCreateCohort(event)" id="add_create"><input placeholder="cohort name" name="cohort_name" /> <button type="submit">submit</button></form> <a href="" onclick="removeCreateCohortForm(event)" >cancel</a>`)
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

function editCohortName (e) {
  // selectedCohort.name
  e.preventDefault()

  if (selectedCohort.name && e.target.cohort_name.value && selectedCohort.name.toLowerCase() !== e.target.cohort_name.value.toLowerCase()) {
    var ajaxMessage = `<div><p>editing cohort name</p></div>`
    ajaxStatus(true, ajaxMessage)

    var cohortName = e.target.cohort_name.value
    var url = devEnv ? `${devApi}/cohorts/${selectedCohort._id}` : `/cohorts/${selectedCohort._id}`
    $.ajax({
      url: url,
      method: 'PUT',
      success: onSuccess,
      error: onError,
      data: { name: cohortName, secret: inputSecret }
    })
  }

  function onSuccess (response) {
    function updateCohortArray () {
      cohortArray = response
      selectedCohort = cohortArray.find((cohort) => cohort._id === selectedCohort._id ? cohort : null)
      renderCohortNav()
    }
    if (response) {
      if (response && response.length && !response.error) {
        updateCohortArray()
      } else {
        if (response && !response.length && !response.error) {
          updateCohortArray()
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
    if (response && response[0] && response[0]._id) {
      students = response
      renderGithubCards()
    } else {

    }

    ajaxStatus(false)
  }

  function onError (response) {
    ajaxStatus(false)
  }
}

function renderGithubCards () {
  if (students && students.length) {
    $cohortName.html(selectedCohort.name)
    $studentCardsWrapper.html('<div></div>')
    students.map((student) => {
      var studentCard = new StudentGithub({userName: student.gh, id: student._id, cohort: student.cohort}).html()
      $studentCardsWrapper.append(studentCard)
    })
  } else {
    if (students && !students.length) {
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
      renderCohortNav()
      ajaxStatus(false)
    }
  }

  function onError (response) {
   
    ajaxStatus(false)
  }
}

function renderCohortNav () {
  if (selectedCohort) {
    $cohortName.html(`<h5>${selectedCohort.name}</h5>`)
  }

  $cohortNavWrapper.html(`${
    cohortArray.map((cohort) => {
      return `<a href="" id="${cohort._id}" class="cohort_link" onclick="onCohortSelect(event)">${cohort.name}</a>`
    })}`)
}

function getStudentArray () {
  var ajaxMessage = `<div><p>getting profiles</p></div>`
  ajaxStatus(true, ajaxMessage)
  var url = devEnv ? `${devApi}/students/filter` : '/students/filter'
  $.ajax({
    url: url,
    method: 'POST',
    data: { cohort: selectedCohort._id },
    success: onSuccess,
    error: onError
  })

  function onSuccess (response) {
    if (response && !response.error) {
      students = response
      renderGithubCards()
    }
    ajaxStatus(false)
  }

  function onError (response) {
  
    ajaxStatus(false)
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
        students = response
        $modalWrapper.attr('class', 'hidden')
        $modalContent.attr('class', 'hidden')
        renderGithubCards()
      } else {
        if (response && !response.error && !response.length) {
          students = response
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
  $('#create_cohort_link').click((event)=>{
  
    event.preventDefault()
    renderCreateCohortForm()
  })
  renderSecretForm()
  getCohortArray()
}
