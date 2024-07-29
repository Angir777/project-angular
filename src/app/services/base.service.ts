import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { prepareRequestParams } from '../utils/request-params.utils';

/**
 * Base service to connect to the restAPI.
 */
interface PageResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export class BaseService<T> {
  protected resourceUrl = environment.serverUrl;

  constructor(protected http: HttpClient, public resource: string) {
    this.resourceUrl = resource;
  }

  query(req?: any): Observable<HttpResponse<PageResponse<T>>> {
    const params: HttpParams = prepareRequestParams(req);
    return this.http.get<PageResponse<T>>(`${this.resourceUrl}`, {
      params,
      observe: 'response',
    });
  }

  getAll(): Observable<HttpResponse<T[]>> {
    return this.http.get<T[]>(`${this.resourceUrl}/get-all`, {
      observe: 'response',
    });
  }

  getById(id: any): Observable<HttpResponse<T>> {
    return this.http.get<T>(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }

  create(postData: T): Observable<HttpResponse<T>> {
    return this.http.post<T>(`${this.resourceUrl}`, postData, {
      observe: 'response',
    });
  }

  update(postData: T): Observable<HttpResponse<T>> {
    return this.http.patch<T>(`${this.resourceUrl}`, postData, {
      observe: 'response',
    });
  }

  delete(id: any): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
      observe: 'response',
    });
  }
}

export class BaseServiceWithDeleted<T> extends BaseService<T> {
  constructor(
    protected override http: HttpClient,
    public override resource: string
  ) {
    super(http, resource);
  }

  queryDeleted(req?: any): Observable<HttpResponse<PageResponse<T>>> {
    const params: HttpParams = prepareRequestParams(req);
    return this.http.get<PageResponse<T>>(`${this.resourceUrl}/deleted`, {
      params,
      observe: 'response',
    });
  }
}
