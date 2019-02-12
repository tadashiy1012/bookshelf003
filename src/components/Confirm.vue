<template>
    <dialog>
        <h3>confirm</h3>
        <p>{{content}}</p>
        <footer>
            <button class="btn btn-default" @click="onOkClick">ok</button>
            <button class="btn btn-default" @click="onCancelClick">cancel</button>
        </footer>
    </dialog>
</template>
<script>
export default {
    props: ['content'],
    data() {
        return {
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
            if (this.callback) this.callback();
        },
        onCancelClick() {
            this.dialog.close();
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
