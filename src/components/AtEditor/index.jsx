/**
* @description 带关键词标签的输入框
*/
import React, { useState, forwardRef, useImperativeHandle, memo, useRef } from 'react';
import { message } from 'antd';
import DataList from './DataList'
import './index.less';

// 拿到后台数据，构造格式回显
// 如果回显有其他要求，自己写回显格式要求是一定要有<span contentEditable="false" class="tag-item">xxx</span>&nbsp
const _replaceNormalToHtml = (text = '', trigger = '@') => {
    const regex = new RegExp(`${trigger}([^${trigger}]+)${trigger}`, 'g');
    const replacedText = text.replace(regex, `<span contentEditable="false" class="tag-item">${trigger}\$1</span>&nbsp;`);
    return replacedText;
};

/**
 * 获取正常的字符串，没经过任何包装
 * @param {*} htmlString html字符串
 * @returns 
 */
const getNormalString = (htmlString = '') => {
    // 去掉&nbsp
    htmlString = htmlString.replace(/&nbsp;/g, '');

    // 使用 replace 方法替换匹配到的内容
    const regex = /<span[^>]*>(.*?)<\/span>/g;
    const replacedString = htmlString.replace(regex, (match, p1) => {
        return p1;
    });

    // 返回替换后的字符串
    return replacedString;
}

const defaultList = [
    {
        label: "小李1",
        value: "小李1",
    },
    {
        label: "小李2",
        value: "小李2",
    },
];

/**
 * 
 * @param {React.RefObject} refInstance 组件ref
 * @param {Array} atList: 下拉框的选项
 * @param {String} trigger: 关键字
 * @param {String} placeholder 占位符
 * @param {String} className 样式类名
 * @param {Object} style 样式style
 * @param {Object} showCount 是否显示输入框字符长度、最大长度、是否显示message提示
 * @param {Function} onInput 输入框变化时的回调
 * @param {Function} replaceNormalToHtml 自定义构造回显格式，普通字符串替换成html字符串
 * @returns 
 */
