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
  getCommits(repoName: string, userName: string): Observable<Commit[]> {
    return this.http.get<Commit[]>(`${environment.github_api}/repos/${userName}/${repoName}/commits`).pipe(
      map((res: any) => <Commit[]>res)
    );
  }
}
