<template>
    <div class="loginContainer">
        <h1>hondana</h1>
        <h2>login</h2>
        <div v-show="login">
            <div class="inputContainer form-group">
                <span>name</span>
                <input type="text" class="form-control" name="name" id="inName" v-model="name">
            </div>
            <div class="inputContainer form-group">
                <span>password</span>
                <input type="password" class="form-control" name="password" id="inPass" v-model="password">
            </div>
            <button class="btn" @click="onSendClick">login</button>
        </div>
        <div v-show="logged">
            <p>logged</p>
            <p><router-link to="/">home</router-link></p>
        </div>
        <Alert ref="failAlert" content="login fail!" />
    </div>
</template>
<script>
import Alert from './Alert.vue';
export default {
    data() {
        return {
            name: '',
            password: ''
        };
    },
    computed: {
        login() {
            return this.$store.getters.login === null;
        },
        logged() {
            return this.$store.getters.login !== null;
        },
        fail() {
            return this.$refs.failAlert;
        }
    },
    components: {
        Alert
    },
    methods: {
        async onSendClick() {
            const name = encodeURIComponent(this.name);
            const password = encodeURIComponent(this.password);
            if (name.length === 0 || password.length === 0) {
                this.fail.show();
                return;
            }
            await this.$store.dispatch('execLogin', {name, password});
            const result = this.$store.getters.login;
            console.log(result);
            if (result !== null) {
                this.$router.push('/');
            } else {
                this.fail.show();
            }
        }
    },
    async mounted() {
        await this.$store.dispatch('initLogin');
        console.log(this.$store.getters.login);
    }
}
</script>
<style scoped>
.loginContainer {
    text-align: center;
    width: 400px;
    margin: 0px auto;
}
h1 {
    letter-spacing: 6px;
}
.inputContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 6px;
    margin-right: 40px;
}
.inputContainer span {
    display:block;
    width: 90px;
    text-align: right;
}
.inputContainer input {
    margin-left: 8px;
}
</style>

