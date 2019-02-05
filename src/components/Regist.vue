<template>
    <div class="registContainer">
        <h1>hondana</h1>
        <h2>registration</h2>
        <div class="inputContainer">
            <span>name</span>
            <input type="text" name="name" id="inName" v-model="name">
        </div>
        <div class="inputContainer">
            <span>password</span>
            <input type="password" name="password" id="inPass" v-model="password">
        </div>
        <button @click="onSendClick">send</button>
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
    methods: {
        async onSendClick() {
            const name = encodeURIComponent(this.name);
            const password = encodeURIComponent(this.password);
            if (name.length === 0 || password.length === 0) {
                alert('registration fail!');
                return;
            }
            await this.$store.dispatch('initRegist');
            await this.$store.dispatch('execRegist', {name, password});
            const result = this.$store.getters.regist;
            console.log(result);
            if (result) {
                alert('registration success!');
                this.$router.push('/');
            } else {
                alert('registration fail!');
            }
        }
    }
}
</script>

<style scoped>
.registContainer {
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
