import { Component, OnDestroy, signal, WritableSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReposService } from '../services/repos.service';
import { Router } from '@angular/router';
import { Repo } from '../model/repo.model';
import { Subscription } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-repos',
  imports: [MatTableModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSortModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './repos.component.html',
  styleUrl: './repos.component.scss'
})
export class ReposComponent implements OnDestroy {

  searchQuery: string = '';
  repos: WritableSignal<Repo[]> = signal([]);

  repoSubscriptions: Subscription[] = [];

  constructor(private repoService: ReposService, private router: Router) { }

  search() {
    this.repoSubscriptions.push(this.repoService.searchRepos(this.searchQuery).subscribe((res: Repo[]) => {
      this.repos.set(res);
    }));
  }

  viewCommits(repoName: string) {
    this.router.navigate(['/commits', repoName]);
  }

  ngOnDestroy() {
    this.repoSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
