
import {lazy} from './lazyLoading'
/**
 * 拼接动态路由
 */
export default (routerList,routeHideList, sysMenuList) => {
    toRoutes(routerList,routeHideList, sysMenuList)
}
function toRoutes(routerList,routeHideList, sysMenuList) {
    if (sysMenuList) {
        for (var i = 0; i < sysMenuList.length; i++) {
            var sysMenuNode = sysMenuList[i];
            if (sysMenuNode.isMenu == 1) {
                var code=sysMenuNode.rightCode;
                var routeNode = {
                    name: sysMenuNode.name,
                    path: '/' + code,
                    meta:sysMenuNode.meta,
                    component: lazy(code),
                    children:[]
                };
                //子节点存在
                if (sysMenuNode.items && sysMenuNode.items.length > 0) {
                    toRoutes(routeNode.children,routeHideList,sysMenuNode.items);
                }
                if(code&&code!=''){
                    routerList.push(routeNode);
                }
            }
            else{
                 //子节点存在
                if (sysMenuNode.items && sysMenuNode.items.length > 0) {
                    toRoutes(routerList,routeHideList,sysMenuNode.items);
                }
            }
        }
    }
}