var students = null

function filterStudents (e, students) {
  e.preventDefault()
  var cohortId = e.target.id
  if (students && students.length) {
    students.map((student) => {
      if (student.cohort === cohortId) {
        var studentCard = new StudentGithub({userName: student.gh}).html()
        $(`#student_cards`).append(studentCard)
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

  filterStudents (e) {
    e.preventDefault()
    var cohortId = e.target.id

    if (students && students.length) {
      students.map((student) => {
        if (student.cohort === cohortId) {
          var studentCard = new StudentGithub({userName: student.gh}).html()
          $(`#student_cards`).append(studentCard)
        }
      })
    }
  }

  getCohortArray () {
    var { devEnv, devApi, $cohortNavWrapper } = this

    var url = devEnv ? `${devApi}/cohorts` : '/cohorts'
    $.ajax({
      url: url,
      method: 'GET',
      success: onSuccess,
      error: onError
    })

    function onSuccess (response) {
      if (response && response.length && response[0]._id) {
        var cohortArray = response

        $cohortNavWrapper.html(`${
          cohortArray.map((cohort) => {
            return `<a href="#view" id="${cohort._id}" class="cohort_link" onclick="filterStudents(event, students)">${cohort.name}</a>`
          })}`)
      }
    }

    function onError (response) {

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
    }

    function onError (response) {

    }
  }
}
