<template>
    <div>
        <div class="catalogMenu">
            <div>
                current:<span>{{current}}</span>
            </div>
            <div>
                <icon-button icon="local_offer" label="toggle tag" :on-click="toggleTagShow" />
                <icon-button icon="add_circle" label="toggle add" :on-click="toggleAddShow" />
                <icon-button icon="remove_circle" label="toggle remove" :on-click="toggleRmShow" />
                <icon-button icon="delete" label="toggle delete" :on-click="toggleDelShow" />
            </div>
        </div>
        <div class="addPanel" v-show="addShow">
            <div class="withIconLabel">
                <i class="material-icons">add_circle</i>
                <span>add panel</span>
            </div>
            <ul>
                <template v-for="(bk, idx) in noselect">
                    <li :key="idx">
                        <button @click="onAddClick(bk)">add</button>
                        <span class="captionContainer">{{bk.value.name}}</span>
                    </li>
                </template>
            </ul>
        </div>
        <div class="tagPanel" v-show="tagShow">
            <div class="withIconLabel">
                <i class="material-icons">local_offer</i>
                <span>tag panel</span>
            </div>
            <ul>
                <template v-for="(tag, idx) in tags">
                    <li :key="idx">
                        <a href="#" @click="(ev) => {
                            ev.preventDefault();
                            onTagLabelClick(tag);    
                        }">{{tag}}</a>
                    </li>
                </template>
            </ul>
        </div>
        <div class="searchPanel">
            <i class="material-icons">search</i>
            <span>search:</span>
            <input type="text" v-model="search">
        </div>
        <div>
            <ul class="bookGrid">
                <template v-for="(bk, idx) in select">
                    <li :key="idx">
                        <router-link :to="'/preview/' + bk._id">
                            <div class="thumbImgContainer"><img :src="getSrc(bk)" alt="book"></div>
                        </router-link>
                        <div class="buttonContainer" v-show="rmShow">
                            <button @click="onRmClick(bk)"><div>
                                <i class="material-icons">remove_circle</i>
                                <span>remove</span>
                            </div></button>
                        </div>
                        <div class="buttonContainer" v-show="delShow">
                            <button @click="onDelClick(bk)" :disabled="user !== bk.value.user"><div>
                                <i class="material-icons">delete</i>
                                <span>delete</span>
                            </div></button>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
        <confirm ref="deleteConfirm" content="Do you really want to delete this?" />
    </div>
</template>
<script>
import Confirm from './Confirm.vue';
import IconButton from './IconButton.vue';
export default {
    data() {
        return {
            addShow: false,
            rmShow: false,
            delShow: false,
            tagShow: true,
            search: ''
        };
    },
    computed: {
        current() {
            const categories = this.$store.getters.categories;
            const param = this.$route.params.category || '';
            const result = (categories.find(e => e[0] === param) || ['', ''])[1];
            return result;
        },
        books() {
            return this.$store.getters.books;
        },
        select() {
            const ctgr = this.$route.params.category || '';
            const books = this.$store.getters.books;
            const result = books.filter(e => [...e.value.category, '']
                .find(e2 => e2 === ctgr) !== void 0);
            if (this.search.charAt(0) !== ':') {
                return result.filter(e => e.value.name.indexOf(this.search) !== -1);
            } else {
                const tgt = this.search.substr(1, this.search.length);
                return result.filter(e => e.value.tag.find(ee => ee === tgt) !== void 0);
            }
        },
        noselect() {
            const ctgr = this.$route.params.category || '';
            const books = this.$store.getters.books;
            const result = books.filter(e => [...e.value.category, '']
                .find(e2 => e2 === ctgr) === void 0);
            return result;
        },
        tags() {
            const ctgr = this.$route.params.category || '';
            const books = this.$store.getters.books;
            const result = books.filter(e => [...e.value.category, '']
                .find(e2 => e2 === ctgr) !== void 0);
            return [...new Set(result.map(e => e.value.tag).flat())];
        },
        user() {
            return this.$store.getters.login;
        }
    },
    components: {
        Confirm, IconButton
    },
    methods: {
        getSrc(tgt) {
            if (tgt === void 0 || tgt.thumb === null) return;
            return URL.createObjectURL(tgt.thumb);
        },
        toggleTagShow() {
            this.tagShow = !this.tagShow;
        },
        toggleAddShow() {
            this.addShow = !this.addShow;
        },
        toggleRmShow() {
            this.rmShow = !this.rmShow;
        },
        toggleDelShow() {
            this.delShow = !this.delShow;
        },
        onAddClick(tgt) {
            const current = this.$route.params.category;
            if (current === void 0) return;
            const ctgrs = [...tgt.value.category, current];
            this.$store.dispatch('updateBook', {
                tgtId: tgt._id, category: ctgrs
            }).then(() => {
                this.$store.dispatch('fetchBooks');
            });
        },
        onRmClick(tgt) {
            const current = this.$route.params.category;
            if (current === void 0) return;
            const ctgrs = [...tgt.value.category.filter(e => e !== current)];
            this.$store.dispatch('updateBook', {
                tgtId: tgt._id, category: ctgrs
            }).then(() => {
                this.$store.dispatch('fetchBooks');
            });
        },
        onDelClick(tgt) {
            this.$refs.deleteConfirm.show(() => {
                this.$store.dispatch('deleteBook', tgt._id).then(() => {
                    this.$store.dispatch('fetchBooks');
                });
            });
        },
        onTagLabelClick(tgt) {
            this.search = ':' + tgt;
        }
    },
    mounted() {
        this.$store.dispatch('fetchBooks');
    },
    beforeUpdate() {
        const subject = this.select.filter(e => e.thumb === null);
        if (subject.length === 0) return;
        const ids = subject.map(e => e._id);
        const tasks = ids.map(e => new Promise((resolve, reject) => {
            this.$store.dispatch('fetchBkThumb', e).then(() => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        }));
        Promise.all(tasks).then((resp) => {
            console.log(resp);
        });
    }
}
</script>
<style scoped>
.catalogMenu {
    display: grid;
    grid-template-columns: 300px 1fr;
    margin: 8px 0px;
}
.catalogMenu :nth-child(2) {
    text-align: right;
}
.addPanel, .rmPanel, .tagPanel {
    border: dashed 1px #666;
    margin-bottom: 6px;
    padding: 8px;
}
.addPanel ul, .rmPanel ul {
    margin: 0px;
    padding-left: 30px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
.tagPanel ul {
    display: flex;
    flex-direction: row;
    margin: 0px;
    padding: 0px;
}
.tagPanel li {
    margin-left: 34px;
}
.searchPanel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 12px auto;
}
.searchPanel input {
    width: 400px;
}
.bookGrid {
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    justify-content: space-between;
    align-content: space-between;
    row-gap: 14px;
    margin: 8px 0px;
}
.bookGrid li {
    position: relative;
}
.bookGrid .thumbImgContainer {
    justify-self: center;
    text-align: center;
}
.bookGrid img {
    border: solid 1px #666;
}
.buttonContainer {
    text-align: center;
}
.buttonContainer button div {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.withIconLabel {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.withIconLabel span {
    margin-left: 4px;
}
</style>
