
$(document).ready(function () {
  var $cohortNavWrapper = $('#cohort_nav')
  var $studentsWrapper = $(`#student_cards`)

  var devEnv = true
  var devApi = 'http://localhost:3000'
  var students = null
  var studentsFiltered = null

  locationChanged()

  function locationChanged () {
    var browserLocation = location.hash.substr(1)

    switch (browserLocation) {
      case 'edit':

        break

      case 'view':

        new ViewStudents(true, devApi, $cohortNavWrapper, $studentsWrapper)

        break
    }
  }

  window.onhashchange = locationChanged
})
