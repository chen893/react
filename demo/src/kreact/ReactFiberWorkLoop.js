//处理更新

import { updateClassComponent, updateFragmentComponent, updateFunctionComponent, updateHostComponent } from "./ReactFiberReconciler";
import { scheduleCallback, shouldYield } from "./scheduler";
import { isFn, isStr, isStringOrNumber, Placement, Update, updateNode } from "./util";

//根节点  wip work in progress 当前正在工作中的fiber节点
let wipRoot = null;

// 将要更新的下一个fiber节点
let nextUnitOfWork = null;
export function scheduleUpdateOnFiber(fiber) {
  fiber.alternate = {...fiber}
  wipRoot = fiber;
  wipRoot.sibling = null;
  nextUnitOfWork = wipRoot;
  scheduleCallback(workLoop);

}

function workLoop() {
//console.log('nextUnitOfWork',nextUnitOfWork)
  while (nextUnitOfWork && !shouldYield()) {
    // console.log(nextUnitOfWork)
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  // console.log(wipRoot)
  if (!nextUnitOfWork && wipRoot) {
    // console.log(wipRoot.child)
    // console.log(isFn(wipRoot))
    // commitRoot(wipRoot.child)
    isFn(wipRoot.type)? commitRoot(wipRoot): commitRoot(wipRoot.child);
  }
}

function performUnitOfWork(wip) {
  // todo  
  // 更新自己
  const { type } = wip;

  if (isStringOrNumber(type)) {
    updateHostComponent(wip);
  } else if (isFn(type)) {
  //console.log(type)
    type.prototype.isReactComponent ? updateClassComponent(wip) : updateFunctionComponent(wip);
  } else {
    // fragmentComponent
    updateFragmentComponent(wip);
  }


  // 找到下一个节点
  if (wip.child) {
    return wip.child
  }

  let next = wip;
  while (next) {
    if (next.sibling) {
      return next.sibling;
    }
    next = next.return;
  }
  return null
}

// requestIdleCallback(workLoop)

function getParentNode(fiber) {
  let next = fiber.return;
  while (!next.stateNode) {
    next = next.return;
  }
  return next.stateNode;
}
function invokeHooks(wip){
  const {updateQueueOfLayout, updateQueueOfEffect} = wip;
  for(let i = 0; i<updateQueueOfLayout.length; i++){
    const effect = updateQueueOfLayout[i];
    effect.create();
  }
  for(let i= 0; i<updateQueueOfEffect.length; i++){
    const effect = updateQueueOfEffect[i];
    scheduleCallback(()=>{
      effect.create()
    })
  }
}
function commitRoot(fiber) {
  if (!fiber) {
    return;
  }
  // 提交自己
  
  const { stateNode,type } = fiber;
  if(isFn(type)){
    invokeHooks(fiber);
  }
  let parentNode = getParentNode(fiber);

  // console.log(fiber.flags)
  if(stateNode && fiber.flags === Update){
    updateNode(stateNode,fiber.alternate.props,fiber.props)
  }else if (stateNode && fiber.flags === Placement) {
    if(parentNode.contains(stateNode)){
      parentNode.removeChild(stateNode);
    }

    let hasSiblingNode = foundSiblingNode(fiber, parentNode);
    if(hasSiblingNode){
      parentNode.insertBefore(stateNode, hasSiblingNode);
    }else {
      parentNode.appendChild(stateNode);
    }
  }
  
  // 删除旧节点
  if(fiber.deletions){
    commitDeletions(fiber.deletions, fiber.stateNode||parentNode);
  }
  
  // fiber.alternate = fiber;
  // 提交孩子
  commitRoot(fiber.child);   

  // 提交兄弟

  commitRoot(fiber.sibling);
}

function foundSiblingNode(fiber, parentNode){
  let siblingHasNode = fiber.sibling;
  let node = null;
  while(siblingHasNode){
    node = siblingHasNode.stateNode;
    if(node && parentNode.contains(node) && siblingHasNode.flags === Update){
      return node;
    }
    siblingHasNode = siblingHasNode.sibling;
  }
  return null;
}


function commitDeletions(deletions, parentNode){
    for(let i = 0; i< deletions.length; i++){
      const del = deletions[i];

      parentNode.removeChild(getStateNode(del));
    }
}
// 找到真实节点
function getStateNode(fiber){
     let tem = fiber;
     while(!tem.stateNode){
       tem = tem.child
     }
     return tem.stateNode;
}

// 协调

// 提交