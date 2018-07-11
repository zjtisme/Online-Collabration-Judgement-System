import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { PROBLEMS } from '../mock-problems';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getProblems(): Observable<Problem[]>{
    return this.http.get<Problem[]>("api/v1/problems");
  }

  getProblem(id: number): Observable<Problem> {
    return this.http.get<Problem>(`api/v1/problems/${id}`);
  }

  addProblem(problem: Problem): Observable<Problem> {
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json'
    })
    };
    return this.http.post<Problem>("api/v1/problems", problem, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  buildAndRun(data): Observable<any> {
    let headers = new HttpHeaders({'content-type': 'application/json'});
    return this.http.post<any>('/api/v1/build_and_run', data, {headers: headers});
  }
}
