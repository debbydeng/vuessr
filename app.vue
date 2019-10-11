<template>
    <div id="app" class="test">
        App.vue component

        <transition name="fade" mode="out-in">
            <keep-alive exclude="moviesDetail">
                <router-view class="view"></router-view>
            </keep-alive>
        </transition>
    </div>

</template>

<script>
    export default {
        name: "app"
    }
</script>

<style scoped>

</style>
