var cohorts = null
var selectedCohort = null

function getCohortData () {
  var ajaxMessage = `<div><p>contacting the server, this may take a moment since it is hosted on heroku, free plan</p></div>`
  ajaxStatus(true, ajaxMessage)

  var url = devEnv ? `${devApi}/cohorts` : `${prodApi}/cohorts`
  $.ajax({
    url: url,
    method: 'GET',
    success: onSuccess,
    error: onError
  })

  function onSuccess (response) {
    if (response && response.length && response[0]._id) {
      cohorts = response
      renderCohortNav()
    } else {
      cohorts = []
    }

    ajaxStatus(false)
  }

  function onError (response) {
    ajaxStatus(false)
  }
}

function onCohortSelect (e, cohort) {
  if (e) {
    e.preventDefault()
  }

  profiles = []

  if (!cohort) {
    var cohortId = e.target.id
    selectedCohort = cohorts.find((cohort) => cohort._id === cohortId ? cohort : null)
  }

  if (selectedCohort && selectedCohort._id) {
    getProfileData()
    renderCohortNav()

    if (inputSecret) {
      renderEditCohortForm()
    }
  }
}

function renderCohortNav () {
  if (selectedCohort) {
    $cohortName.html(`<h5>${selectedCohort.name}</h5>`)
  }

  $cohortNavWrapper.html(`${
    cohorts.map((cohort) => {
      return `<a href="" id="${cohort._id}" class="cohort_link" onclick="onCohortSelect(event)">${cohort.name}</a>`
    })}`)
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
  
          <form onsubmit="addProfile(event)" id="add_profile_form">
            <div class="form_contents">
              <p>add profiles</p>
              <input class="profile_input" name="profile" placeholder="github profile"/>
              <button id="add_profile_submit" type="submit">submit</button>
            </div>
          </form></div>`)
}

function editCohortName (e) {
  // selectedCohort.name
  e.preventDefault()

  if (selectedCohort.name && e.target.cohort_name.value && selectedCohort.name.toLowerCase() !== e.target.cohort_name.value.toLowerCase()) {
    var ajaxMessage = `<div><p>editing cohort name</p></div>`
    ajaxStatus(true, ajaxMessage)

    var cohortName = e.target.cohort_name.value
    var url = devEnv ? `${devApi}/cohorts/${selectedCohort._id}` : `${prodApi}/cohorts/${selectedCohort._id}`
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
      cohorts = response
      selectedCohort = cohorts.find((cohort) => cohort._id === selectedCohort._id ? cohort : null)
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

function renderCreateCohortForm (e) {
  if (e) {
    e.preventDefault()
  }

  $cohortName.html('')
  $profileCardsWrapper.html('<div></div>')
  $editCohortWrapper.html(`<form class="" onsubmit="onCreateCohort(event)" id="add_create"><input placeholder="cohort name" name="cohort_name" /> <button type="submit">submit</button></form> <a href="" onclick="removeCreateCohortForm(event)" >cancel</a>`)
}

function removeCreateCohortForm (e) {
  e.preventDefault()
  $editCohortWrapper.html('<div></div>')
}

function onCreateCohort (e) {
  e.preventDefault()
  var ajaxMessage = `<div><p>creating cohort</p></div>`
  ajaxStatus(true, ajaxMessage)

  var cohortName = e.target.cohort_name.value
  var url = devEnv ? `${devApi}/cohorts` : `${prodApi}/cohorts`
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

    getCohortData()
  }

  function onError (response) {
    ajaxStatus(false)
    removeCreateCohortForm
  }
}
