/**
 * Created by pie on 2016/11/12.
 */
import {createStore} from 'redux';
import toApp from './reducers';

let store = createStore(toApp);


import { addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters } from './actions'
// 打印初始状态
console.log(store.getState())

// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
)

// 发起一系列 action
store.dispatch(addTodo('pie1'))
store.dispatch(addTodo('pie2'))
store.dispatch(addTodo('pie3'))
store.dispatch(addTodo('pie4'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))

// 停止监听 state 更新
unsubscribe();