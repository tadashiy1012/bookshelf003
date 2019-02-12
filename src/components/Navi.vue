<template>
    <div class="naviContainer">
        <h1>hondana</h1>
        <p>
            <b>user</b>
            <br>
            {{name}}
            <br>
            <icon-button icon="exit_to_app" label="logout" :on-click="onLogoutClick" />
        </p>
        <p>
            <b>book</b>
            <br>
            <icon-button icon="publish" label="upload" :on-click="onUploadClick" />
        </p>
        <p>
            <b>category</b>
            <br>
            <icon-button icon="create" label="create" :on-click="onCreateClick" />
            <br>
            <button class="btn btn-default" style="margin-top:6px;" @click="onEditClick">edit</button>
            <br>
            <ul class="ctgrLs">
                <template v-for="(ctgr, idx) in categories">
                    <li :key="idx">
                        <router-link :to="'/catalog/' + ctgr[0]">
                            <span class="link">{{ctgr[1]}}</span>
                        </router-link>
                        <span v-show="showDel && ctgr[0] !== '' && ctgr[0] !== 'fav'">
                            <button @click="onDelClick(ctgr)">del</button>
                        </span>
                    </li>
                </template>
            </ul>
        </p>
        <prompt ref="ctgrPrompt" 
            content="Enter category name to create" />
    </div>
</template>
<script>
import Prompt from './Prompt.vue';
import IconButton from './IconButton.vue';
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
    components: {
        Prompt, IconButton
    },
    methods: {
        async onLogoutClick() {
            await this.$store.dispatch('execLogout');
            await this.$store.dispatch('initLogin');
        },
        onCreateClick() {
            this.$refs.ctgrPrompt.show((result) => {
                console.log(result);
                if (!result || result.length === 0) return;
                this.$store.dispatch('createCategory', encodeURIComponent(result)).then(() => {
                    this.$store.dispatch('fetchCategories');
                });
            });
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
        },
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
.ctgrLs .link {
    font-size: 16px;
}
</style>
