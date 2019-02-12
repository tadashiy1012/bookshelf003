<template>
    <dialog>
        <h3>message</h3>
        <p>{{content}}</p>
        <footer>
            <button class="btn btn-default" @click="onOkClick">ok</button>
        </footer>
    </dialog>
</template>
<script>
export default {
    props: ['content'],
    computed: {
        dialog() {
            return this.$el;
        }
    },
    methods: {
        show() {
            this.dialog.showModal();
        },
        onOkClick() {
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
}
dialog h3 {
    margin: 4px auto;
}
</style>
