import ConvertRoutes from './convertRoutes'
import router from '../../router.js'

/**
 * 动态添加路由
 */
let addRoutes = {
    state: {
        rootRoute: [],
        routeParam: []//这里必须持久化参数,重新生成路由,因为里边的require方法没法持久化
    },
    mutations: {
        add_Routes(state, routeParam) {
            let routeList = [];
            let routeHideList = [];
            ConvertRoutes(routeList, routeHideList, routeParam);
            var rootRoute = [{
                path: '/home',
                component:() => import('@/views/Home.vue'),
                children: routeList
            }];
            //保存路由参数到store中
            state.routeParam = routeParam;
            state.rootRoute = rootRoute;
            //动态添加路由
            router.addRoutes(rootRoute);
            console.log('输出路由:', JSON.stringify(rootRoute));
        },
        add_Routes_Fresh(state) {
            this.commit('add_Routes', state.routeParam)
        }
    },
    actions: {
        add_Routes({ commit }, routeParam) {
            commit('add_Routes', routeParam)
        },
        add_Routes_Fresh({ commit }) {
            commit('add_Routes_Fresh')
        }
    }
}

export default addRoutes;
















