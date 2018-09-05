
const StudentGithub = class {
  constructor (student) {
    this.student = student
    this.renderGithubProfile()
    this.renderGithubRepos()
  }

  renderGithubProfile () {
    var student = this.student
    var url = `https://api.github.com/users/${this.student.userName}`
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
      const $profileWrapper = $(`#${student.userName}_profile`)

      $profileWrapper.html(`<div>
        ${htmlUrl ? `<a href="${htmlUrl}">${login ? `<strong>${login}</strong>` : 'view on github'}</a>` : null}
        ${avatar ? `<div class="avatar_wrapper u-full-width"><img class="u-max-full-width student_avatar" src=${avatar} /></div>` : ''}
        ${name ? `<strong>${name}</strong>` : ''}
        </div>
      `)
    }

    function onError () {
      const $profileWrapper = $(`#${student.userName}_profile`)
    }
  }

  renderGithubRepos () {
    var student = this.student
    var url = `https://api.github.com/users/${this.student.userName}/repos?sort=pushed`
    $.ajax({
      url: url,
      method: 'GET',
      success: onSuccess,
      error: onError
    })

    function onSuccess (repos) {
      const $reposWrapper = $(`#${student.userName}_repos`)

      var renderedRepos = ''

      repos.map((repo) => {
        renderedRepos += `
          <div id="${student.userName}_repos">
            <a href="${repo.html_url}">${repo.name}</a>
          </div>

        `
      })

      $reposWrapper.append(renderedRepos)
    }

    function onError () {
      // const $profileWrapper = $(`#${student.userName}_profile`)
    }
  }

  html () {
    return (`
      <div class="student_card column">

        <div class="student_card_content">
          <button class="remove_student_button">x</button>
          <div id="${this.student.userName}_profile" />
          
         
          <div id="${this.student.userName}_activity" class="gh_activity_wrapper">
              <p>Recent Github Activity</p>
            <img class="gh_activity_chart" src="http://ghchart.rshah.org/${this.student.userName}" alt="activity chart" />
            <div class="clearfix">&nbsp;</div>
          </div>
          <div class="repos_wrapper" id="${this.student.userName}_repos"><p>most recently updated repos, scroll up/down to see more</p></div>

        </div>
        
      </div>
    
    `)
  }
}
