export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

export interface VenueQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  type?: string;
  building?: string;
  floor?: string;
}