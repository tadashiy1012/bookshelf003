<template>
    <dialog>
        <h3>input</h3>
        <p>{{content}}</p>
        <p><input type="text" class="form-control" v-model="value"></p>
        <footer>
            <button class="btn" @click="onOkClick">ok</button>
            <button class="btn" @click="onCancelClick">cancel</button>
        </footer>
    </dialog>
</template>
<script>
export default {
    props: ['content', 'val'],
    data() {
        return {
            value: this.val,
            callback: null
        };
    },
    computed: {
        dialog() {
            return this.$el;
        }
    },
    methods: {
        show(callback) {
            this.callback = callback || null;
            this.dialog.showModal();
        },
        onOkClick() {
            this.dialog.close();
            if (this.callback) this.callback(this.value);
        },
        onCancelClick() {
            this.dialog.close();
        }
    },
    watch: {
        val(val) {
            this.value = val;
        }
    }
}
</script>
<style scoped>
dialog {
    width: 300px;
    border: 0;
    box-shadow: 0px 0px 10px black;
    text-align: center;
}
dialog h3 {
    margin: 4px auto;
}
</style>
