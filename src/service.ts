import { IStoreState } from './data';

const sleep = async (ms: number) =>
  new Promise(res => {
    setTimeout(() => {
      res('pending');
    }, ms);
  });

  const data = [
  { id: 100, name: 'item 100' },
  { id: 101, name: 'item 101' },
  { id: 102, name: 'item 102' },
  { id: 103, name: 'item 103' },
];

export async function queryList(): Promise<IStoreState | void> {
  await sleep(3000); // simulate network pending
  const { byId, allIds } = { byId: {}, allIds: [] } as IStoreState;
  data.forEach(item => {
    byId[item.id] = item;
    allIds.push(item.id);
  });
  return { byId, allIds };
}
