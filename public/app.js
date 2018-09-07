var inputSecret = null

function authenticateStaffMember (e) {
  e.preventDefault()
  ajaxStatus(true, ajaxMessage)
  var secret = e.target.secret.value
  var ajaxMessage = `<div><p>checking if secret is correct</p></div>`

  var url = devEnv ? `${devApi}/edit` : `${prodApi}/edit`
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
          $('.remove_profile_button').attr('class', 'remove_profile_button')

          if (inputSecret) {
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

var initializeApp = function () {
  getCohortData()
  renderSecretForm()

  $createCohortLink.click((event) => {
    event.preventDefault()
    renderCreateCohortForm()
  })
}
