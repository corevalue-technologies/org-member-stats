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
                        <member-card v-if="!memberLoading" :memberName="member.login" :memberImage="member.avatar_url" :memberUrl="member.html_url" :memberOrgRepo="member.totalOrgRepo"></member-card>
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
                        <member-card v-if="!memberLoading" :memberName="member.login" :memberImage="member.avatar_url" :memberUrl="member.html_url" :memberOrgRepo="member.totalOrgRepo"></member-card>
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
            memberLoading: false,
            token: '',
            noMember: false,
            invalidToken: false,
            tokenSet: false
        }
    },
    computed: {
        filteredMembers () {
            let sorted = this.members.sort((a, b) => {
                return b.totalOrgRepo - a.totalOrgRepo
            })
            let topFive = sorted.slice(0, 3)
            return topFive
        }
    },
    components: {
        MemberCard
    },
    methods: {
        // getRepositories () {
        //     axios.get(this.$config.getRepos())
        //     .then(res => {
        //         this.repos = res.data
        //     })
        // },
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
            this.getMembers()
        },
        getMembers () {
            this.memberLoading = true
            this.noMember = false
            this.members = []
            this.invalidToken = false
            axios.get(this.$config.getMembers())
            .then(res => {
                this.members = res.data
                if (this.members.length > 0) {
                    this.getMemberViseRepo()
                } else {
                    this.memberLoading = false
                    this.noMember = true
                }
            }).catch(() => {
                this.memberLoading = false
                this.invalidToken = true
            })
        },
        getMemberViseRepo () {
            this.members.forEach((member, index) => {
                this.$set(member, 'totalOrgRepo', 0)
                this.getIndividualRepo(member, member.login, index)
            })
        },
        getIndividualRepo (memberObj, memberLogin, index) {
            axios.get(`https://api.github.com/users/${memberLogin}/repos?type=all`)
            .then(res => {
                this.findOrgRepo(memberObj, res.data, index)
            })
        },
        findOrgRepo (member, repos, index) {
            let filteredBy = repos.filter(repo => {
                return repo.owner.login === 'corevalue-technologies'
            })
            if (index === this.members.length - 1) {
                this.memberLoading = false
            }
            this.$set(member, 'totalOrgRepo', filteredBy.length)
        }
    }
}
</script>
