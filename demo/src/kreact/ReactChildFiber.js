import { createFiber } from "./fiber";
import { Deletion, isStringOrNumber, Placement, Update } from "./util";

export function deleteChild(returnFiber, childToDelete) {
  childToDelete.flags = Deletion;
  if (returnFiber.deletions) {
    returnFiber.deletions.push(childToDelete);
  }
  else {
    returnFiber.deletions = [childToDelete];
  }
}
export function reconcileChildren(returnFiber, children) {
  if (isStringOrNumber(children)) {
    // returnFiber.stateNode.appendChild(document.createTextNode(children))
    return;
  }

  const newChildren = Array.isArray(children) ? children : [children];

  let previousNewFiber = null;
  let oldFiber = returnFiber.alternate && returnFiber.alternate.child;

  let lastPlacedIndex = 0;
  // *1找第一个能复用的节点，并往后，只要相对位置没有发生变化，就继续往后复用，否则跳出这个循环

  const shouldTrackSideEffects = !!(returnFiber.alternate)
  let newIndex = 0;
  let nextOldFiber = null;
  // 1 2 3
  // 4 3 2 1
  for(;oldFiber && newIndex < newChildren.length; newIndex++){
    const newChild = newChildren[newIndex];
    if(newChild === null){
      continue;
    }
    // console.log(oldFiber.index)
    if(oldFiber.index> newIndex){
      nextOldFiber = oldFiber;
      oldFiber = null;
    }else{
      nextOldFiber = oldFiber.sibling;
    }
    // console.log(newChild, oldFiber);
    const same = sameNode(newChild, oldFiber);
    console.log(same)
    if(!same){
      if(oldFiber === null){
        oldFiber = nextOldFiber;
      }
      break;
    }

    const newFiber = createFiber(newChild, returnFiber);
    Object.assign(newFiber, {
      alternate: oldFiber,
      stateNode: oldFiber.stateNode,
      flags: Update
    } )

    lastPlacedIndex = placeChild(
      newFiber, 
      lastPlacedIndex,
      newIndex,
      shouldTrackSideEffects,
    );
    if(previousNewFiber === null){
      returnFiber.child = newFiber;
    }else{
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    oldFiber = nextOldFiber;
  }


  //* 2 newChildren 只有2个节点，已经遍历完了
  // 1 2 3 4 5
  // 1 2
  if(newChildren.length<=newIndex){
      deleteRemainingChildren(returnFiber, oldFiber);
      return ;
  }
  

  //* 3 oldFiber 没了，但是newChildren还有
  if (!oldFiber) {
    for (; newIndex < newChildren.length; newIndex++) {
      const newChild = newChildren[newIndex];
      if (!newChild) return;
      const newFiber = createFiber(newChild, returnFiber);

      const same = sameNode(oldFiber, newFiber);
      // if (returnFiber.type) console.log(returnFiber, same, oldFiber, newFiber)
      if (same) {
        //更新
        Object.assign(newFiber, { alternate: oldFiber, stateNode: oldFiber.stateNode, flags: Update })
      }
      if (!same && oldFiber) {
        deleteChild(returnFiber, oldFiber)
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIndex,shouldTrackSideEffects )
       
      if (previousNewFiber === null) {
        returnFiber.child = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return;
  } 


  //* 4
  // old 1 2 3 4
  // new 1 5 3 8
  console.log('\n\n', newIndex, newChildren.length)
  const existingChildren = mapRemainingChild(oldFiber);
  for(;newIndex< newChildren.length; newIndex++){

    const newChild = newChildren[newIndex];
    if(newChild === null){
      continue;
    }

    const newFiber = createFiber(newChild, returnFiber);

    let matchedFiber = existingChildren.get(newFiber.key || newFiber.index);
    if(matchedFiber){
      newFiber.alternate = matchedFiber;
      existingChildren.delete(newFiber.key || newFiber.index);
      Object.assign(newFiber, {
        alternate: matchedFiber,
        stateNode: matchedFiber.stateNode,
        flags: Update
      })
    }
    // console.log('first')
    lastPlacedIndex = placeChild(
      newFiber,
      lastPlacedIndex,
      newIndex,
      shouldTrackSideEffects
    );
  //console.log(lastPlacedIndex, newIndex, newChildren.length)
    
    if(previousNewFiber === null){
      returnFiber.child = newFiber;
    }else{
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    console.log(newFiber.props.children, newFiber.flags === Update? 'update': 'placement')
  }

  if(shouldTrackSideEffects){
    existingChildren.forEach((child)=> deleteChild(returnFiber, child));
  }
    //旧 1 2 3
    //新 4 3 2 1
  
    /*
    oldIndex = 0
    lastIndex = 0
    不存在，4 placement
    
    lastIndex = 0 oldIndex = 2
    lastIndex = 2
    可以直接update

    lastIndex = 2 oldIndex = 1
    placement

    */


  // if(!oldFiber){
  //   returnFiber.alternate = returnFiber
  // }
}

/*
  1 2 3
  3 2
  1 标记为 删除
  oldIndex= 1, newIndex = 1
  oldIndex = 2, newIndex =0;


*/

function deleteRemainingChildren(returnFiber, currentFirstChild){
  let childToDelete = currentFirstChild;
  while(childToDelete){
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
  return ;
}
function mapRemainingChild(currentFirstChild){
  const existingChildren = new Map();
  let existingChild = currentFirstChild;
  while(existingChild){
    existingChildren.set(existingChild.key || existingChild.index, existingChild);
    existingChild = existingChild.sibling;
  }
  return existingChildren;
}
/**
 * 
 * @param {*} newFiber 
 * @param {*} lastPlacedIndex 
 * @param {*} newIndex 
 * @param {boolean } shouldTrackSideEffects 初次渲染（false）还是更新（true） 
 */
function placeChild(newFiber, lastPlacedIndex, newIndex, shouldTrackSideEffects){
  newFiber.index= newIndex;
  if(!shouldTrackSideEffects){
    return lastPlacedIndex;
  }
  const current = newFiber.alternate;
  // console.log('current',current)
  if(current){
    const oldIndex = current.index;
    console.log(oldIndex, lastPlacedIndex, newIndex)
    if(oldIndex< lastPlacedIndex){
      newFiber.flags = Placement;
      return lastPlacedIndex;
    }else {
      newFiber.flags = Update;
      return oldIndex;
    }
  }else{
    newFiber.flags = Placement;
    return lastPlacedIndex;
  }
}


//同一个节点，调用前提同一层级下
function sameNode(a, b) {
  return !!(a && b && a.type === b.type && a.key === b.key)
}