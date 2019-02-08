import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import pdfjs from 'pdfjs-dist';
import {Home, Regist, Login, Catalog, Preview} from './components';
import store from './store';
import 'material-design-icons/iconfont/material-icons.css';
import './css/bootstrap.css';

pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.bundle.js';

Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '/', component: Home, children: [
            {path: '/', component: Catalog},
            {path: '/catalog', component: Catalog},
            {path: '/catalog/:category', component: Catalog},
            {path: '/preview/:bookId', component: Preview}
        ]},
        {path: '/home', component: Home},
        {path: '/registration', component: Regist},
        {path: '/login', component: Login}
    ]
});

const app = new Vue({
    store: new Vuex.Store(store),
    router,
    template: '<router-view />'
}).$mount('#app');

console.log(app);