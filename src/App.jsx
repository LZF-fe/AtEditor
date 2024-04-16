import { useRef } from 'react'
import AtRichText from './components/AtRichText/index';

const defaultList = [{
  key: "1",
  label: "小明",
  value: "小明",
},
{
  key: "2",
  label: "小李",
  value: "小李",
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

export default App
