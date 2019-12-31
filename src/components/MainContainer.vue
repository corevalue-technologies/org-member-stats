<template>
    <div class="main-container flex">
        <side-content></side-content>
        <main-content></main-content>
    </div>
</template>

<script>
import SideContent from './SideContent.vue'
import MainContent from './MainContent.vue'
export default {
    components: {
        SideContent,
        MainContent
    }
}
</script>
