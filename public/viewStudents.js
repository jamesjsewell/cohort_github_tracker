var students = null
var cohortArray = null
var selectedCohort = null

function ajaxStatus (visible, content) {
  var $ajaxWrapper = $('#ajax_wrapper')
  var $ajaxContent = $('#ajax_content')
  if (visible && content) {
    $ajaxContent.html(content)
    $ajaxWrapper.attr('class', '')
  } else {
    $ajaxWrapper.attr('class', 'hidden')
    $ajaxContent.attr('class', 'hidden')
  }
}

function filterStudents (e, students) {
  e.preventDefault()
  var cohortId = e.target.id
  selectedCohort = cohortArray.find((cohort) => cohort._id === cohortId ? cohort : null)
  var $cardsWrapper = $('#student_cards')
  var $cohortName = $('#cohort_title')
  $cohortName.html(selectedCohort.name)
  $cardsWrapper.html('<div></div>')
  if (students && students.length) {
    students.map((student) => {
      if (student.cohort === cohortId) {
        var studentCard = new StudentGithub({userName: student.gh}).html()
        $cardsWrapper.append(studentCard)
      }
    })
  }
}

var ViewStudents = class {
  constructor (devEnv, devApi, $cohortNavWrapper, $studentsWrapper) {
    this.devEnv = devEnv
    this.devApi = devApi
    this.$cohortNavWrapper = $cohortNavWrapper
    this.$studentsWrapper = $studentsWrapper

    this.getCohortArray()
    this.getStudentArray()
  }

  getCohortArray () {
    var { devEnv, devApi, $cohortNavWrapper } = this

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
            return `<a href="#view" id="${cohort._id}" class="cohort_link" onclick="filterStudents(event, students)">${cohort.name}</a>`
          })}`)

        ajaxStatus(false)
      }
    }

    function onError (response) {
      var ajaxMessage = `<div><p>could not get cohort data from server</p></div>`
      ajaxStatus(true, ajaxMessage)
    }
  }

  getStudentArray () {
    const { devEnv, devApi} = this

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
      var ajaxMessage = `<div><p>could not get cohort data from server</p></div>`
      ajaxStatus(true, ajaxMessage)
    }
  }
}
