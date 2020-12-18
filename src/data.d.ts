export interface IListItem {
  id: number;
  name: string;
};

export interface IStoreState {
  byId: { [key in number]?: IListItem };
  allIds: number[];
}
