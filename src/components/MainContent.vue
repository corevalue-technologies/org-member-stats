<template>
    <div class="main-content">
        <div class="header padding20">
            <h4>
                {{$config.orgData.description}}
            </h4>
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
            memberLoading: true
        }
    },
    mounted () {
        this.getMembers()
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
        getMembers () {
            axios.get(this.$config.getMembers())
            .then(res => {
                this.members = res.data
                this.getMemberViseRepo()
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
