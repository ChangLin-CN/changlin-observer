import {isObject, extend, isString, trim,removeFromArray,isWindow,isFunction} from 'changlin-util'
import {warning} from 'changlin-warning'

//默认方法名
const methodsName={
    listen:'listen',
    on:'on',
    one:'one',
    remove:'remove',
    trigger:'trigger'
};

export let Observer = function (option) {
    let self, setting = {
        needCache: false,
        methodsReplace:undefined
    };
    
    if (!isObject(this)||isWindow(this)) {
        throw new Error('this is not a Object')
    }
    
    self = this;
    
    if (isObject(option)) {
        extend(setting, option)
    }
    
    let mName={},//方法名
        clientList = {},//监听事件列表
        cache      = {},//缓存已触发的事件
        onlyTriggerOneTime   = {};//只执行一次事件的列表
    
    
    
    if(isObject(setting.methodsReplace)){
        mName=extend(extend({},methodsName),setting.methodsReplace)
    }else{
        mName=methodsName;
    }
    
    extend(self, {
        [mName.listen]:  function (key, fn) {
            _check(key,fn);
            _add({list:clientList, key, fn,cache,setting,onlyTriggerOneTime});
        },
        [mName.on]:function(key,fn){
            _on({key,fn,clientList,cache,setting,onlyTriggerOneTime})
        },
        [mName.one]:  function (key, fn) {
            _check(key,fn);
            _add({list:onlyTriggerOneTime, key, fn,cache,setting,onlyTriggerOneTime});
        },
        [mName.remove]:function(key,fn){
            _remove({key, fn,onlyTriggerOneTime,clientList})
        },
        [mName.trigger]:function(key,...other){
            _trigger({key,other,onlyTriggerOneTime,clientList,setting,cache,self})
        }
    });
    
    return self;
};


function _remove({key, fn,onlyTriggerOneTime,clientList}) {
    _check(key,fn);
    
    if(onlyTriggerOneTime[key]){
        removeFromArray(onlyTriggerOneTime[key],item=>item===fn);
    }
    
    if(clientList[key]){
        removeFromArray(clientList[key],item=>item===fn);
    }
    
}

function _trigger({key,other,onlyTriggerOneTime,clientList,setting,cache,self}) {
    if(warning(!isString(key),`Parameter type error`))return;
    
    if(onlyTriggerOneTime[key]){
        _run(self,onlyTriggerOneTime[key],...other);
        delete onlyTriggerOneTime[key]
    }
    
    if(clientList[key]){
        _run(self,clientList[key],...other)
    }
    
    if(!onlyTriggerOneTime[key]&&!clientList[key]&&setting.needCache){
        cache[key] = other;
    }
}

function _on({key, fn,clientList,cache,setting,onlyTriggerOneTime}) {
    _check(key,fn);
    key      = trim(key);
    let keys =  key.split(/\s+/);
    keys.forEach(k=>{
        _add({list:clientList,key:k,fn,cache,setting,onlyTriggerOneTime})
    })
}

//添加监听
function _add({list, key, fn,cache,setting,onlyTriggerOneTime}) {
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
//执行回调
function _run(self,fns,...other){
    fns.forEach(fn=>{
        try{
            fn.call(self,...other)
        }catch(e){
            warning(true,e)
        }
    })
}
//参数检查
function _check(key, fn){
    if (!isString(key) || !isFunction(fn)) throw new Error(`Parameter type error`);
}
