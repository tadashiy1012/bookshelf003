<template>
    <div>
        <div class="previewMenu">
            <div>title:<span>{{book.value.name}}</span></div>
            <div>
                <button v-on:click="onCloseClick">close</button>
            </div>
        </div>
        <div class="pageMenu">
            <button v-on:click="onPrevClick">prev</button>
            <span>[{{page}}/{{numPages}}]</span>
            <button v-on:click="onNextClick">next</button>
        </div>
        <div class="canvasContainer">
            <canvas></canvas>
        </div>
    </div>
</template>
<script>
import {getDoc} from '../util';
export default {
    data() {
        return {
            doc: null,
            page: 1
        };
    },
    computed: {
        book() {
            const id = this.$route.params.bookId;
            const book = this.$store.getters.books.find(e => e._id === id);
            return book || {value:{name:null}};
        },
        numPages: function() {
            if (this.doc === null) return 0;
            else return this.doc.numPages;
        }
    },
    methods: {
        onPrevClick() {
            if (this.page > 1) {
                this.page = this.page - 1;
            }
        },
        onNextClick() {
            if (this.page < this.doc.numPages) {
                this.page = this.page + 1;
            }
        },
        onCloseClick() {
            this.$router.go(-1);
        }
    },
    mounted() {
        this.$store.dispatch('fetchBooks');
        this.canvas = this.$el.querySelector('canvas');
        this.ctx = this.$el.querySelector('canvas').getContext('2d');
    },
    async beforeUpdate() {
        if (this.doc !== null) return;
        const id = this.$route.params.bookId;
        await this.$store.dispatch('fetchPdf', id);
        const book = this.$store.getters.books.find(e => e._id === id);
        this.doc = await getDoc(book.pdf);
    },
    async updated() {
        if (this.doc === null) return;
        const page = await this.doc.getPage(this.page);
        const viewport = page.getViewport(0.9);
        this.canvas.height = viewport.height;
        this.canvas.width = viewport.width;
        await page.render({canvasContext: this.ctx, viewport});
    }
}
</script>
<style scoped>
.previewMenu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 8px 0px;
}
.pageMenu {
    text-align: center;
    margin: 8px 0px;
}
.canvasContainer {
    text-align: center;
}
canvas {
    border: solid 1px #666;
}
</style>
