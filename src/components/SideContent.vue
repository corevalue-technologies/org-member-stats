<template>
    <div class="side-content">
        <div class="content" style="padding: 20px;">
            <div class="image-container marginT20">
                <img class="image" :src="$config.orgData.avatar_url">
            </div>
            <h2 class="marginT20 text-center">
                CoreValue Technologies Pvt. Ltd.
            </h2>
            <p class="text-center">This is Corevalue Technologies Github Data Visualizer</p>
            <div class="info marginT20">
                <ul class="list-group">
                    <li class="list-group-item flex alignCenter justifySpace"><b>Public Repos:</b> <p class="margin0">{{$config.orgData.public_repos}}</p></li>
                    <li class="list-group-item flex alignCenter justifySpace"><b>Email:</b> <p class="margin0">{{$config.orgData.email}}</p></li>
                    <li class="list-group-item flex alignCenter justifySpace"><b>Github Url:</b> <a :href="$config.orgData.html_url" class="margin0">{{$config.orgData.html_url}}</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    mounted () {
        this.getOrgData()
    },
    methods: {
        getOrgData () {
            axios.get(this.$config.getOrgData())
            .then(res => {
                this.$config.orgData = res.data
            })
        }
    }
}
</script>

