import api from '../api/axios';
import type { CreateOrUpdateVenueDto, Venue } from '../types/venue';

export const getVenues = async (): Promise<Venue[]> => {
  const response = await api.get<Venue[]>("/venues");
  return response.data;
};

export const getVenueById = async (id: number): Promise<Venue> => {
  const response = await api.get<Venue>(`/venues/${id}`);
  return response.data;
};

export const createVenue = async (data: CreateOrUpdateVenueDto): Promise<Venue> => {
  const response = await api.post<Venue>("/venues", data);
  return response.data;
};

export const deleteVenue = async (id: number): Promise<void> => {
  await api.delete(`/venues/${id}`);
};

export const editVenue = async (id: number, venue: CreateOrUpdateVenueDto): Promise<void> => {
  await api.put(`/venues/${id}`, venue);
};