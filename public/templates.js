
const Form = class {
  constructor (formInputs, submitAction) {
    this.formInputs = formInputs
    this.submitAction = submitAction
  }

  onSubmit (e) {
    e.preventDefault()
    this.submitAction()
  }

  html () {
    const inputs = this.formInputs

    return (`
      <form submit="${this.onSubmit.bind(this)}">
        ${inputs.map((input) => {
        return `
            <input name=${input.name} /> 
          `
      })}
      </form>
    
    `)
  }
}

// {
//   "login": "jetsetta",
//   "id": 38818892,
//   "node_id": "MDQ6VXNlcjM4ODE4ODky",
//   "avatar_url": "https://avatars0.githubusercontent.com/u/38818892?v=4",
//   "gravatar_id": "",
//   "url": "https://api.github.com/users/jetsetta",
//   "html_url": "https://github.com/jetsetta",
//   "followers_url": "https://api.github.com/users/jetsetta/followers",
//   "following_url": "https://api.github.com/users/jetsetta/following{/other_user}",
//   "gists_url": "https://api.github.com/users/jetsetta/gists{/gist_id}",
//   "starred_url": "https://api.github.com/users/jetsetta/starred{/owner}{/repo}",
//   "subscriptions_url": "https://api.github.com/users/jetsetta/subscriptions",
//   "organizations_url": "https://api.github.com/users/jetsetta/orgs",
//   "repos_url": "https://api.github.com/users/jetsetta/repos",
//   "events_url": "https://api.github.com/users/jetsetta/events{/privacy}",
//   "received_events_url": "https://api.github.com/users/jetsetta/received_events",
//   "type": "User",
//   "site_admin": false,
//   "name": "Sean JS",
//   "company": null,
//   "blog": "",
//   "location": null,
//   "email": null,
//   "hireable": null,
//   "bio": null,
//   "public_repos": 15,
//   "public_gists": 0,
//   "followers": 4,
//   "following": 6,
//   "created_at": "2018-04-28T20:14:42Z",
//   "updated_at": "2018-08-16T16:27:51Z"
// }

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
