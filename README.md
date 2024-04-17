# atRichText
 
react组件，文本输入关键词弹出列表，选中变成标签，删除一块删除，例如微信输入框艾特@


GitHub地址：[https://github.com/LZF-fe/atRichText](https://github.com/LZF-fe/atRichText)

npm地址：[https://www.npmjs.com/package/atrichtext](https://www.npmjs.com/package/atrichtext)
 
## 安装和使用
 
要安装和使用这个项目，你需要按照以下步骤操作：

直接  
`npm i atrichtext`  

或者：
 
1. 克隆或下载项目代码。
2. 在终端中进入项目目录。
3. 运行 `npm install` 来安装依赖项。
4. 运行 `npm run dev` 来启动项目。
5. node示例版本18.12.0
 

 ## 效果示例

 ![alt text](<ReadmeImg/mnggiflab-video-to-gif.gif>)

 ## 使用示例
 ```
 const defaultList = [{
  key: "1",
  label: "小明",
},
{
  key: "2",
  label: "小李",
}]

function App() {
  const atRef = useRef(null)

  return (
    <div>
      <AtRichText
        ref={atRef}
        id='atId'
        trigger='@'
        style={{width: '400px'}}
        atList={defaultList}
      >
      </AtRichText>
    </div>
  )
}
```
## 参数说明
 ```
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
  showCount,
  onInput,
  replaceNormalToHtml = _replaceNormalToHtml
}) => {

}
  ```


## 其他说明
### forwardRef+useImperativeHandle向外抛出了这五个方法用于获取和设置输入框的值
### 父组件使用：atRef.current.getHtmlData()、atRef.current.setDataFromHtml(xxx)

```
export default memo(forwardRef(
  (props, ref) => <AtRichText {...props} refInstance={ref} />
))
```

```
useImperativeHandle(refInstance, () => {
  return {
    getNormalData, //得到输入框显示的字符串，没经过任何包装
    getHtmlData, //得到html字符串
    setDataFromNormal, //把后台拿到的普通字符串赋到输入框，用于回显
    setDataFromHtml, //把html字符串直接值赋到输入框，用于回显
    resetData, //重置输入框
  }
}, []);
```