<template>
    <button class="iconButton btn btn-default" @click="onClick" :disabled="disabled || false">
        <div>
            <i class="material-icons">{{icon}}</i>
            <span>{{label}}</span>
        </div>
    </button>
</template>
<script>
export default {
    props: ['icon', 'label', 'onClick', 'disabled']
}
</script>
<style scoped>
.iconButton div {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
