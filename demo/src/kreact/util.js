export const NoFlags = 0b0;
export const Placement = 0b10;
export const Update = 0b100;
export const Deletion = 0b1000;

export const HookLayout = 'HookLayout';
export const HookPassive =  'HookPassive'
export function isStr(s){
  return typeof s === 'string';
}

export function isStringOrNumber(s){
  return typeof s === 'string' || typeof s==='number'
}
export function updateNode(node, prevVal,nextVal){
  Object.keys(prevVal).forEach(k=>{
    if(k==='children'){
      if(isStringOrNumber(prevVal[k])){
        node.textContent = '';
      }
    }else if(k.slice(0,2) ==='on'){
      const eventName = k.slice(2).toLocaleLowerCase();
      node.removeEventListener(eventName, prevVal[k]);
    }else{
      if(!(k in nextVal)){
        node[k] = '';
      }
    }
  })
  Object.keys(nextVal).forEach(k=>{
    if(k === 'children'){
      if(isStringOrNumber(nextVal.children) ){
        node.textContent = nextVal.children;
      }
    }else if(k.slice(0,2)=== 'on'){
      const eventName = k.slice(2).toLowerCase();
      node.addEventListener(eventName, nextVal[k])
    }else{
      node[k] = nextVal[k];
    }
  })
}

export function isFn(fn){
  return typeof fn === 'function'
}

export function areHookInputsEqual(nextDeps, prevDeps){
//console.log(nextDeps, prevDeps)
  if(prevDeps === null){
    return false;
  }
  if(prevDeps.length !== nextDeps.length) return false;
  for(let i = 0; i< prevDeps.length && i< nextDeps.length; i++){
    if(Object.is(nextDeps[i], prevDeps[i])){
      continue;
    }
    return false;
  }
  return true;
}