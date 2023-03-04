import axios from 'axios';
import qs from 'query-string';

export interface QueryRecord {
  id: string;
  number: number;
  name: string;
  contentType: 'img' | 'horizontalVideo' | 'verticalVideo';
  filterType: 'artificial' | 'rules';
  count: number;
  status: 'online' | 'offline';
  createdTime: string;
}

export type QueryParams = Partial<QueryRecord>;

export interface QueryListResponse {
  list: QueryRecord[];
  total: number;
}

export function fetchQueryList(
  params: QueryParams & {
    pageSize?: number;
    pageNo?: number;
  }
) {
  return axios.get<QueryListResponse>('/api/list/query', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
