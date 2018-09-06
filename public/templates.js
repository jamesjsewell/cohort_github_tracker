// function deleteUsernamePrompt (e, visible, id, userName, cohort) {
//   e.preventDefault()

//   if (visible && id) {
//     $modalContent.html(`
//       <div>
//         <p>are you sure you want to delete ${userName}?</p>
//         <button onclick="deleteUsernamePrompt(event, false, null, null)">no</button>
//         <button onclick="deleteUsername(event, '${id}', '${cohort}')">yes</button>

//       </div>


//     `)
//     $modalWrapper.attr('class', '')
//     $modalContent.attr('class', '')
//   } else {
//     $modalWrapper.attr('class', 'hidden')
//     $modalContent.attr('class', 'hidden')
//   }
// }

// function deleteUsername (e, id, cohort) {
//   e.preventDefault()

//   if (id) {
//     var ajaxMessage = `<div><p>removing profile</p></div>`
//     ajaxStatus(true, ajaxMessage)
//     var url = devEnv ? `${devApi}/students/remove` : '/students/remove'
//     $.ajax({
//       url: url,
//       method: 'POST',
//       success: onSuccess,
//       error: onError,
//       data: {id: id, secret: inputSecret, cohort: cohort }
//     })
//   }

//   function onSuccess (response) {
//     if (response) {
//       if (response && response.length && !response.error) {
//         filteredStudents = response
//         renderGithubCards()
//       } else {

//       }
//     } else {

//     }

//     ajaxStatus(false)
//   }

//   function onError (response) {
//     ajaxStatus(false)
//   }
// }

// const StudentGithub = class {
//   constructor (student) {
//     this.student = student
//     this.renderGithubProfile()
//     this.renderGithubRepos()
//   }

//   renderGithubProfile () {
//     var student = this.student
//     var url = `https://api.github.com/users/${this.student.userName}`
//     $.ajax({
//       url: url,
//       method: 'GET',
//       success: onSuccess,
//       error: onError
//     })

//     function onSuccess (profileJson) {
//       const { login, bio, name } = profileJson
//       const htmlUrl = profileJson.html_url

//       var avatar = profileJson.avatar_url
//       const $profileWrapper = $(`#${student.userName}_profile`)

//       $profileWrapper.html(`<div>
//         ${htmlUrl ? `<a href="${htmlUrl}">${login ? `<strong>${login}</strong>` : 'view on github'}</a>` : null}
//         ${avatar ? `<div class="avatar_wrapper u-full-width"><img class="u-max-full-width student_avatar" src=${avatar} /></div>` : ''}
//         ${name ? `<strong>${name}</strong>` : ''}
//         </div>
//       `)
//     }

//     function onError () {
//       const $profileWrapper = $(`#${student.userName}_profile`)
//     }
//   }

//   renderGithubRepos () {
//     var student = this.student
//     var url = `https://api.github.com/users/${this.student.userName}/repos?sort=pushed`
//     $.ajax({
//       url: url,
//       method: 'GET',
//       success: onSuccess,
//       error: onError
//     })

//     function onSuccess (repos) {
//       const $reposWrapper = $(`#${student.userName}_repos`)

//       var renderedRepos = ''

//       repos.map((repo) => {
//         renderedRepos += `
//           <div id="${student.userName}_repos">
//             <a href="${repo.html_url}">${repo.name}</a>
//           </div>

//         `
//       })

//       $reposWrapper.append(renderedRepos)
//     }

//     function onError () {
//       // const $profileWrapper = $(`#${student.userName}_profile`)
//     }
//   }

//   html () {
//     return (`
//       <div class="student_card column">

//         <div class="student_card_content">
//           <button onclick="deleteUsernamePrompt(event, true, '${this.student.id}', '${this.student.userName}', '${this.student.cohort}')" class="remove_student_button">x</button>
//           <div id="${this.student.userName}_profile" />


//           <div id="${this.student.userName}_activity" class="gh_activity_wrapper">
//               <p>Recent Github Activity</p>
//             <img class="gh_activity_chart" src="http://ghchart.rshah.org/${this.student.userName}" alt="activity chart" />
//             <div class="clearfix">&nbsp;</div>
//           </div>
//           <div class="repos_wrapper" id="${this.student.userName}_repos"><p>most recently updated repos, scroll up/down to see more</p></div>

//         </div>

//       </div>

//     `)
//   }
// }
