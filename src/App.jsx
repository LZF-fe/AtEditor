import { useRef } from 'react'
import AtEditor from './components/AtEditor/index';

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

export default App
