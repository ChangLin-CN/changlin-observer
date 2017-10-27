'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Observer = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _changlinUtil = require('changlin-util');

var _changlinWarning = require('changlin-warning');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//默认方法名
var methodsName = {
    listen: 'listen',
    on: 'on',
    one: 'one',
    remove: 'remove',
    trigger: 'trigger'
};

var Observer = exports.Observer = function Observer(option) {
    var _extend;

    var self = void 0,
        setting = {
        needCache: false,
        methodsReplace: undefined
    };

    if (!(0, _changlinUtil.isObject)(this) || (0, _changlinUtil.isWindow)(this)) {
        throw new Error('this is not a Object');
    }

    self = this;

    if ((0, _changlinUtil.isObject)(option)) {
        (0, _changlinUtil.extend)(setting, option);
    }

    var mName = {},
        //方法名
    clientList = {},
        //监听事件列表
    cache = {},
        //缓存已触发的事件
    onlyTriggerOneTime = {}; //只执行一次事件的列表


    if ((0, _changlinUtil.isObject)(setting.methodsReplace)) {
        mName = (0, _changlinUtil.extend)((0, _changlinUtil.extend)({}, methodsName), setting.methodsReplace);
    } else {
        mName = methodsName;
    }

    (0, _changlinUtil.extend)(self, (_extend = {}, (0, _defineProperty3.default)(_extend, mName.listen, function (key, fn) {
        _check(key, fn);
        _add({ list: clientList, key: key, fn: fn, cache: cache, setting: setting, onlyTriggerOneTime: onlyTriggerOneTime });
    }), (0, _defineProperty3.default)(_extend, mName.on, function (key, fn) {
        _on({ key: key, fn: fn, clientList: clientList, cache: cache, setting: setting, onlyTriggerOneTime: onlyTriggerOneTime });
    }), (0, _defineProperty3.default)(_extend, mName.one, function (key, fn) {
        _check(key, fn);
        _add({ list: onlyTriggerOneTime, key: key, fn: fn, cache: cache, setting: setting, onlyTriggerOneTime: onlyTriggerOneTime });
    }), (0, _defineProperty3.default)(_extend, mName.remove, function (key, fn) {
        _remove({ key: key, fn: fn, onlyTriggerOneTime: onlyTriggerOneTime, clientList: clientList });
    }), (0, _defineProperty3.default)(_extend, mName.trigger, function (key) {
        for (var _len = arguments.length, other = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            other[_key - 1] = arguments[_key];
        }

        _trigger({ key: key, other: other, onlyTriggerOneTime: onlyTriggerOneTime, clientList: clientList, setting: setting, cache: cache, self: self });
    }), _extend));

    return self;
};

function _remove(_ref) {
    var key = _ref.key,
        fn = _ref.fn,
        onlyTriggerOneTime = _ref.onlyTriggerOneTime,
        clientList = _ref.clientList;

    _check(key, fn);

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

function _trigger(_ref2) {
    var key = _ref2.key,
        other = _ref2.other,
        onlyTriggerOneTime = _ref2.onlyTriggerOneTime,
        clientList = _ref2.clientList,
        setting = _ref2.setting,
        cache = _ref2.cache,
        self = _ref2.self;

    if ((0, _changlinWarning.warning)(!(0, _changlinUtil.isString)(key), 'Parameter type error')) return;

    if (onlyTriggerOneTime[key]) {
        _run.apply(undefined, [self, onlyTriggerOneTime[key]].concat((0, _toConsumableArray3.default)(other)));
        delete onlyTriggerOneTime[key];
    }

    if (clientList[key]) {
        _run.apply(undefined, [self, clientList[key]].concat((0, _toConsumableArray3.default)(other)));
    }

    if (!onlyTriggerOneTime[key] && !clientList[key] && setting.needCache) {
        cache[key] = other;
    }
}

function _on(_ref3) {
    var key = _ref3.key,
        fn = _ref3.fn,
        clientList = _ref3.clientList,
        cache = _ref3.cache,
        setting = _ref3.setting,
        onlyTriggerOneTime = _ref3.onlyTriggerOneTime;

    _check(key, fn);
    key = (0, _changlinUtil.trim)(key);
    var keys = key.split(/\s+/);
    keys.forEach(function (k) {
        _add({ list: clientList, key: k, fn: fn, cache: cache, setting: setting, onlyTriggerOneTime: onlyTriggerOneTime });
    });
}

//添加监听
function _add(_ref4) {
    var list = _ref4.list,
        key = _ref4.key,
        fn = _ref4.fn,
        cache = _ref4.cache,
        setting = _ref4.setting,
        onlyTriggerOneTime = _ref4.onlyTriggerOneTime;

    if (!list[key]) {
        list[key] = [];
    }

    //检查函数是否已被注册过，避免重复注册
    if ((0, _changlinUtil.find)(list[key], function (item) {
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
//执行回调
function _run(self, fns) {
    for (var _len2 = arguments.length, other = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        other[_key2 - 2] = arguments[_key2];
    }

    fns.forEach(function (fn) {
        try {
            fn.call.apply(fn, [self].concat(other));
        } catch (e) {
            (0, _changlinWarning.warning)(true, e);
        }
    });
}
//参数检查
function _check(key, fn) {
    if (!(0, _changlinUtil.isString)(key) || !(0, _changlinUtil.isFunction)(fn)) throw new Error('Parameter type error');
}
