<template>
    <div class="favContainer">
        <i class="material-icons border" v-show="show" @click="onClick">star_border</i>
        <i class="material-icons star" v-show="faved" @click="onClick">star</i>
    </div>
</template>
<script>
export default {
    props: ['tgt'],
    data() {
        return {
            show: false,
            faved: false,
        };
    },
    methods: {
        showFav(tgt) {
            if (tgt === this.tgt && !this.faved) {
                this.show = true;
            }
        },
        hideFav() {
            this.show = false;
        },
        onClick() {
            this.faved = !this.faved;
            this.show = !this.show;
            const tgtId = this.tgt._id;
            this.$store.dispatch('updateBookFav', {tgtId, fav: this.faved}).then(() => {
                this.$store.dispatch('fetchBooks');
            });
        }
    },
    mounted() {
        const fav = this.tgt.value.fav;
        this.faved = fav === 'true';
    },
    beforeUpdate() {
        const fav = this.tgt.value.fav;
        this.faved = fav === 'true';
    },
    updated() {
        const fav = this.tgt.value.fav;
        this.faved = fav === 'true';
    }
}
</script>
<style scoped>
.favContainer {
    position: absolute;
    top: 2px;
    right: 2px;
}
</style>
