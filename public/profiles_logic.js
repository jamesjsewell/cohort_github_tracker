var profiles = null

function getProfileData () {
  var ajaxMessage = `<div><p>getting profiles</p></div>`
  ajaxStatus(true, ajaxMessage)
  var url = devEnv ? `${devApi}/profiles/filter` : `${prodApi}/profiles/filter`
  $.ajax({
    url: url,
    method: 'POST',
    data: { cohort: selectedCohort._id },
    success: onSuccess,
    error: onError
  })

  function onSuccess (response) {
    if (response && !response.error) {
      profiles = response
      renderProfileCards()
    }
    ajaxStatus(false)
  }

  function onError (response) {
    ajaxStatus(false)
  }
}

function addProfile (e) {
  e.preventDefault()

  if (selectedCohort && selectedCohort._id) {
    var gh = e.target.profile.value

    e.preventDefault()
    var ajaxMessage = `<div><p>adding profile</p></div>`
    ajaxStatus(true, ajaxMessage)
    var url = devEnv ? `${devApi}/profiles` : `${prodApi}/profiles`
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
      profiles = response
      renderProfileCards()
    } else {

    }

    ajaxStatus(false)
  }

  function onError (response) {
    ajaxStatus(false)
  }
}

function deleteProfilePrompt (e, visible, id, profile, cohort) {
  e.preventDefault()

  if (visible && id) {
    $modalContent.html(`
      <div>
        <p>are you sure you want to delete ${profile}?</p>
        <button onclick="deleteProfilePrompt(event, false, null, null)">no</button> 
        <button onclick="deleteProfile(event, '${id}', '${cohort}')">yes</button>

      </div>
    
    
    `)
    $modalWrapper.attr('class', '')
    $modalContent.attr('class', '')
  } else {
    $modalWrapper.attr('class', 'hidden')
    $modalContent.attr('class', 'hidden')
  }
}

function deleteProfile (e, id, cohort) {
  e.preventDefault()

  if (id) {
    var ajaxMessage = `<div><p>removing profile</p></div>`
    ajaxStatus(true, ajaxMessage)
    var url = devEnv ? `${devApi}/profiles/remove` : `${prodApi}/profiles/remove`
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
        profiles = response
        $modalWrapper.attr('class', 'hidden')
        $modalContent.attr('class', 'hidden')
        renderProfileCards()
      } else {
        if (response && !response.error && !response.length) {
          profiles = response
          $modalWrapper.attr('class', 'hidden')
          $modalContent.attr('class', 'hidden')
          renderProfileCards()
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

function renderProfileCards () {
  if (profiles && profiles.length) {
    $cohortName.html(selectedCohort.name)
    $profileCardsWrapper.html('<div></div>')
    profiles.map((profile) => {
      var profileCard = new GithubProfile({profile: profile.gh, id: profile._id, cohort: profile.cohort}).html()
      $profileCardsWrapper.append(profileCard)
    })
  } else {
    if (profiles && !profiles.length) {
      noProfilesToShow()
    }
  }
}

function noProfilesToShow () {
  $profileCardsWrapper.html('<div><p>no profiles added to this cohort yet</p></div>')
}
