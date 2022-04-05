import { createFiber } from "./fiber";
import { renderHooks } from "./hook";
import { reconcileChildren } from "./ReactChildFiber";
import { isStr, isStringOrNumber, Update, updateNode } from "./util";

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    //更新属性
    updateNode(wip.stateNode,{}, wip.props);
  }

  reconcileChildren(wip, wip.props.children)

}

export function updateFunctionComponent(wip){
//console.log('updateFunctionComponent');
  renderHooks(wip)
  
  const {type, props} =wip;
  const children = type(props);
  reconcileChildren(wip, children)
}

export function updateClassComponent(wip) {
  const {type, props} = wip;
  const children  = new type(props).render();
  reconcileChildren(wip, children)
}

export function updateFragmentComponent(wip){
//console.log(wip, wip.props)
  reconcileChildren(wip, wip.props.children)
}

