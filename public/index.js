
$(document).ready(function () {
  $secretFormWrapper = $('#secret_form_wrapper')
  $cohortNavWrapper = $('#cohort_nav')
  $studentCardsWrapper = $('#student_cards')
  $createCohortLink = $('#create_cohort_link')
  $cohortName = $('#cohort_title')
  $editCohortWrapper = $('#edit_cohort_wrapper')
  $ajaxWrapper = $('#ajax_wrapper')
  $ajaxContent = $('#ajax_content')
  $modalWrapper = $('#modal_wrapper')
  $modalContent = $('#modal_content')

  locationChanged()

  function locationChanged () {
    initializeApp()
  }

  window.onhashchange = locationChanged
})
