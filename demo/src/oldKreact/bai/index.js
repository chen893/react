// 本题为考试单行多行输入输出规范示例，无需提交，不计分。
readline();
while (line = readline()) {
  // line = '1 2 3'
  // 4-> 3   3000 ->2 或 3   检查有没有0 如果有零的话， 变成9 然后 前面-1， 如果前面为0 则继续往前减
  var lines = line.split(" ");
  var n = (lines[0])
  // 1<=n <10^18

  var arr = lines.slice(1);

  let result = find(n)

  print(result);
  function find(str="test"){
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
    function find(str="test"){
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
      return newStr;
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

  // let resultStr = '';
  // for(let i = 0; i<newStr.length; i++){
  //   let num = parseInt(newStr[i]);
  //   if(num>= 3){
  //     resultStr = resultStr+'3'
  //   }else if(num>=2){
  //     resultStr = resultStr+'2'
  //   }else {
  //     resultStr = resultStr+'1'
  //   }
  
  // } 
  // console.log(resultStr);
  // //}



  // print(a+b);
  // function findMax(str){
  //   let len = str.length;
  //   let result = '';
  //   for(let i = 0; i<len; i++){
  //     // if()
  //     let v = parseInt(str[i]);
  //     for(let j = 1; j<=3;j++){
  //       if(parseInt(v)<=)
  //     }
  //   }
  // }

  // print(max);

}