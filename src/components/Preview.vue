<template>
    <div>
        <div class="previewMenu">
            <div class="labelContainer">
                title:<span>{{book.value.name}}</span>
                <span style="margin-left:8px;"> </span>
                user:<span>{{book.value.user}}</span>
            </div>
            <div>
                <icon-button icon="local_offer" label="tag"
                    :on-click="() => onTagClick(book)" :disabled="!showShare" />
                <icon-button icon="folder_shared" label="share" 
                    :on-click="() => onShareClick(book)" :disabled="!showShare" />
                <icon-button icon="get_app" label="download" :on-click="() => onDownloadClick(book)" />
                <icon-button icon="close" label="close" :on-click="onCloseClick" />
            </div>
        </div>
        <div class="pageMenu">
            <button class="btn" @click="onPrevClick">prev</button>
            <span class="pageNum">[{{page}}/{{numPages}}]</span>
            <button class="btn" @click="onNextClick">next</button>
        </div>
        <div class="canvasContainer">
            <canvas></canvas>
        </div>
        <prompt ref="sharePrompt" 
            :val="initShareVal"
            content="Enter user names separated by commas" />
        <prompt ref="tagPrompt"
            :val="initTagVal"
            content="Enter tag separated by commas" />
    </div>
</template>
<script>
import Prompt from './Prompt.vue';
import IconButton from './IconButton.vue';
import {getDoc} from '../util';
export default {
    data() {
        return {
            doc: null,
            page: 1,
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
            return result;
        },
        initShareVal() {
            const id = this.$route.params.bookId;
            const book = this.$store.getters.books.find(e => e._id === id);
            if (book === void 0) return '';
            else return book.value.share.join(',');
        },
        initTagVal() {
            const id = this.$route.params.bookId;
            const book = this.$store.getters.books.find(e => e._id === id);
            if (book === void 0) return '';
            else return book.value.tag.join(',');
        }
    },
    components: {
        Prompt, IconButton
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
            this.$refs.sharePrompt.show((result) => {
                console.log(result);
                const ary = result.split(',').map(e => encodeURIComponent(e));
                console.log(ary);
                this.$store.dispatch('updateBookShare', {tgtId: tgt._id, share: ary}).then(() => {
                    this.$store.dispatch('fetchBooks');
                });
            });
        },
        onTagClick(tgt) {
            this.$refs.tagPrompt.show((result) => {
                console.log(result);
                const ary = result.split(',').map(e => encodeURIComponent(e));
                console.log(ary);
                this.$store.dispatch('updateBookTag', {tgtId: tgt._id, tag: ary}).then(() => {
                    this.$store.dispatch('fetchBooks');
                });
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
    align-items: center;
    margin: 8px 0px;
}
.labelContainer {
    font-size: 16px;
}
.pageMenu {
    text-align: center;
    margin: 8px 0px;
}
.pageNum {
    font-size: 16px;
}
.canvasContainer {
    text-align: center;
}
canvas {
    border: solid 1px #666;
}
.withIconButton div {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
