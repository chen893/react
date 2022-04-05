import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { render } from './kreact/react-dom';
import { render } from './kreact/react-dom'
import Component from './kreact/Component';
import { useEffect, useLayoutEffect, useReducer, useState } from './kreact/hook';
// console.log(Component.prototype)

class ClassComponent extends Component {
  render() {
    return <>
      <li>1</li>
      <li>2</li>
    </>

  }
}
function FunctionComponent(props) {
  return <div className='border'>
    <ClassComponent />
    <p>{props.name}</p>
    <h2>jjj</h2>

  </div>
}
// console.log(useState)

function FunctionHook(props) {
  // const [state, dispatch] = useReducer((init)=>init+1, 0);
  // const [name, setName] = useState('jjj');
  // console.log('FunctionHook')
  const [state, setState] = useState(1);
  // console.log('state',state)
  useLayoutEffect(()=> console.log('useLayoutEffect'), [state]);
  useEffect(()=>{
  //console.log('useEffect')
  }, [state])
  return <div>
    <h1>{state}</h1>
    {/* <h1>{name}</h1> */}
    {/* <h1>state+{state}</h1> */}
    <button onClick={()=> setState(state+1)}>+</button>
    <ul>
      {state%2 ===1? [1,2,3].map(item=> <li key={item}>{item}</li>):[4,3,2,1].map(item=> <li key={item}>{item}</li>)}
      {/* <li key='0'>0</li>
      <li key='1'>1</li>
      {state%2 ? <li key="2">2</li>: null}
      <li key='3'>3</li>
      <li key='4'>4</li> */}
    </ul>
    {/* {state%2 === 0 ?<div>234</div>: <span>456</span>} */}
    {/* <button onClick={()=> setName('陈双龙')} >设置姓名</button> */}
    {/* <button onClick={()=> setName('陈双龙')}>设置姓名</button> */}
  </div>
}
// render(<ClassComponent/>, document.getElementById('root'))
// render(<div><h1>hhh</h1></div>,document.getElementById('root'))
// render(<div><FunctionComponent/></div>, document.getElementById('root'))
render(<FunctionHook />, document.getElementById('root'))
// render(<FunctionComponent name={'test'} />, document.getElementById('root'))
// render(<div class="body"><span>1</span><span>2</span>3</div>, document.getElementById('root'))
// render(<><h1>hhh</h1><h1>h2</h1></>, document.getElementById('root'))
// ReactDOM.render(
//   <React.StrictMode>
//     <FunctionHook />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
