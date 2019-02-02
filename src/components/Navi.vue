<template>
    <div class="naviContainer">
        <h1>hondana</h1>
        <p>
            <b>user</b>
            <br>
            {{name}}
            <br>
            <button v-on:click="onLogoutClick">logout</button>
        </p>
        <p>
            <b>book</b>
            <br>
            <button v-on:click="onUploadClick">upload</button>
        </p>
        <p>
            <b>category</b>
            <br>
            <button v-on:click="onCreateClick">create</button>
            <br>
            <button v-on:click="onEditClick">edit</button>
            <br>
            <ul class="ctgrLs">
                <template v-for="(ctgr, idx) in categories">
                    <li :key="idx">
                        <router-link :to="'/catalog/' + ctgr[0]">
                            {{ctgr[1]}}
                        </router-link>
                        <span v-show="showDel">
                            <button v-on:click="onDelClick(ctgr)">del</button>
                        </span>
                    </li>
                </template>
            </ul>
        </p>
    </div>
</template>
<script>
export default {
    data() {
        return {
            showDel: false
        };
    },
    computed: {
        name() {
            return this.$store.getters.login;
        },
        categories() {
            return this.$store.getters.categories;
        }
    },
    methods: {
        async onLogoutClick() {
            await this.$store.dispatch('execLogout');
            await this.$store.dispatch('initLogin');
        },
        async onCreateClick() {
            const text = prompt();
            console.log(text);
            if (text === null || text.length === 0) return;
            await this.$store.dispatch('createCategory', text);
            await this.$store.dispatch('fetchCategories');
        },
        onUploadClick() {
            const infile = document.createElement('input');
            infile.setAttribute('type', 'file');
            infile.setAttribute('name', 'pdf');
            infile.setAttribute('accept', '.pdf');
            infile.addEventListener('change', async (ev) => {
                const file = infile.files[0];
                await this.$store.dispatch('uploadBook', file);
                await this.$store.dispatch('fetchBooks');
            });
            infile.click();
        },
        onEditClick() {
            this.showDel = !this.showDel;
        },
        onDelClick(tgt) {
            this.$store.dispatch('deleteCategory', tgt[0]).then(() => {
                this.$store.dispatch('fetchCategories');
            });
        }
    },
    mounted() {
        this.$store.dispatch('fetchCategories');
    }
}
</script>
<style scoped>
.naviContainer h1 {
    margin: 0px;
}
.ctgrLs {
    margin: 6px 0px;
    padding: 0px;
    list-style-type: none;
}
</style>
