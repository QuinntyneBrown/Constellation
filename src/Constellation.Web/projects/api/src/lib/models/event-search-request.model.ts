export interface EventSearchRequest {
  keyword?: string;
  fromDate?: string;
  toDate?: string;
  source?: string;
  tag?: string;
  page: number;
  pageSize: number;
}
