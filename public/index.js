
$(document).ready(function () {

  $secretFormWrapper = $('#secret_form_wrapper')
  $ajaxWrapper = $('#ajax_wrapper')
  $ajaxContent = $('#ajax_content')
  $modalWrapper = $('#modal_wrapper')
  $modalContent = $('#modal_content')

  $profileCardsWrapper = $('#profile_cards')
  
  $cohortName = $('#cohort_title')
  $cohortNavWrapper = $('#cohort_nav')
  $createCohortLink = $('#create_cohort_link')
  $editCohortWrapper = $('#edit_cohort_wrapper')
  

  locationChanged()

  function locationChanged () {
    initializeApp()
  }

  window.onhashchange = locationChanged
})
