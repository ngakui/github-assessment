import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommitsService } from '../services/commits.service';
import { Commit } from '../model/commit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { merge, of, Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { searchQueryValidator } from '../../../helpers/validators/validators.helpers';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-commits',
  imports: [
    MatTableModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    CommonModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './commits.component.html',
  styleUrl: './commits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommitsComponent implements OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator();
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  isLoadingResults: WritableSignal<boolean> = signal(true);
  isRateLimitReached: WritableSignal<boolean> = signal(false);
  displayedColumns: string[] = [ 'author', 'message', 'url'];
  page: WritableSignal<number> = signal(1);
  perPage: WritableSignal<number> = signal(10);
  totalCommits: WritableSignal<number> = signal(50);

  commits: WritableSignal<Commit[]> = signal([]);
  repoName: WritableSignal<string> = signal('');
  repoOwner: WritableSignal<string> = signal('');

  searchForm: FormGroup = new FormGroup({});

  //unsubscribe from all subscriptions
  commitSubscriptions: Subscription[] = [];

  constructor(private commitService: CommitsService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchQuery: ['', [Validators.required, searchQueryValidator()]]
    });
    this.getRepoCommits();
  }

  ngAfterViewInit() {
    this.paginator.page.pipe().subscribe((event: PageEvent) => {
      this.page.set(event?.pageIndex + 1);
      this.perPage.set(event?.pageSize);
      if(this.searchForm.get('searchQuery')?.value === '' || this.searchForm.invalid)
        this.getRepoCommits();
      else
        this.searchCommits();
      }
    );
    
  }

  getRepoCommits() {
    this.isLoadingResults.set(true);
    this.commitSubscriptions.push(this.route.params.subscribe(params => {
      this.repoName.set(params['repo']);
      this.repoOwner.set(params['owner']);
      this.commitService.getReposCommits(
        this.repoName(), 
        this.repoOwner(),
        this.page(),
        this.perPage()
      ).subscribe({next: (res: Commit[]) => {
        this.isLoadingResults.set(false);
        this.commits.set(res);
      }, error: (err) => {
        this.isLoadingResults.set(false);
        this.isRateLimitReached.set(true);
      }});
    }));
  }

  searchCommits() {
    if(this.searchForm.invalid) 
      return;
    this.isLoadingResults.set(true);
    this.commitSubscriptions.push(this.commitService.searchRepoCommits(
      this.searchForm.get('searchQuery')?.value, 
      this.repoName(), 
      this.repoOwner(),
      this.page(),
      this.perPage()
    ).subscribe({next: (res: Commit[]) => {
      this.isLoadingResults.set(false);
      this.commits.set(res);
    }, error: (err) => {
      this.isLoadingResults.set(false);
      this.isRateLimitReached.set(true);
    }}));
  }

  backToRepos() {
    this.router.navigate(['/repos']);
  }


  ngOnDestroy() {
    this.commitSubscriptions.forEach(sub => sub.unsubscribe());
  }

}
