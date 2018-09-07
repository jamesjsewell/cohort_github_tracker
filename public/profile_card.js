const GithubProfile = class {
  constructor (profile) {
    this.profile = profile
    this.renderGithubProfile()
    this.renderGithubRepos()
  }

  renderGithubProfile () {
    var profile = this.profile
    var url = `https://api.github.com/users/${this.profile.profile}`
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
      const $profileWrapper = $(`#${profile.profile}_profile`)

      $profileWrapper.html(`<div>
        ${htmlUrl ? `<a href="${htmlUrl}">${login ? `<strong>${login}</strong>` : 'view on github'}</a>` : null}
        ${avatar ? `<div class="avatar_wrapper u-full-width"><img class="u-max-full-width profile_avatar" src=${avatar} /></div>` : ''}
        ${name ? `<strong>${name}</strong>` : ''}
        </div>
      `)
    }

    function onError () {
      const $profileWrapper = $(`#${profile.profile}_profile`)
    }
  }

  renderGithubRepos () {
    var profile = this.profile
    var url = `https://api.github.com/users/${this.profile.profile}/repos?sort=pushed`
    $.ajax({
      url: url,
      method: 'GET',
      success: onSuccess,
      error: onError
    })

    function onSuccess (repos) {
      const $reposWrapper = $(`#${profile.profile}_repos`)

      var renderedRepos = ''

      repos.map((repo) => {
        renderedRepos += `
          <div id="${profile.profile}_repos">
            <a href="${repo.html_url}">${repo.name}</a>
          </div>

        `
      })

      $reposWrapper.append(renderedRepos)
    }

    function onError () {
      // const $profileWrapper = $(`#${profile.profile}_profile`)
    }
  }

  html () {
    var { id, profile, cohort} = this.profile
    return (`
      <div class="profile_card column">

        <div class="profile_card_content">
          <button onclick="deleteProfilePrompt(event, true, '${id}', '${profile}', '${cohort}')" class="remove_profile_button ${inputSecret ? '' : 'hidden'}">x</button>
          <div id="${profile}_profile" />
          
         
          <div id="${profile}_activity" class="gh_activity_wrapper">
              <p>Recent Github Activity</p>
            <img class="gh_activity_chart" src="http://ghchart.rshah.org/${profile}" alt="activity chart" />
            <div class="clearfix">&nbsp;</div>
          </div>
          <div class="repos_wrapper" id="${profile}_repos"><p>most recently updated repos, scroll up/down to see more</p></div>

        </div>
        
      </div>
    
    `)
  }
}