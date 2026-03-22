import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SourceSummaryDto } from '../models';

@Injectable({ providedIn: 'root' })
export class SourcesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/sources';

  getSources(): Observable<SourceSummaryDto[]> {
    return this.http.get<SourceSummaryDto[]>(this.baseUrl);
  }
}
