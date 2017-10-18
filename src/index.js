import {isObject, extend, isString, trim,removeFromArray,isWindow} from 'changlin-util'
import {warning} from 'changlin-warning'

function check(key, fn){
    if (!isString(key) || !isFunction(fn)) throw new Error(`Parameter type error`);
}

export let Observer = function (option) {
    let self, setting = {needCache: false};
    
    if (!isObject(this)||isWindow(this)) {
        throw new Error('this is not a Object')
    }
    
    self = this;
    
    if (isObject(option)) {
        extend(setting, option)
    }
    
    let clientList = {},//监听事件列表
        cache      = {},//缓存已触发的事件
        onlyTriggerOneTime   = {};//只执行一次事件的列表
    
    extend(self, {listen, on, one, remove, trigger});
    
    return self;
    
    
    //添加监听
    function _add(list, key, fn) {
        if (!list[key]) {
            list[key] = []
        }
        
        //检查函数是否已被注册过，避免重复注册
        if (list[key].find(item => item === fn)) {
            warning(true, `${fn.name} has already been registered`);
            return
        }
        
        list[key].push(fn);
        
        //事件已被触发过，检查函数是否需要执行
        if (setting.needCache && cache[key] !== undefined) {
            try {
                fn.apply(this, cache[key]);
            } catch (e) {
                warning(true, e);
                return;
            }
            delete cache[key];
            if(list===onlyTriggerOneTime){
                delete onlyTriggerOneTime[key];
            }
        }
    }
    
    
    //事件监听
    function listen(key, fn) {
      check(key,fn);
        _add(clientList, key, fn);
    }
    
    //批量添加事件监听
    function on(key, fn) {
        check(key,fn);
        key      = trim(key);
        let keys =  key.split(/\s{1,}/g);
       keys.forEach(k=>{
           _add(clientList,k,fn)
       })
    }
    
    //one一次
    function one(key, fn) {
        check(key,fn);
        _add(onlyTriggerOneTime, key, fn);
    }
    
    
    //触发
    function trigger(key,...other) {
        if(warning(!isString(key),`Parameter type error`))return;
        
        if(onlyTriggerOneTime[key]){
            run(onlyTriggerOneTime[key],...other);
            delete onlyTriggerOneTime[key]
        }
        
        if(clientList[key]){
            run(clientList[key],...other)
        }
    
        if(!onlyTriggerOneTime[key]&&!clientList[key]&&setting.needCache){
            cache[key] = other;
        }
    }
    
    //移除
    function remove(key, fn) {
        check(key,fn);
    
        if(onlyTriggerOneTime[key]){
          removeFromArray(onlyTriggerOneTime[key],item=>item===fn);
        }
    
        if(clientList[key]){
            removeFromArray(clientList[key],item=>item===fn);
        }
        
    }
    
    function run(fns,...other){
        fns.forEach(fn=>{
            try{
                fn.call(self,...other)
            }catch(e){
                warning(true,e)
            }
        })
    }
};
