import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Commit } from '../model/commit.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CommitsService {

  constructor(private http: HttpClient) { }

  // Fetch commits for a given repository and specifc user
  getReposCommits(repoName: string, userName: string): Observable<Commit[]> {
    return this.http.get<Commit[]>(`${environment.github_api}/repos/${userName}/${repoName}/commits`).pipe(
      map((res: any) => <Commit[]>res.map((commit: any) => commit.commit))
    );
  }

  // Search commits inside a repository
  searchRepoCommits(query: string, repoName: string, userName: string): Observable<Commit[]> {
    return this.http.get<Commit[]>(`${environment.apiUrl}/commits?q=${query} repo:${userName}/${repoName}`).pipe(
      map((res: any) => <Commit[]>res.items.map((commit: any) => commit.commit)),
    );
  }
}
