import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDto, EventSearchRequest, PagedResult } from '../models';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/events';

  getEvents(request?: Partial<EventSearchRequest>): Observable<PagedResult<EventDto>> {
    let params = new HttpParams();
    if (request?.page) params = params.set('page', request.page);
    if (request?.pageSize) params = params.set('pageSize', request.pageSize);
    if (request?.keyword) params = params.set('keyword', request.keyword);
    if (request?.fromDate) params = params.set('fromDate', request.fromDate);
    if (request?.toDate) params = params.set('toDate', request.toDate);
    if (request?.source) params = params.set('source', request.source);
    if (request?.tag) params = params.set('tag', request.tag);

    return this.http.get<PagedResult<EventDto>>(this.baseUrl, { params });
  }

  getEvent(id: number): Observable<EventDto> {
    return this.http.get<EventDto>(`${this.baseUrl}/${id}`);
  }

  searchEvents(query: string): Observable<EventDto[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<EventDto[]>(`${this.baseUrl}/search`, { params });
  }
}
