'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Observer = undefined;

var _changlinUtil = require('changlin-util');

var _changlinWarning = require('changlin-warning');

function check(key, fn) {
    if (!(0, _changlinUtil.isString)(key) || !isFunction(fn)) throw new Error('Parameter type error');
}

var Observer = exports.Observer = function Observer(option) {
    var self = void 0,
        setting = { needCache: false };

    if (!(0, _changlinUtil.isObject)(this) || (0, _changlinUtil.isWindow)(this)) {
        throw new Error('this is not a Object');
    }

    self = this;

    if ((0, _changlinUtil.isObject)(option)) {
        (0, _changlinUtil.extend)(setting, option);
    }

    var clientList = {},
        //监听事件列表
    cache = {},
        //缓存已触发的事件
    onlyTriggerOneTime = {}; //只执行一次事件的列表

    (0, _changlinUtil.extend)(self, { listen: listen, on: on, one: one, remove: remove, trigger: trigger });

    return self;

    //添加监听
    function _add(list, key, fn) {
        if (!list[key]) {
            list[key] = [];
        }

        //检查函数是否已被注册过，避免重复注册
        if (list[key].find(function (item) {
            return item === fn;
        })) {
            (0, _changlinWarning.warning)(true, fn.name + ' has already been registered');
            return;
        }

        list[key].push(fn);

        //事件已被触发过，检查函数是否需要执行
        if (setting.needCache && cache[key] !== undefined) {
            try {
                fn.apply(this, cache[key]);
            } catch (e) {
                (0, _changlinWarning.warning)(true, e);
                return;
            }
            delete cache[key];
            if (list === onlyTriggerOneTime) {
                delete onlyTriggerOneTime[key];
            }
        }
    }

    //事件监听
    function listen(key, fn) {
        check(key, fn);
        _add(clientList, key, fn);
    }

    //批量添加事件监听
    function on(key, fn) {
        check(key, fn);
        key = (0, _changlinUtil.trim)(key);
        var keys = key.split(/\s{1,}/g);
        keys.forEach(function (k) {
            _add(clientList, k, fn);
        });
    }

    //one一次
    function one(key, fn) {
        check(key, fn);
        _add(onlyTriggerOneTime, key, fn);
    }

    //触发
    function trigger(key) {
        if ((0, _changlinWarning.warning)(!(0, _changlinUtil.isString)(key), 'Parameter type error')) return;

        for (var _len = arguments.length, other = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            other[_key - 1] = arguments[_key];
        }

        if (onlyTriggerOneTime[key]) {
            run.apply(undefined, [onlyTriggerOneTime[key]].concat(other));
            delete onlyTriggerOneTime[key];
        }

        if (clientList[key]) {
            run.apply(undefined, [clientList[key]].concat(other));
        }

        if (!onlyTriggerOneTime[key] && !clientList[key] && setting.needCache) {
            cache[key] = other;
        }
    }

    //移除
    function remove(key, fn) {
        check(key, fn);

        if (onlyTriggerOneTime[key]) {
            (0, _changlinUtil.removeFromArray)(onlyTriggerOneTime[key], function (item) {
                return item === fn;
            });
        }

        if (clientList[key]) {
            (0, _changlinUtil.removeFromArray)(clientList[key], function (item) {
                return item === fn;
            });
        }
    }

    function run(fns) {
        for (var _len2 = arguments.length, other = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            other[_key2 - 1] = arguments[_key2];
        }

        fns.forEach(function (fn) {
            try {
                fn.call.apply(fn, [self].concat(other));
            } catch (e) {
                (0, _changlinWarning.warning)(true, e);
            }
        });
    }
};
