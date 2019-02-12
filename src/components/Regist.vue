<template>
    <div class="registContainer">
        <h1>hondana</h1>
        <h2>registration</h2>
        <div class="inputContainer form-group">
            <span>name</span>
            <input type="text" class="form-control" name="name" id="inName" v-model="name">
        </div>
        <div class="inputContainer form-group">
            <span>password</span>
            <input type="password" class="form-control" name="password" id="inPass" v-model="password">
        </div>
        <button class="btn btn-default" @click="onSendClick">send</button>
        <Alert ref="failAlert" content="registration fail!" />
        <Alert ref="successAlert" content="registration success!" />
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
        fail() {
            return this.$refs.failAlert;
        },
        success() {
            return this.$refs.successAlert;
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
            await this.$store.dispatch('initRegist');
            await this.$store.dispatch('execRegist', {name, password});
            const result = this.$store.getters.regist;
            console.log(result);
            if (result) {
                this.success.show();
            } else {
                this.fail.show();
            }
        }
    }
}
</script>

<style scoped>
.registContainer {
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
