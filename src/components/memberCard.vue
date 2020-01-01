<template>
    <div class="card">
        <div class="card-body">
            <div class="flex alignCenter justifySpace">
                <div class="flex alignCenter">
                    <img :src="memberImage" class="member-image marginR10">
                    <h5>{{memberName}}</h5>
                </div>
                <a :href="memberUrl" class="view">
                    View User
                </a>
            </div>
            <p class="margin0 marginT20"><b v-if="type !== 'owner'">Repo in Corevalue:</b> {{memberOrgRepo}}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'memberImage',
        'memberName',
        'memberUrl',
        'memberOrgRepo',
        'type'
    ]
}
</script>
