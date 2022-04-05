function find(str){
  let i = 0;
  let len = str.length,  last =0;
  // for(let i )
  let newStr = '';
  for(let i = len-1;i>=0; i--){
    let char = str[i];
    if(char === '0' || (char === '1' && last ==1)){
      if(i === 0) break;
      newStr ='9'+ newStr;
      last = 1;
    }else {
      newStr = (parseInt(char)-last)+ newStr;
      last = 0;
    }
  }

  let resultStr = '';
  for(let i = 0; i<newStr.length; i++){
    let num = parseInt(newStr[i]);
    if(num>= 3){
      resultStr = resultStr+'3'
    }else if(num>=2){
      resultStr = resultStr+'2'
    }else {
      resultStr = resultStr+'1'
    }
  
  } 
  // console.log(resultStr);
  return resultStr;
}

let str = '1231230213213123'
console.log(str)
console.log(find(str))