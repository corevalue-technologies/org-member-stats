import Vue from 'vue'
let Config = new Vue({
  data () {
    return {
      baseUrl: 'https://api.github.com/',
      organization: 'corevalue-technologies',
      orgData: {}
    }
  },
  methods: {
    getRepos () {
        return this.baseUrl + 'orgs/' + this.organization + '/repos?per_page=200'
    },
    getOrgData () {
        return this.baseUrl + 'orgs/' + this.organization
    },
    getMembers () {
        return this.baseUrl + 'orgs/' + this.organization + '/members?role=member&per_page=1000'
    },
    getOwners () {
        return this.baseUrl + 'orgs/' + this.organization + '/members?role=admin&per_page=1000'
    }
  }
})

export default {
  install: function (vue) {
    vue.prototype.$config = Config
  }
}
