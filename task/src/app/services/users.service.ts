import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'https://fakestoreapi.com/users';

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  deleteUser(id:number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getUserById(id:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  updateUser(id: number, updatedUser: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedUser);
  }

 private sharedDataSource = new BehaviorSubject<string>('');
 sharedData$ = this.sharedDataSource.asObservable();

  sharingUserId(userId:string) {
    this.sharedDataSource.next(userId);
  }

  private sharedLoaderData = new BehaviorSubject<boolean>(false);
 sharedLoader$ = this.sharedLoaderData.asObservable();

  sharingLoader(userId:boolean) {
    this.sharedLoaderData.next(userId);
  }
}
