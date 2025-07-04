export type VenueType = 'classroom' | 'office' | 'virtual';

export interface Venue {
  venue_id: number;
  name: string;
  type: VenueType;
  url?: string | null; // URL for virtual venues
  building?: string | null; // Building name for physical venues
  floor?: string | null; // Floor information for physical venues
}

export interface CreateVenueDto {
  name: string;
  type: VenueType;
  url?: string | null;
  building?: string | null;
  floor?: string | null;
}
