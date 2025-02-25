import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { environment } from '../../../../environments/environment.development';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReposService {

  private headers = {
    // 'Authorization': 'Bearer '+ environment.access_token,
    'X-GitHub-Api-Version': '2022-11-28',
    'Accept': 'application/vnd.github+json'
  }

  constructor(private http: HttpClient) { }

  // searchRepos(query: string) {
  //   return this.http.get(`${environment.apiUrl}?q=${query}`, { headers: this.headers }).pipe(
  //     map((res: any) => res.items)
  //   );
  // }
}
