import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { forkJoin, map, switchMap } from 'rxjs';
import { Repo } from '../model/repo.model';

@Injectable({
  providedIn: 'root'
})
export class ReposService {

  private headers = {
    'Authorization': 'Bearer '+ environment.access_token,
    'X-GitHub-Api-Version': '2022-11-28',
    'Accept': 'application/vnd.github+json'
  }

  constructor(private http: HttpClient) { }

  searchRepos(query: string, searchBy: string, language: string, minStars: number) {
    if(searchBy === 'name')
      return this.searchRepoByName(query, language, minStars);
    else
      return this.searchRepoByIssue(query, language);
  }

  searchRepoByName(repoName: string, language: string, minStars: number) {
    let searchQuery = `${repoName}`;
    if(language)
      searchQuery += `+language:${language}`;
    if(minStars)
      searchQuery += `+stars:>${minStars}`;
    return this.http.get(`${environment.apiUrl}/repositories?q=${searchQuery}`).pipe(
      map((res: any) => <Repo[]>res.items)
    );
  }

  searchRepoByIssue(issueTitle: string, language: string) {
    let searchQuery = `${issueTitle}+is:issue`;
    if(language)
      searchQuery += `+language:${language}`;
    return this.http.get(`${environment.apiUrl}/issues?q=${searchQuery}`).pipe(
      // Extract the repository URLs
      map((res: any) => {
        const repoUrls = new Set<string>(res.items.map((item: any) => item.repository_url));
        return Array.from(repoUrls);
      }),
      // Fetch the repositories
      switchMap((repoUrls: string[]) => {
        const repoRequests = repoUrls.map((url: string) => this.http.get(url));
        return forkJoin(repoRequests);
      }),
      // Map the response to the Repo model
      map((res: any) => <Repo[]>res )
    );
  }
}
