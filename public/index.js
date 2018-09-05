
$(document).ready(function () {
  $cohortNavWrapper = $('#cohort_nav')
  $studentCardsWrapper = $('#student_cards')
  $cohortName = $('#cohort_title')
  $editCohortWrapper = $('#edit_cohort_wrapper')
  $ajaxWrapper = $('#ajax_wrapper')
  $ajaxContent = $('#ajax_content')

  locationChanged()

  function locationChanged () {
    new App()
  }

  window.onhashchange = locationChanged
})
