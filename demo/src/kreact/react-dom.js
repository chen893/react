import {scheduleUpdateOnFiber} from "./ReactFiberWorkLoop";

export function render(vnode, container) {
  const rootFiber = {
    type: container.nodeName.toLocaleLowerCase(),
    stateNode: container,
    props: {children: vnode},
  };

  scheduleUpdateOnFiber(rootFiber);
}


