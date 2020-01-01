<template>
    <div class="main-content">
        <div class="header padding20">
            <div class="flex alignCenter justifySpace">
                <h4>
                    {{$config.orgData.description}}
                </h4>
                <div class="width50">
                    <label>Access Token</label>
                    <div class="flex">
                        <input type="text" v-model="token" class="form-control marginR10">
                        <button class="btn btn-primary" @click="saveToken()">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="body">
            <div>
                <h5 class="heading">Top Members:</h5>
                <hr>
                <div class="row padding20">
                    <div class="loading" v-if="memberLoading">
                        <semipolar-spinner
                            :animation-duration="1000"
                            :size="40"
                            color="midnightblue"
                            class="inner-loader marginAuto marginB20"
                            style="margin: auto;"
                        ></semipolar-spinner>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6" v-for="(member, index) in filteredMembers" :key="index">
                        <member-card v-if="!memberLoading" :memberName="member.login" :memberImage="member.avatar_url" :memberUrl="member.html_url" :type="'member'" :memberOrgRepo="member.repos.length"></member-card>
                    </div>
                    <p class="text-center margin0 full-width" v-if="noMember && token !== ''">No members found.</p>
                    <p class="text-center margin0 full-width colorRed" v-if="invalidToken && token !== ''">Access token is not correct. You are unauthorised.</p>
                    <p class="text-center margin0 full-width" v-if="!tokenSet">Please provide a github access token to view data.</p>
                </div>
            </div>
            <div>
                <h5 class="heading">Owners:</h5>
                <hr>
                <div class="row padding20">
                    <div class="loading" v-if="memberLoading">
                        <semipolar-spinner
                            :animation-duration="1000"
                            :size="40"
                            color="midnightblue"
                            class="inner-loader marginAuto marginB20"
                            style="margin: auto;"
                        ></semipolar-spinner>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6" v-for="(owner, index) in owners" :key="index">
                        <member-card v-if="!memberLoading" :memberName="owner.login" :memberImage="owner.avatar_url" :type="'owner'" :memberUrl="owner.html_url"></member-card>
                    </div>
                    <p class="text-center margin0 full-width" v-if="noMember && token !== ''">No members found.</p>
                    <p class="text-center margin0 full-width colorRed" v-if="invalidToken && token !== ''">Access token is not correct. You are unauthorised.</p>
                    <p class="text-center margin0 full-width" v-if="!tokenSet">Please provide a github access token to view data.</p>
                </div>
            </div>
            <div>
                <h5 class="heading">Members:</h5>
                <hr>
                <div class="row padding20">
                    <div class="loading" v-if="memberLoading">
                        <semipolar-spinner
                            :animation-duration="1000"
                            :size="40"
                            color="midnightblue"
                            class="inner-loader marginAuto marginB20"
                            style="margin: auto;"
                        ></semipolar-spinner>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6" v-for="(member, index) in members" :key="index">
                        <member-card v-if="!memberLoading" :memberName="member.login" :memberImage="member.avatar_url" :memberUrl="member.html_url" :type="'member'" :memberOrgRepo="member.repos.length"></member-card>
                    </div>
                    <p class="text-center margin0 full-width" v-if="noMember && token !== ''">No members found.</p>
                    <p class="text-center margin0 full-width colorRed" v-if="invalidToken && token !== ''">Access token is not correct. You are unauthorised.</p>
                    <p class="text-center margin0 full-width" v-if="!tokenSet">Please provide a github access token to view data.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MemberCard from './memberCard.vue'
import axios from 'axios'
export default {
    data () {
        return {
            repos: [],
            members: [],
            topMembers: [],
            owners: [],
            memberLoading: false,
            token: '',
            noMember: false,
            invalidToken: false,
            tokenSet: false,
            mappedRepos: []
        }
    },
    computed: {
        filteredMembers () {
            let sorted = this.members.sort((a, b) => {
                return b.repos.length - a.repos.length
            })
            let topFive = sorted.slice(0, 3)
            return topFive
        }
    },
    components: {
        MemberCard
    },
    methods: {
        getRepositories () {
            axios.get(this.$config.getRepos())
            .then(res => {
                this.repos = res.data
            })
        },
        saveToken () {
            axios.interceptors.request.use((config) => {
            let token = this.token
            this.tokenSet = true
            if (token !== null) {
                config.headers.Authorization = `token ${token}`
            }
            return config
            }, (err) => {
                return Promise.reject(err)
            })
            this.getRepositories()
            this.getMembers()
        },
        getOwners () {
            this.owners = []
            axios.get(this.$config.getOwners())
            .then(res => {
                this.owners = res.data
            }).catch(() => {
                this.memberLoading = false
                this.invalidToken = true
            })
        },
        getMembers () {
            let self = this
            self.memberLoading = true
            self.noMember = false
            self.members = []
            self.invalidToken = false
            axios.get(self.$config.getMembers())
            .then(res => {
                self.members = res.data
                console.log(self.members)
                if (self.members.length > 0) {
                    self.getOwners()
                    self.getMemberViseRepo()
                } else {
                    self.memberLoading = false
                    self.noMember = true
                }
            }).catch(() => {
                self.memberLoading = false
                self.invalidToken = true
            })
        },
        getMemberViseRepo () {
            console.log('vise repo')
            this.members.forEach((member, index) => {
                this.$set(member, 'repos', [])
                this.getIndividualRepo(member, member.login, index)
            })
        },
        getIndividualRepo (memberObj, memberLogin, index) {
            console.log('ind repo')
            axios.get(`https://api.github.com/users/${memberLogin}/repos?type=all`)
            .then(res => {
                this.findOrgRepo(memberObj, res.data, index)
            })
        },
        findOrgRepo (member, repos, index) {
            let filteredBy = repos.filter(repo => {
                return repo.owner.login === 'corevalue-technologies'
            })
            filteredBy.forEach(repo => {
                this.mappedRepos.push(repo)
            })
            if (index === this.members.length - 1) {
                this.getRemainRepo()
            }
            this.$set(member, 'repos', filteredBy)
        },
        getRemainRepo () {
            this.mappedRepos.forEach((repo, index) => {
                let ind = this.repos.findIndex(el => {
                    return el.id === repo.id
                })
                this.repos.splice(ind, 1)
                if (index === this.mappedRepos.length - 1) {
                    this.memberLoading = false
                }
            })
        }
    }
}
</script>
