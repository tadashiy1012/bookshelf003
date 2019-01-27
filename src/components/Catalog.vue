<template>
    <div>
        <div class="catalogMenu">
            <div>
                current:<span>{{current}}</span>
            </div>
            <div>
                <button v-on:click="toggleAddShow">toggle add panel</button>
                <span> </span>
                <button v-on:click="toggleRmShow">toggle remove panel</button>
            </div>
        </div>
        <div class="addPanel" v-show="addShow">
            <div>add panel</div>
            <ul>
                <template v-for="(bk, idx) in noselect">
                    <li :key="idx">
                        <button v-on:click="onAddClick(bk)">add</button>
                        {{bk.value.name}}
                    </li>
                </template>
            </ul>
        </div>
        <div class="rmPanel" v-show="rmShow">
            <div>remove panel</div>
            <ul>
                <template v-for="(bk, idx) in select">
                    <li :key="idx">
                        <button v-on:click="onRmClick(bk)">rm</button>
                        {{bk.value.name}}
                    </li>
                </template>
            </ul>
        </div>
        <div>
            <ul class="bookGrid">
                <template v-for="(bk, idx) in select">
                    <li :key="idx">
                        <router-link :to="'/preview/' + bk._id">
                            <img :src="getSrc(bk)" alt="book">
                        </router-link>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            addShow: false,
            rmShow: false
        };
    },
    computed: {
        current() {
            return this.$route.params.category || 'all';
        },
        books() {
            return this.$store.getters.books;
        },
        select() {
            const ctgr = this.$route.params.category || 'all';
            const books = this.$store.getters.books;
            const result = books.filter(e => [...e.value.category, 'all']
                .find(e2 => e2 === ctgr) !== void 0);
            return result;
        },
        noselect() {
            const ctgr = this.$route.params.category || 'all';
            const books = this.$store.getters.books;
            const result = books.filter(e => [...e.value.category, 'all']
                .find(e2 => e2 === ctgr) === void 0);
            return result;
        }
    },
    methods: {
        getSrc(tgt) {
            if (tgt === void 0 || tgt.thumb === null) return;
            return URL.createObjectURL(tgt.thumb);
        },
        toggleAddShow() {
            this.addShow = !this.addShow;
        },
        toggleRmShow() {
            this.rmShow = !this.rmShow;
        },
        onAddClick(tgt) {
            const current = this.$route.params.category || 'all';
            const ctgrs = [...tgt.value.category, current];
            this.$store.dispatch('updateBook', {
                tgtId: tgt._id, category: ctgrs
            }).then(() => {
                this.$store.dispatch('fetchBooks');
            });
        },
        onRmClick(tgt) {
            const current = this.$route.params.category || 'all';
            const ctgrs = [...tgt.value.category.filter(e => e !== current)];
            this.$store.dispatch('updateBook', {
                tgtId: tgt._id, category: ctgrs
            }).then(() => {
                this.$store.dispatch('fetchBooks');
            });
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
    grid-template-columns: repeat(2, 1fr);
    margin: 8px 0px;
}
.catalogMenu :nth-child(2) {
    text-align: right;
}
.addPanel, .rmPanel {
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
.bookGrid {
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    justify-content: space-between;
    align-content: space-between;
    margin: 8px 0px;
}
.bookGrid img {
    border: solid 1px #666;
}
</style>