const AtEditor = ({
    refInstance,
    atList = defaultList,
    trigger = '@',
    placeholder = '请输入',
    className = '',
    style = {},
    showCount = {},
    onInput,
    replaceNormalToHtml = _replaceNormalToHtml
}) => {
    const {show: isShowCountLength = false, max = 100, showMessage = true} = showCount;
    useImperativeHandle(refInstance, () => {
        return {
            getNormalData, // 得到输入框显示的字符串，没经过任何包装
            getHtmlData, // 得到html字符串
            setDataFromNormal, // 把后台拿到的普通字符串赋到输入框，用于回显
            setDataFromHtml, // 把html字符串直接值赋到输入框，用于回显
            resetData, // 重置输入框
        }
    }, []);
    const [count, setCount] = useState(0); // 字符长度
    const [nowHtmlData, setNowHtmlData] = useState(''); // 记录最新的html结构，当超过最大字符限制时使用
    const [selectionIndex, setSelectionIndex] = useState(0); // 记录区域光标的位置
    const [dom, setDom] = useState({}); // 当前编辑的文档节点
    const [domIndex, setDomIndex] = useState(0); // 当前编辑的文档节点的下标
    const editor = useRef(null);
    const dataListRef = useRef(null);

    /**
     * 输入框oninput
     * @param {*} e 
     */
    const inputChangeHandle = (e) => {
        if (e.nativeEvent.data === trigger) {
            saveIndex();
            dataListRef.current.show();
        } else {
            dataListRef.current.close();
        }
        getCountLength();
    }

    /**
     * 获取输入框字符长度
     * @returns 
     */
    const getCountLength = () => {
        if (isShowCountLength) {
            const normalData = getNormalData();
            const htmlData = getHtmlData();
            let length = normalData.length;
            if (length > max) {
                setDataFromHtml(nowHtmlData);
                showMessage && message.warning(`字符超过最大值${max}`, 2);
                return
            }
            setCount(length);
            setNowHtmlData(htmlData);
        }
    }

    const saveIndex = () => {
        const selection = getSelection();
        setSelectionIndex(selection.anchorOffset);
        const nodeList = editor.current.childNodes;

        // 保存当前编辑的dom节点
        for (const [index, value] of nodeList.entries()) {
            if (selection.containsNode(value, true)) {
                setDom(value);
                setDomIndex(index);
            }
        }
    }

    const addData = (row) => {
        const text = document.createDocumentFragment();
        const html = dom.textContent;

        // 左边的节点
        const textLeft = document.createTextNode(html.substring(0, selectionIndex - 1) + '');

        // 这里如果textLeft是个空的文本节点，会导致@用户无法删除，这里添加一个判断，如果是空，则插入一个空的span节点
        text.appendChild(textLeft.textContent ? textLeft : document.createElement('span'));

        // 加入@人的节点
        text.appendChild(createAtDom(row));

        // 选中目标后，在后面新增空格
        text.appendChild(document.createTextNode('\u00A0'));

        // 右边的节点
        const textRight = document.createTextNode(html.substring(selectionIndex, html.length));
        textRight.textContent && text.appendChild(textRight);
        editor.current.insertBefore(text, dom);
        editor.current.removeChild(dom);

        const selection = getSelection();
        selection.removeAllRanges();
        const range = new Range();

        // 添加了数据之后的聚焦
        const index = domIndex + 3;
        editor.current.click();
        range.setStart(editor.current, index);
        range.setEnd(editor.current, index);
        selection.addRange(range);

        getCountLength();
    }

    const createAtDom = (row) => {
        const dom = document.createElement('span');
        dom.classList.add('tag-item');
        dom.setAttribute('contentEditable', 'false');
        dom.setAttribute('data-id', row.value);
        dom.innerHTML = `${trigger}${row.label}`;
        return dom
    }

    /**
     * 失去焦点
     */
    const changeBlur = () => {
        setTimeout(() => {
            dataListRef.current && dataListRef.current.close()
        }, 200)
    }

    /**
     * 得到输入框显示的字符串，没经过任何包装
     * @returns 
     */
    const getNormalData = () => {
        const htmlData = editor.current?.innerHTML;
        const data = getNormalString(htmlData);
        return data
    }

    /**
     * 得到html字符串
     * @returns 
     */
    const getHtmlData = () => {
        const htmlData = editor.current?.innerHTML;
        return htmlData
    }

    /**
     * 把后台拿到的普通字符串赋到输入框，用于回显
     * @param {*} data 目标值
     */
    const setDataFromNormal = (data) => {
        const dom = editor.current
        if (dom) {
            dom.innerHTML = replaceNormalToHtml(data, trigger);
            getCountLength();
        }
    }

    /**
     * 把html字符串直接值赋到输入框，用于回显
     * @param {*} data 目标值
     */
    const setDataFromHtml = (data) => {
        editor.current.innerHTML = data;
        getCountLength();
    }

    /**
     * 重置输入框
     */
    const resetData = () => {
        editor.current.innerHTML = '';
    }

    /**
     * 获取输入框距离视口的left，用于计算下拉框的显示位置
     * @returns 
     */
    const getEditorLeft = () => {
        const {left = 0} = editor.current.getBoundingClientRect()
        return left
    }

    return (
        <div className={`at-editor-text ${className}`} style={style}>
            <div
                ref={editor}
                className="editor-input"
                placeholder={placeholder}
                contentEditable="true"
                onInput={(e) => {inputChangeHandle(e);onInput && onInput(e)}}
                onBlur={changeBlur}
            />
            {
                isShowCountLength ?
                <span className="editor-count">
                    {count}/{max}
                </span>
                :
                null
            }

            <DataList
                ref={dataListRef}
                getEditorLeft={getEditorLeft}
                atList={atList}
                addData={addData}
            />
        </div>
    )
}

export default memo(forwardRef(
    (props, ref) => <AtEditor {...props} refInstance={ref} />
))
