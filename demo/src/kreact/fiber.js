import { Placement } from "./util";

// memoizedState class 中指的是state的值，如果是函数组件指的是第0个hook
/**
 * 
 * @param {*} vnode 
 * @param {*} returnFiber 
 * @returns 
 */
export function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    stateNode: null,  // 原生标签指节点，类组件的时候指的是实例
    child: null,  //第一个子节点
    sibling: null, // 下一个兄弟节点
    return: returnFiber,
    memoizedState: null,
    flags: Placement,
    alternate: null,
    deletions: null, // 要删除子节点null 或 []
    index: null,  // 当前层级下的下标，从0开始

  }
  return fiber;
}