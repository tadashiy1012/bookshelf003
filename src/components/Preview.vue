<template>
    <div>
        <div class="previewMenu">
            <div>
                title:<span>{{book.value.name}}</span>
                <span> </span>
                user:<span>{{book.value.user}}</span>
            </div>
            <div>
                <button v-show="showShare" v-on:click="onTagClick(book)">tag</button>
                <span> </span>
                <button v-show="showShare" v-on:click="onShareClick(book)">share</button>
                <span> </span>
                <button v-on:click="onDownloadClick(book)">download</button>
                <span> </span>
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
        },
        showShare() {
            const id = this.$route.params.bookId;
            const book = this.$store.getters.books.find(e => e._id === id);
            if (book === void 0) return false;
            const user = this.$store.getters.login;
            const result = book.value.user === user;
            console.log(result);
            return result;
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
        },
        onDownloadClick(tgt) {
            const a = document.createElement('a');
            a.download = tgt.value.name;
            a.href = URL.createObjectURL(tgt.pdf);
            a.dataset.downloadurl = ['application/pdf', a.download, a.href].join(':');
            a.click();
        },
        onShareClick(tgt) {
            const share = prompt('Enter user names separated by commas', tgt.value.share.join(','));
            console.log(share);
            if (share === null) return; 
            const ary = share.split(',');
            console.log(ary);
            this.$store.dispatch('updateBookShare', {tgtId: tgt._id, share: ary}).then(() => {
                this.$store.dispatch('fetchBooks');
            });
        },
        onTagClick(tgt) {
            console.log(tgt);
            const text = prompt('Enter tag separated by commas', tgt.value.tag.join(','));
            console.log(text);
            if (text === null) return;
            const ary = text.split(',');
            console.log(ary);
            this.$store.dispatch('updateBookTag', {tgtId: tgt._id, tag: ary}).then(() => {
                this.$store.dispatch('fetchBooks');
            });
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
