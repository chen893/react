import { createElement } from "react";

const UPDATE = 'UPDATE', DELETE="DELETE", PLACEMENT ="PLACEMENT"
// 当前的根节点
let currentRoot = null

// container 是 
export function render(vnode, container) {
  wipRoot = {
    stateNode: container,
    props: { children: vnode },
    type: 'div'
  };
  nextUnitOfWork = wipRoot;


}

function createNode(workInProgress) {
  let node = null;

  const { type, props } = workInProgress;
  if (typeof type === 'string') {
    node = document.createElement(type);
  } else if (typeof type === 'symbol') {
    node = workInProgress.return;
  }

  updateNode(node,{}, props);
  return node;
}


function updateHostComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress)
  }

  if (workInProgress?.props?.children)
    reconcileChildren(workInProgress, workInProgress.props.children);
}


// 类组件处理
function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress;
  wipFiber = workInProgress;
  wipFiber.hooks = [];
  wipFiber.hookIndex = 0;
  const vvnode = type(props);
  reconcileChildren(workInProgress, vvnode);
}


//类组件渲染
function updateClassComponent(workInProgress) {
  const { type, props } = workInProgress;
  const children = new type(props).render();
  reconcileChildren(workInProgress, children)

}

// Fragment渲染
function updateFragment(workInProgress) {
  // console.log('这里会进来吗', workInProgress)
  // if (!workInProgress.stateNode) {
  //   workInProgress.stateNode = createNode(workInProgress);
  // }
  const { props } = workInProgress;
  const { children } = props;
  // console.log(children)
  if (typeof children === 'object') {
    reconcileChildren(workInProgress, children);
    // console.log('object', workInProgress.child, workInProgress.return)
  }else {

  }
}


// vnode->node，插入node里
function reconcileChildren(workInProgress, children) {

  if (workInProgress.props && typeof children === 'string') {
    return;
  }
  let newChildren = Array.isArray(children) ? children : [children];

  let oldFiber = workInProgress.base && workInProgress.base.child;
  
  let previousNewFiber = null;
  for (let index = 0; index < newChildren.length; index++) {
    const child = newChildren[index];
    
    const same = child && oldFiber && child.type=== oldFiber.type;

    let newFiber = null;
    newFiber = null;
    if(same){
      newFiber = {
        child: null,
        return: workInProgress,
        props: child?.props,
        sibling: null,
        stateNode: oldFiber.stateNode,
        type: child?.type,
        base: oldFiber,
        effectTag:UPDATE
      }
    }
    if(!same && child){
      newFiber = {
        child: null,
        return: workInProgress,
        props: child?.props,
        sibling: null,
        stateNode: null,
        type: child?.type,
        base: null,
        effectTag:PLACEMENT
      }
    }
    

    // 删除节点

    if(oldFiber){
      oldFiber = oldFiber.sibling;
    }


    // if (typeof child === 'string') {
    //   newFiber = {
    //     child: null,
    //     return: workInProgress,
    //     props: { children: child },
    //     sibling: null,
    //     stateNode: null,
    //     type: Symbol('frag')
    //   }
    // }
    // console.log('newFiber',{...newFiber}, children)
    if (index === 0) {
    //console.log(0, workInProgress.child, newFiber)
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
//console.log('这里',workInProgress)
}


// 更新属性
function updateNode(node, nextVal) {
  if (nextVal && node)
    Object.keys(nextVal).forEach(k => {
      // console.log(k)
      if (k === 'children') {
        if (typeof nextVal.children === 'string' || typeof nextVal.children === 'number') {
          const textNode = document.createTextNode(nextVal.children);
          ////console.log(textNode)
          node.appendChild(textNode);
        }
      }else if(k.slice(0,2)=== 'on' ){
        // 源码当中事件是合成事件，利用了事件委托，react17之前是把事件添加到document上，react17是添加到container 上
        let eventName = k.slice(2).toLowerCase();
        node.addEventListener(eventName, nextVal[k])
      } else node[k] = nextVal[k]
    })
}




// fiber 结构
// child 第一个子节点
// sibling 下一个兄弟
// return 爸爸
// stateNode dom节点
// base 上一次的fiber

// 下一个fiber任务
let nextUnitOfWork = null;


// 当前

// wip workInProgress 正在进行当中的数据结构fiber root
let wipRoot = null;

function performUnitOfWork(workInProgress) {
  // * step1 :执行当前fiber
  // console.log('test', workInProgress)
  if (!workInProgress) return;

  if (typeof workInProgress.type === 'string')
    updateHostComponent(workInProgress);
  else if (typeof workInProgress.type === 'function') {

    workInProgress.type.prototype.isReactComponent ? updateClassComponent(workInProgress) : updateFunctionComponent(workInProgress)
  } else if (typeof workInProgress.type === 'symbol') {
    updateFragment(workInProgress);
  }

  // 原则：下面找子节点
  if (workInProgress.child) {
    return workInProgress.child;
  }

  let nextFiber = workInProgress;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  
  }
  return nextFiber;

}

// workLoop()
function workLoop(IdleDeadline) {
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    // 执行当前fiber， 返回下一个fiber
    // console.log('nextUnitOfWork', nextUnitOfWork)
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (!nextUnitOfWork && wipRoot) {
  //console.log('end', wipRoot.stateNode)

    commitRoot()

  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWorker(wipRoot.child);
  currentRoot = wipFiber; 
//console.log('end', wipRoot.stateNode)
  wipRoot = null;
}

function commitWorker(workInProgress) {
  // console.log(workInProgress)
  if (!workInProgress) return;

//console.log('workInProgress', workInProgress)
  // step1: commit workInProgress
  let  parentNodeFiber = workInProgress.return;
  while (!parentNodeFiber.stateNode) {
  //console.log(parentNodeFiber.return.stateNode, parentNodeFiber)
    parentNodeFiber = parentNodeFiber.return;
  }
  let parentNode = parentNodeFiber.stateNode;
  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  //console.log('zheli', parentNode, workInProgress.stateNode)
  }

  // step2: commit workInProgress.child
  commitWorker(workInProgress.child);

  // step3: commit workInProgress.sibling
  commitWorker(workInProgress.sibling)
}
requestIdleCallback(workLoop)


let wipFiber = null;
// hooks:{state, queue}
//state 存储状态
//queue 存批量处理

export function useState(init){
  const oldHook = wipFiber.base && wipFiber.base.hooks[wipFiber.hookIndex] ;
  const hook = oldHook? {
    state: oldHook.state,
    queue: oldHook.queue
  }: {state: init, queue: []}

  hook.queue.forEach(action=> {
    hook.state = action;
  })
  const setState = (value)=>{
    // if(typeof value === 'function'){
    //   hook.queue.push(value())
    // }
    hook.queue.push(value);
    // currentRoot.stateNode
    wipRoot = {
      stateNode: currentRoot.stateNode,
      props: currentRoot.props,
    }
    nextUnitOfWork = wipRoot;
  };
  wipFiber.hooks.push(hook);
  wipFiber.hookIndex++; 
  return [hook.state, setState]
}