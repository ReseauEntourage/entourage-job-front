export interface INavPublicItem {
  href?: string;
  name: string;
  tag: {
    action: string;
  };
  childrens?: INavPublicItem[];
}
