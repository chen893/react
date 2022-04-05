import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";
import { areHookInputsEqual, HookLayout, HookPassive } from "./util";

// 当前正在工作fiber
let currentlyRenderingFiber = null;

// 当前正在工作的Hook
let workInProgressHook = null;


export function renderHooks(fiber){
  currentlyRenderingFiber = fiber;
  currentlyRenderingFiber.memoizedState = null;
  currentlyRenderingFiber.updateQueueOfLayout = [];
  currentlyRenderingFiber.updateQueueOfEffect = [];
  workInProgressHook = null;
}

export function updateWorkInProgressHook(){
  let hook = null;

  // todo get hook
//console.log(currentlyRenderingFiber)
  let current  = currentlyRenderingFiber.alternate;
  if(current){
    //更新阶段
    // workInProgressHook = current.workInProgressHook;
    // console.log(currentlyRenderingFiber.memoizedState)
    currentlyRenderingFiber.memoizedState = current.memoizedState
    if(workInProgressHook){
     hook =  workInProgressHook = workInProgressHook.next;
    }else{
      hook = workInProgressHook = current.memoizedState;
    }
  }else{
    hook= {
      memoizedState: null,
      next: null,
    }
    // 初次渲染
    if(workInProgressHook){
    
      workInProgressHook.next = hook;
      workInProgressHook = workInProgressHook.next;
    }else{
      workInProgressHook = currentlyRenderingFiber.memoizedState = hook;
    }
  }
  return hook; 
}

export function useReducer(reducer, initalState){
  
  const hook = updateWorkInProgressHook();
  if(!currentlyRenderingFiber.alternate){
    hook.memoizedState = initalState;
  }
  const dispatch = (action)=>{
    hook.memoizedState = reducer(hook.memoizedState, action);
    // console.log(typeof currentlyRenderingFiber.type)
    scheduleUpdateOnFiber(currentlyRenderingFiber);
  }
  return [hook.memoizedState, dispatch];
}

export function useState(initial){
  const hook = updateWorkInProgressHook();
  if(!currentlyRenderingFiber.alternate){
    hook.memoizedState = initial;
  }
  function setData(val){
    hook.memoizedState= val;
    scheduleUpdateOnFiber(currentlyRenderingFiber)
  }
  return [hook.memoizedState, setData];
}

export function useEffect(create, deps){
  return updateEffectIml(HookPassive, create, deps);
  
}


export function useLayoutEffect(create, deps){
  return updateEffectIml(HookLayout,create, deps );
}



export function updateEffectIml(hookFlag, create, deps){
  const hook = updateWorkInProgressHook();
  const effect = {create, deps}
  
  if(currentlyRenderingFiber.alternate && hook){
    const prevDeps = hook.memoizedState.deps;
    if(deps){
    //console.log('deps：',deps)
      if(areHookInputsEqual(deps, prevDeps)){
        return ;
      }
    }
  }
  hook.memoizedState = effect;
  if(hookFlag === HookLayout)currentlyRenderingFiber.updateQueueOfLayout.push(effect)
  else if(hookFlag === HookPassive) currentlyRenderingFiber.updateQueueOfEffect.push(effect)
}

// function useEffect(fn, arr){ 
//   const hook = updateWorkInProgressHook();
//   if(!currentlyRenderingFiber.alternate){
//     hook.memoizedState = {
//       fn,
//       arr
//     };
//     fn();
//     currentlyRenderingFiber.alternate = currentlyRenderingFiber;
//     return ;
//   }
//   let oldEffect = currentlyRenderingFiber.alternate.memoizedState;
//   if(!arr){
//     fn();
//   }else if(arr.length !== 0){
//     let map = new Map();
//     if(oldEffect.memoizedState.arr.length !== arr.length){
//       hook.memoizedState = {
//         fn,
//         arr
//       }
//     }else{
//       for(let i = 0; i < arr.length; i++){
//         if(arr[i] !== oldEffect.memoizedState.arr[i]){
//           hook.memoizedState = {
//             fn,
//             arr
//           }
//           break;
//         }
//       }
//       fn();
//     }

//   }
// }