# AtEditor
 
react组件，文本输入关键词弹出列表，选中变成标签，删除一块删除，例如微信输入框艾特@


GitHub地址：[https://github.com/LZF-fe/AtEditor](https://github.com/LZF-fe/AtEditor)

npm地址：[https://www.npmjs.com/package/react-at-editor](https://www.npmjs.com/package/react-at-editor)
 
## 安装和使用
 
要安装和使用这个项目，你需要按照以下步骤操作：

直接  
`npm i react-at-editor`  

或者：
 
1. 克隆或下载项目代码。
2. 在终端中进入项目目录。
3. 运行 `npm install` 来安装依赖项。
4. 运行 `npm run dev` 来启动项目。
 

 ## 效果示例

 ![alt text](<ReadmeImg/mnggiflab-video-to-gif.gif>)

 ## 使用示例
 ```
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

function App() {
  const atRef = useRef(null)

  return (
    <div>
      <AtEditor
        ref={atRef}
        trigger='@'
        style={{width: '400px'}}
        atList={defaultList}
      >
      </AtEditor>
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

}
  ```


## 其他说明
### forwardRef+useImperativeHandle向外抛出了这五个方法用于获取和设置输入框的值

```
useImperativeHandle(refInstance, () => {
  return {
    getNormalData, // 得到输入框显示的字符串，没经过任何包装
    getHtmlData, // 得到html字符串
    setDataFromNormal, // 把后台拿到的普通字符串赋到输入框，用于回显
    setDataFromHtml, // 把html字符串直接值赋到输入框，用于回显
    resetData, // 重置输入框
  }
}, []);
```

```
export default forwardRef(
  (props, ref) => <AtEditor {...props} refInstance={ref} />
)
```
### 在父组件使用：例如atRef.current.getHtmlData()、atRef.current.setDataFromHtml(xxx)

----------------------
### 有用的话点个免费的star谢谢