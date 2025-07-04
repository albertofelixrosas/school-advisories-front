import { useEffect, useState } from 'react';
import { getVenues } from '../services/venueService';
import type { Venue } from '../types/venue';
import type { PaginatedResult, VenueQueryParams } from '../types/pagination';

export function useVenues(initialFilters: VenueQueryParams = {}) {
  const [data, setData] = useState<Venue[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialFilters.page || 1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<VenueQueryParams>(initialFilters);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res: PaginatedResult<Venue> = await getVenues({
        ...filters,
        page,
      });
      setData(res.data);
      setTotal(res.total);
      setLastPage(res.lastPage);
      console.log({ res });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [page, filters]);

  return {
    data,
    total,
    page,
    setPage,
    lastPage,
    loading,
    filters,
    setFilters,
    reload: fetchVenues,
  };
}
