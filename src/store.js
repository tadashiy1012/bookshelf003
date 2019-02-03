import {getDoc, makeThumbnail} from './util';

const state = {
    regist: false,
    login: null,
    categories: [],
    books: []
};

const getters = {
    regist: state => state.regist,
    login: state => state.login,
    categories: state => state.categories,
    books: state => state.books
};

const mutations = {
    setRegist(state, payload) {
        state.regist = payload;
    },
    setLogin(state, payload) {
        state.login = payload;
    },
    setCategories(state, payload) {
        state.categories = payload;
    },
    setBooks(state, payload) {
        state.books = payload;
    },
    setThumb(state, {tgtId, thumb}) {
        const tgt = state.books.find(e => e._id === tgtId);
        if (tgt === void 0) return;
        tgt.thumb = thumb;
    },
    setPdf(state, {tgtId, pdf}) {
        const tgt = state.books.find(e => e._id === tgtId);
        if (tgt === void 0) return;
        tgt.pdf = pdf;
    }
};

const actions = {
    initRegist({commit}) {
        commit('setRegist', false);
    },
    async initLogin({commit}) {
        try {
            const resp = await fetch('/login_state');
            const text = await resp.text();
            console.log(resp);
            console.log(text);
            if (text === null || text === void 0 || text.length === 0) {
                commit('setLogin', null);
            } else {
                commit('setLogin', text);
            }
        } catch (err) {
            console.log(err);
            commit('setLogin', null);
        }
    },
    async execRegist({commit}, {name, password}) {
        const fd = new FormData();
        fd.append('name', name);
        fd.append('password', password);
        const opt = {
            method: 'POST',
            body: fd
        };
        try {
            const resp = await fetch('/create_account', opt);
            const text = await resp.text();
            console.log(resp);
            console.log(text);
            if (text === 'ok') {
                commit('setRegist', true);
            } else {
                commit('setRegist', false);
            }
        } catch (err) {
            console.log(err);
            commit('setRegist', false);
        }
    },
    async execLogin({commit}, {name, password}) {
        const fd = new FormData();
        fd.append('name', name);
        fd.append('password', password);
        const opt = {
            method: 'POST',
            body: fd
        };
        try {
            const resp = await fetch('/login', opt);
            const text = await resp.text();
            console.log(resp);
            console.log(text);
            if (text === 'ok') {
                commit('setLogin', name);
            } else {
                commit('setLogin', null);
            }
        } catch (err) {
            console.log(err);
            commit('setLogin', null);
        }
    },
    async execLogout({commit}) {
        const opt = {method: 'POST'};
        try {
            const resp = await fetch('/logout', opt);
            console.log(resp);
            commit('setLogin', null);
        } catch (err) {
            console.log(err);
            commit('setLogin', null);
        }
    },
    async createCategory({}, category) {
        try {
            const fd = new FormData();
            fd.append('category', category);
            const opt = {method: 'POST', body: fd};
            const resp = await fetch('/create_ctgr', opt);
            const text = await resp.text();
            console.log(resp);
            console.log(text);
        } catch (err) {
            console.log(err);
        }
    },
    async fetchCategories({commit}) {
        try {
            const resp = await fetch('/categories');
            const json = await resp.json();
            console.log(resp);
            console.log(json);
            if (json.result !== 'ng') {
                commit('setCategories', [
                    ['', 'all'],
                    ...json.result.map(e => [e._id, e.value.name])
                ]);
            }   
        } catch (err) {
            console.log(err);
        }
    },
    async uploadBook({}, pdf) {
        try {
            const doc = await getDoc(pdf);
            const thumb = await makeThumbnail(doc);
            const fd = new FormData();
            fd.append('pdf', pdf);
            fd.append('thumb', thumb);
            const opt = {method: 'POST', body: fd};
            const resp = await fetch('/upload_book', opt);
            const text = await resp.text();
            console.log(resp);
            console.log(text);
        } catch (err) {
            console.log(err);
        }
    },
    async fetchBooks({commit}) {
        try {
            const resp = await fetch('/books');
            const json = await resp.json();
            const resp2 = await fetch('/books_share');
            const json2 = await resp2.json();
            console.log(resp, resp2);
            console.log(json, json2);
            if (json.result !== 'ng' && json2.result !== 'ng') {
                commit('setBooks', 
                    [...json.result, ...json2.result].map(e => Object.assign({}, e, {
                        thumb: null, pdf: null
                    }))
                );
            }
        } catch (err) {
            console.log(err);
        }
    },
    async fetchBkThumb({commit}, tgtId) {
        try {
            const resp = await fetch('/thumbnail?tgtId=' + tgtId);
            const blob = await resp.blob();
            console.log(resp);
            console.log(blob);
            commit('setThumb', {tgtId, thumb: blob});
        } catch (err) {
            console.log(err);
        }
    },
    async fetchPdf({commit}, tgtId) {
        try {
            const resp = await fetch('/pdf?tgtId=' + tgtId);
            const blob = await resp.blob();
            console.log(resp);
            console.log(blob);
            commit('setPdf', {tgtId, pdf: blob});
        } catch (err) {
            console.log(err);
        }
    },
    async updateBook({}, {tgtId, category}) {
        const fd = new FormData();
        fd.append('tgtId', tgtId);
        fd.append('category', JSON.stringify(category));
        const opt = {method: 'POST', body: fd};
        const resp = await fetch('/update_book_ctgr', opt);
        console.log(resp);
    },
    async updateBookShare({}, {tgtId, share}) {
        const fd = new FormData();
        fd.append('tgtId', tgtId);
        fd.append('share', JSON.stringify(share));
        const opt = {method: 'POST', body: fd};
        const resp = await fetch('/update_book_share', opt);
        console.log(resp);
    },
    async deleteBook({}, tgtId) {
        const fd = new FormData();
        fd.append('tgtId', tgtId);
        const opt = {method: 'POST', body: fd};
        const resp = await fetch('/delete_book', opt);
        console.log(resp);
    },
    async deleteCategory({}, tgtId) {
        const fd = new FormData();
        fd.append('tgtId', tgtId);
        const opt = {method: 'POST', body: fd};
        const resp = await fetch('/delete_category', opt);
        console.log(resp);
    }
};

export default {
    state, getters, mutations, actions
};