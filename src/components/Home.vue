<template>
    <div>
        <div class="homeContainer" v-show="login">
            <h1>hondana</h1>
            <p><router-link to="/login">login</router-link></p>
            <p><router-link to="/registration">registration</router-link></p>
        </div>
        <div class="loggedHomeContainer" v-show="logged">
            <div class="innerContainer">
                <div class="left">
                    <Navi />
                </div>
                <div class="right">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Navi from './Navi.vue';
export default {
    components: {
        Navi
    },
    computed: {
        login() {
            return this.$store.getters.login === null;
        },
        logged() {
            return this.$store.getters.login !== null;
        }
    },
    mounted() {
        this.$store.dispatch('initLogin');
    }
}
</script>
<style scoped>
.homeContainer {
    text-align: center;
}
.homeContainer h1 {
    letter-spacing: 6px;
}
.loggedHomeContainer {
    width: 90%;
    margin: 0px auto;
}
.innerContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.left {
    width: 220px;
}
.right {
    width: 100%;
}
</style>
