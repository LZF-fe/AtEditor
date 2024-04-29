// 防抖
export function debounce(fn, time = 50) {
    //创建一个标记来存放定时器
    let timer = null;

    return function (...args) {
        //每当用户触发事件就把前一个定时器清除掉
        clearTimeout(timer);
        //然后再创建一个新的定时器，这样就能保证触发的间隔内不会执行函数
        timer = setTimeout(e => {
            fn.apply(e, args);
        }, time);
    };
}