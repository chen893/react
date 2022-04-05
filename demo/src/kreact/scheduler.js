const taskQueue = [];

const timerQueue = [];

// 过期时间

let deadline = 0;
const threshold = 5000;

/**
 * 
 * @param {function} callback
 * 接受一个workLoop
 * 添加到taskQueue
 * 
 * flushWork
 * 执行任务
 */
// export function scheduleT(callback){
//   deadline = getCurrentTime() + threshold;
//   // 如果被多次触发呢，
//   while(getCurrentTime<=deadline && callback){
//     callback();
//   }
// }


export function scheduleCallback(callback) {
  const newTask = { callback }
  // console.log(newTask)
  taskQueue.push(newTask);
  schedule(flushWork)
}
export function schedule(callback){
  timerQueue.push(callback);
  postMessage()
}

// 执行任务
export function flushWork(){
  // 当前调度的截止时间。 callback 为 workLoop,
  deadline = getCurrentTime() +threshold;
  let currentTask = taskQueue[0];
  while(currentTask && !shouldYield()){
    const {callback} = currentTask;
    callback();
    taskQueue.shift();
    currentTask = taskQueue[0];
  }
}

const postMessage = ()=>{
  const {port1, port2}  = new MessageChannel();
  port1.onmessage = ()=>{
    // 把 timerQueue里的任务执行，并且清空timerQueue,避免下一轮再执行timerQueue;
    let tem = timerQueue.splice(0, timerQueue.length);
    tem.forEach((c)=>{
      c();
    })
  }
  port2.postMessage(null)
}




// deadline 为 进入任务时的 getCurrentTime() + threshold(间隔时间)
export function shouldYield() {
  return getCurrentTime() >= deadline;
}

export function getCurrentTime() {
  return performance.now();
}