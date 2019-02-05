<template>
    <div class="loginContainer">
        <h1>hondana</h1>
        <h2>login</h2>
        <div v-show="login">
            <div class="inputContainer">
                <span>name</span>
                <input type="text" name="name" id="inName" v-model="name">
            </div>
            <div class="inputContainer">
                <span>password</span>
                <input type="password" name="password" id="inPass" v-model="password">
            </div>
            <button @click="onSendClick">login</button>
        </div>
        <div v-show="logged">
            <p>logged</p>
            <p><router-link to="/">home</router-link></p>
        </div>
    </div>
</template>
<script>
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
        }
    },
    methods: {
        async onSendClick() {
            const name = encodeURIComponent(this.name);
            const password = encodeURIComponent(this.password);
            if (name.length === 0 || password.length === 0) {
                alert('login fail!');
                return;
            }
            await this.$store.dispatch('execLogin', {name, password});
            const result = this.$store.getters.login;
            console.log(result);
            if (result !== null) {
                alert('login success!');
                this.$router.push('/');
            } else {
                alert('login fail!');
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
}
h1 {
    letter-spacing: 6px;
}
.inputContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
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

