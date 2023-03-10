import type {
  TableColumnData,
  TableData,
  TableBorder,
  TableRowSelection,
  TableExpandable,
  TablePagePosition,
  TableOperationColumn,
  TableDraggable,
} from '@arco-design/web-vue/es/table/interface';
import { VirtualListProps } from '@arco-design/web-vue/es/_components/virtual-list-v2/interface';
import { PaginationProps } from '@arco-design/web-vue/es/pagination/interface';
import { ScrollbarProps } from '@arco-design/web-vue/es/scrollbar';

export type Nullable<T> = T | null;
export type Recordable<T = any> = Record<string, T>;
export const SIZES = ['mini', 'small', 'medium', 'large'] as const;
export type Size = (typeof SIZES)[number];

/** 表格属性 */
export interface ProTableProps {
  // ************** 以为为 ProTable 拓展属性 ******************
  request: (
    params?: any,
    sort?: any,
    filter?: any
  ) => Promise<{ data: any[]; total: number }>;
  showSetting?: boolean;
  columns: ProColumnData[];

  // ************** 以为为 Arco Design Table 内置属性 ******************
  data?: TableData[];
  bordered?: boolean | TableBorder;
  hoverable?: boolean;
  stripe?: boolean;
  size?: Size;
  tableLayoutFixed?: boolean;
  loading?: boolean | object;
  rowSelection?: TableRowSelection;
  expandable?: TableExpandable;
  scroll?: {
    x?: number | string;
    y?: number | string;
    minWidth?: number | string;
    maxHeight?: number | string;
  };
  pagination?: boolean | PaginationProps;
  pagePosition?: TablePagePosition;
  indentSize?: number;
  rowKey?: string;
  showHeader?: boolean;
  virtualListProps?: VirtualListProps;
  spanMethod?: (data: {
    record: TableData;
    column: TableColumnData | TableOperationColumn;
    rowIndex: number;
    columnIndex: number;
  }) => { rowspan?: number; colspan?: number } | void;
  spanAll?: boolean;
  loadMore?: (
    record: TableData,
    done: (children?: TableData[]) => void
  ) => void;
  filterIconAlignLeft?: boolean;
  hideExpandButtonOnEmpty?: boolean;
  rowClass?:
    | string
    | any[]
    | Record<string, any>
    | ((record: TableData, rowIndex: number) => any);
  draggable?: TableDraggable;
  columnResizable?: boolean;
  summary?:
    | boolean
    | ((params: {
        columns: TableColumnData[];
        data: TableData[];
      }) => TableData[]);
  summaryText?: string;
  summarySpanMethod?: (data: {
    record: TableData;
    column: TableColumnData | TableOperationColumn;
    rowIndex: number;
    columnIndex: number;
  }) => { rowspan?: number; colspan?: number } | void;
  selectedKeys?: (string | number)[];
  defaultSelectedKeys?: (string | number)[];
  expandedKeys?: (string | number)[];
  defaultExpandedKeys?: (string | number)[];
  defaultExpandAllRows?: boolean;
  stickyHeader?: boolean | number;
  scrollbar?: boolean | ScrollbarProps;
}

/** 表格列数据 */
export interface ProColumnData extends TableColumnData {
  /** 覆盖原始类型，更改为必填属性 */
  dataIndex: string;
  /** 在列设置中是否默认隐藏 */
  defaultHidden?: boolean;
}

export type ColumnChangeParam = {
  dataIndex: string;
  visible: boolean;
};

export interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

export type ComponentRef<T extends HTMLElement = HTMLDivElement> =
  ComponentElRef<T> | null;

/** 表格方法 */
export interface ProTableAction {
  /**
   * 设置全选状态
   * @param { boolean } checked
   */
  selectAll: (checked?: boolean) => void;
  /**
   * 设置行选择器状态
   * @param { string | number | (string | number)[] } rowKey
   * @param { boolean } checked
   */
  select: (
    rowKey: string | number | (string | number)[],
    checked?: boolean
  ) => void;
  /**
   * 设置全部展开状态
   * @param { boolean } checked
   */
  expandAll: (checked?: boolean) => void;
  /**
   * 设置展开状态
   * @param { string | number | (string | number)[] } rowKey
   * @param { boolean } checked
   */
  expand: (
    rowKey: string | number | (string | number)[],
    checked?: boolean
  ) => void;
  /**
   * 重置列的筛选器
   * @param { string | string[] } dataIndex
   */
  resetFilters: (dataIndex?: string | string[]) => void;
  /**
   * 清空列的筛选器
   * @param { string | string[] } dataIndex
   */
  clearFilters: (dataIndex?: string | string[]) => void;
  /**
   * 重置列的排序
   */
  resetSorters: () => void;
  /**
   * 清空列的排序
   */
  clearSorters: () => void;
  /**
   * 刷新表格
   */
  reload: () => Promise<void>;
  /**
   * 设置表格属性
   * @param props
   */
  setProps: (props: Partial<ProTableProps>) => void;
  /**
   * 获取表格尺寸
   */
  getSize: () => Size;
  /**
   * 获取表格列表数据
   */
  getColumns: () => ProColumnData[];
  /**
   * 设置表格列表数据
   */
  setColumns: (columns: ProColumnData[] | string[]) => void;
}
