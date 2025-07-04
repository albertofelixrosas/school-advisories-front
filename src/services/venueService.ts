import api from '../api/axios';
import type { CreateVenueDto, Venue } from '../types/venue';

export const getVenues = async (): Promise<Venue[]> => {
  const response = await api.get<Venue[]>("/venues");
  return response.data;
};

export const getVenueById = async (id: number): Promise<Venue> => {
  const response = await api.get<Venue>(`/venues/${id}`);
  return response.data;
};

export const createVenue = async (data: CreateVenueDto): Promise<Venue> => {
  const response = await api.post<Venue>("/venues", data);
  return response.data;
};

export const deleteVenue = async (id: number): Promise<void> => {
  await api.delete(`/venues/${id}`);
};

export const editVenue = async (venue: Venue): Promise<void> => {
  const { venue_id } = venue;
  await api.put(`/venues/${venue_id}`, venue);
};