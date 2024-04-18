import React, { useState, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import Tribute from "tributejs";
import './index.less';
import { message } from 'antd';

//拿到后台数据，构造格式回显
//如果回显有其他要求，自己写回显格式要求是一定要有<span contenteditable="false" class="tagItem">xxx</span>&nbsp;
const _replaceNormalToHtml = (text, trigger = '@') => {
  const regex = new RegExp(`${trigger}([^${trigger}]+)${trigger}`, 'g');
  const replacedText = text.replace(regex, `<span contenteditable="false" class="tagItem">${trigger}\$1</span>&nbsp;`);
  return replacedText;
};

/**
 * 获取正常的字符串，没经过任何包装
 * @param {*} htmlString html字符串
 * @returns 
 */
const getNormalString = (htmlString) => {
  // 去掉&nbsp;
  htmlString = htmlString.replace(/&nbsp;/g, '')

  const regex = /<span[^>]*>(.*?)<\/span>/g;
  // 使用 replace 方法替换匹配到的内容
  const replacedString = htmlString.replace(regex, (match, p1) => {
    return p1;
  });
  // 返回替换后的字符串
  return replacedString;
}

const defaultList = [{
  key: "1",
  label: "张三",
},
{
  key: "2",
  label: "李四",
}]

/**
 * 
 * @param {React.RefObject} refInstance 组件ref
 * @param {Array} atList: 下拉框的选项
 * @param {String} trigger: 关键字
 * @param {String} placeholder 占位符
 * @param {String} id id
 * @param {String} className 样式类名
 * @param {Object} style 样式style
 * @param {Object} showCount 是否显示输入框字符长度、最大长度、是否显示message提示
 * @param {Function} onInput 输入框变化时的回调
 * @param {Function} replaceNormalToHtml 普通字符串替换成html字符串，一般用于回显
 * @returns 
 */
const AtRichText = ({
  refInstance,
  atList = defaultList,
  trigger = '@',
  placeholder = '请输入',
  id = 'atId',
  className = '',
  style = {},
  showCount = {},
  onInput,
  replaceNormalToHtml = _replaceNormalToHtml
}) => {
  //增量拿showCount的属性
  const {show, max, showMessage} = {
    show: false,
    max: 100,
    showMessage: true,
    ...showCount
  }
  useImperativeHandle(refInstance, () => {
    return {
      getNormalData, //得到输入框显示的字符串，没经过任何包装
      getHtmlData, //得到html字符串
      setDataFromNormal, //把后台拿到的普通字符串赋到输入框，用于回显
      setDataFromHtml, //把html字符串直接值赋到输入框，用于回显
      resetData, //重置输入框
    }
  }, []);
  const [atInstance, setAtInstance] = useState(null) //存输入框的示例，用于添加销毁
  const [count, setCount] = useState(0) //字符长度
  const [nowHtmlData, setNowHtmlData] = useState('') //存当前html字符串，当超过最大长度时拿上一次的内容替换成目前的内容

  useEffect(() => {
    if (atList.length) {
      renderEditor(atList);
    }
  }, [atList])

  /**
   * 初始化输入框
   * @param {*} _atList 下拉选项
   */
  const renderEditor = (_atList) => {
    atInstance && atInstance.detach(document.getElementById(id));
    const tribute = new Tribute({
      // allowSpaces: true,//是否允许在提及中间使用空格
      // requireLeadingSpace: false,//指定触发器字符串之前是否需要空格
      noMatchTemplate: function () { return null; },
      collection: [
        {
          trigger,
          selectTemplate: function(item) {
            getInputLength()//防止有时候选取时监听不到onInput
            if (this.range.isContentEditable(this.current.element)) {
              return (
                `<span contenteditable='false' class='tagItem'>${trigger}${item.original.label}</span>`
              );
            }
            return `${trigger}` + item.original.label;
          },
          values: _atList,
          menuItemTemplate: function (item) {
            return item.original.label;
          },
        },
      ]
    });
    tribute.attach(document.getElementById(id));
    setAtInstance(tribute);
  }

  const getInputLength = () => {
    setTimeout(() => {
      inputChangeHandle()
    })
  }

  /**
   * 监听数据实时变化，用于显示实时长度
   */
  const inputChangeHandle = () => {
    if (show) {
      const normalData = getNormalData()
      const htmlData = getHtmlData()
      let length = normalData.length
      if (length > max) {
        setDataFromHtml(nowHtmlData)
        showMessage && message.warning(`字符超过最大值${max}`, 2)
        return
      }
      setCount(length)
      setNowHtmlData(htmlData)
    }
  }

  /**
   * 得到html字符串
   * @returns 
   */
  const getHtmlData = () => {
    const htmlData = document.getElementById(id).innerHTML;
    return htmlData
  }

  /**
   * 得到输入框显示的字符串，没经过任何包装
   * @returns 
   */
  const getNormalData = () => {
    const htmlData = document.getElementById(id).innerHTML;
    const data = getNormalString(htmlData);
    return data
  }

  /**
   * 把后台拿到的普通字符串赋到输入框，用于回显
   * @param {*} data 目标值
   */
  const setDataFromNormal = (data) => {
    document.getElementById(id).innerHTML = replaceNormalToHtml(data, trigger)
    getInputLength()
  }

  /**
   * 把html字符串直接值赋到输入框，用于回显
   * @param {*} data 目标值
   */
  const setDataFromHtml = (data) => {
    document.getElementById(id).innerHTML = data
    getInputLength()
  }

  /**
   * 重置输入框
   */
  const resetData = () => {
    document.getElementById(id).innerHTML = ''
  }
  
  return (
    <div className={`atRichText ${className}`} style={style}>
      <div
        id={id}
        className="tributeInput"
        placeholder={placeholder}
        onInput={(e) => {inputChangeHandle();onInput && onInput(e)}}
      ></div>
      {show ? <span className='tributeCount'>{count}/{max}</span> : null}
    </div>
  )
}

export default memo(forwardRef(
  (props, ref) => <AtRichText {...props} refInstance={ref} />
))
