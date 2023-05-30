import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface GraphqlResponse<T> {
  message: string;
  token: string;
  data: T;
  errors?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private apiUrl = 'https://3.133.125.100:3000/graphql';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
  }

  setAuthorizationToken(token: string) {
    this.headers = this.headers.set('Authorization', `Bearer ${token}`);
  }

  public getAll<T>(query: string, variables?: any): Observable<GraphqlResponse<T>> {
    const body = { query: query, variables: variables, headers: this.headers };
    return this.http.post<GraphqlResponse<T>>(this.apiUrl, body);
  }

  public getById<T>(url: string, params: any): Observable<GraphqlResponse<T>> {
    const options = { headers: this.headers, params: params };
    return this.http.get<GraphqlResponse<T>>(url, options);
  }

  public add(mutation: string): Observable<GraphqlResponse<any>> {
    const body = { query: mutation, headers: this.headers };
    return this.http.post<GraphqlResponse<any>>(this.apiUrl, body);
  }

  public delete<T>(mutation: string, variables: any): Observable<GraphqlResponse<T>> {
    const body = { query: mutation, variables: variables, headers: this.headers };
    return this.http.post<GraphqlResponse<T>>(this.apiUrl, body);
  }

  public update<T>(mutation: string, variables: any): Observable<GraphqlResponse<T>> {
    const body = { query: mutation, variables: variables, headers: this.headers };
    return this.http.post<GraphqlResponse<T>>(this.apiUrl, body);
  }
}