import React, { useRef } from 'react';
import { useStoreState, useStoreActions } from '../Store';
import "./index.css";

function App() {
  const countRef = useRef(200);

  const { list, loading } = useStoreState();
  const { onAdd, onRemove } = useStoreActions();

  const handleAdd = () => {
    const id = countRef.current++;
    onAdd({ id, name: `item ${id}` });
  };

  return (
    <div className="App">
      <div className="button-block">
        <button onClick={handleAdd}>Add</button>
      </div>
      <div>
        <div>{loading ? 'loading...' : 'ready'}</div>
        <ul className="list">
          {list.map(item => (
            <li key={item.id}>
              <span>{item.id}</span>
              <span>{item.name}</span>
              <button onClick={() => onRemove(item.id)}>remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
