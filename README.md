# changlin-observer
事件监听   /  event listening


[![language](https://img.shields.io/badge/language-javascript-orange.svg)](https://github.com/ChangLin-CN/changlin-observer.git)        [![npm version](https://img.shields.io/npm/v/changlin-observer.svg)](https://www.npmjs.com/package/changlin-observer)

### 安装
```javascript
npm i changlin-observer --save
//或者
npm install changlin-observer --save
```

### 使用
```javascript
//例1
import {Observer} from "changlin-observer"
let observer=new Observer({
    needCache:true//是否需要缓存已触发但是未被监听的事件，默认为false
});
let result;
observer.trigger('event','a','b','c');
observer.listen('event',function(a,b,c){
     result=b
 });
result//=>'b'
```

```javascript
//例2
let Observer=require('changlin-observer').Observer;
function Person(){
   Observer.call(this);
   this.age=18;
   this.height=180;
}

let person=new Person();
let that,a1,a2,a3,count=0;
 person.listen('e',function(a,b,c){
     that=this;
     a1=a;a2=b;a3=c;
 });
 person.trigger('e',11,22,33);
 that//
 a1//=>11
 a2//=>22
 a3//=>33

```

```javascript
//例3
import {Observer} from "changlin-observer"
class Person {
  constructor(x, y) {
   Observer.call(this)
  }
}
}
let person=new Person();
let that,a1,a2,a3,count=0;
 person.listen('e',function(a,b,c){
     that=this;
     a1=a;a2=b;a3=c;
 });
 person.trigger('e',11,22,33);
 that//
 a1//=>11
 a2//=>22
 a3//=>33

```
### 实例方法
| 方法 | 描述 |
| --- | --- |
| listen | 事件监听 |
| on | 事件监听,可批量监听，用空格分割 ,例如：on('start move',function(){}) |
| one | 事件监听，回调函数执行一次后会被移除 |
| remove | 移除事件监听函数(只支持单个移除) |
| listen | 触发事件 |
