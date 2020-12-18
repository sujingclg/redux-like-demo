import React, { createContext, Dispatch, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { IListItem, IStoreState } from './data';
import { queryList } from './service';

type Action = 
| { type: 'saveState', payload: IStoreState }
| { type: 'addItem', payload: IListItem }
| { type: 'removeItem', payload: Pick<IListItem, 'id'> };

const reducer = (state: IStoreState, action: Action) => {
  const { byId, allIds } = state;
  switch (action.type) {
    case 'saveState':
      return action.payload;
    case 'addItem':
      byId[action.payload.id] = action.payload;
      return { byId, allIds: [action.payload.id, ...allIds] };
    case 'removeItem':
      return { ...state, allIds: allIds.filter(i => i !== action.payload.id) };
    default:
      return state;
  }
};

const initialState: IStoreState = { byId: {}, allIds: [] };

const StoreContext = createContext<{ state: IStoreState, loading: boolean; dispatch?: Dispatch<Action> }>({
  state: initialState,
  loading: false,
});

export const useStoreState = () => {
  const { state, loading } = useContext(StoreContext);

  const list = useMemo(() => {
    const { byId, allIds } = state;
    return allIds.map(id => byId[id]).filter(i => i) as NonNullable<IListItem[]>;
  }, [state]);

  return { list, loading };
}

export const useStoreActions = () => {
  const { dispatch } = useContext(StoreContext);

  if (dispatch === undefined) {
    throw new Error('error information');
  }

  const onAdd = useCallback(async (item: IListItem) => {
    // send async request;
    dispatch({ type: 'addItem', payload: item });
  }, [dispatch]);

  const onRemove = useCallback(async (id: number) => {
    // send async request
    dispatch({ type: 'removeItem', payload: { id } });
  }, [dispatch]);

  return { onAdd, onRemove };
};

const Store: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    let didCancel = false;
    (async () => {
      setLoading(true);
      const res = await queryList();
      if (res && !didCancel) {
        dispatch({ type: 'saveState', payload: res });
        setLoading(false);
      }
    })();
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <StoreContext.Provider value={{ state, loading, dispatch }}>{children}</StoreContext.Provider>
  );
};

export default Store;
