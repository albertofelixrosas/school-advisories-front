import { apiClient } from './api.client'

export const VenueType = {
  CLASSROOM: 'CLASSROOM',
  OFFICE: 'OFFICE',
  VIRTUAL: 'VIRTUAL'
} as const

export type VenueType = typeof VenueType[keyof typeof VenueType]

export interface Venue {
  venue_id: number
  name: string
  type: VenueType
  url?: string
  building?: string
  floor?: string
}

export interface CreateVenueDto {
  name: string
  type: VenueType
  url?: string
  building?: string
  floor?: string
}

export interface UpdateVenueDto {
  name?: string
  type?: VenueType
  url?: string
  building?: string
  floor?: string
}

export interface VenueQueryDto {
  type?: VenueType
  building?: string
  limit?: number
  offset?: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

export class VenuesService {
  async findAll(query?: VenueQueryDto): Promise<PaginatedResult<Venue>> {
    const params = new URLSearchParams()
    if (query?.type) params.append('type', query.type)
    if (query?.building) params.append('building', query.building)
    if (query?.limit) params.append('limit', query.limit.toString())
    if (query?.offset) params.append('offset', query.offset.toString())
    
    const queryString = params.toString()
    const endpoint = queryString ? `/venues?${queryString}` : '/venues'
    
    return await apiClient.get<PaginatedResult<Venue>>(endpoint)
  }

  async findById(id: number): Promise<Venue> {
    return await apiClient.get<Venue>(`/venues/${id}`)
  }

  async create(venueData: CreateVenueDto): Promise<Venue> {
    return await apiClient.post<Venue>('/venues', venueData)
  }

  async update(id: number, venueData: UpdateVenueDto): Promise<Venue> {
    return await apiClient.put<Venue>(`/venues/${id}`, venueData)
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/venues/${id}`)
  }
}

export const venuesService = new VenuesService()