import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
  ) { }

  get(url: string, options?: any): Observable<any> {
    return this.http.get(url, options).pipe(
        catchError((error) => {
            alert(error.message)
            throw error;
        }),
    );
  }
}
