import Vue from "vue";
import VueRouter from "vue-router";

const Login = () =>
    import ( /*webpackChunkName: "Login_Home" */ "../views/Login.vue");
const Home = () =>
    import ( /*webpackChunkName: "Login_Home" */ "../views/Home.vue");
const Welcome = () =>
    import ("../views/home/Welcome.vue");
const User = () =>
    import ( /*webpackChunkName: "User_Product" */ "../views/baseData/User.vue");
const Product = () =>
    import ( /*webpackChunkName: "User_Product" */ "../views/baseData/Product.vue");
const Stockin = () =>
    import ( /*webpackChunkName: "Stockin_StockInDetail" */ "../views/stockin/StockIn.vue");
const StockInDetail = () =>
    import ( /*webpackChunkName: "Stockin_StockInDetail" */ "../views/stockin/StockInDetail.vue");
const Stockout = () =>
    import ("../views/stockout/StockOut.vue");
const Stockcheck = () =>
    import ("../views/stockcheck/StockCheck.vue");

Vue.use(VueRouter);

const routes = [{
        path: "/",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
        redirect: "/welcome",
        children: [
            { path: "/welcome", name: "Welcome", component: Welcome },
            { path: "/user/getAll", name: "User", component: User },
            { path: "/product/getAll", name: "Product", component: Product },
            { path: "/stockin/list", name: "Stockin", component: Stockin },
            {
                path: "/stockin/detail/:id",
                name: "StockInDetail",
                component: StockInDetail,
            },
            { path: "/stockout/list", name: "Stockout", component: Stockout },
            { path: "/stockcheck/list", name: "Stockcheck", component: Stockcheck },
        ],
    },
];

const router = new VueRouter({
    routes,
});
// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === "/login") return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem("token");
    if (!tokenStr) return next("/login");
    next();
});

export default router;