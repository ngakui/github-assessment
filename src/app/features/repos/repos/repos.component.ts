import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ReposService } from '../services/repos.service';
import { Router } from '@angular/router';
import { Repo } from '../model/repo.model';
import { Subscription } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { searchQueryValidator } from '../../../helpers/validators/validators.helpers';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-repos',
  imports: [
    CommonModule,
    MatTableModule, 
    MatIconModule, 
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './repos.component.html',
  styleUrl: './repos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReposComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator;

  isLoadingResults: WritableSignal<boolean> = signal(false);
  isRateLimitReached: WritableSignal<boolean> = signal(false);
  displayedColumns: string[] = ['avatar', 'name', 'created'];
  page: WritableSignal<number> = signal(1);
  perPage: WritableSignal<number> = signal(10);
  totalRepos: WritableSignal<number> = signal(50);
  repos: WritableSignal<Repo[]> = signal([]);
  searchForm: FormGroup = new FormGroup({});

  repoSubscriptions: Subscription[] = [];

  constructor(private repoService: ReposService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchQuery: ['', [Validators.required, searchQueryValidator()]],
      searchBy: ['name'],
      programLang: [''],
      minStars: [1]
    });
  }

  ngAfterViewInit() {
    this.paginator.page.pipe().subscribe((event: PageEvent) => {
      this.page.set(event?.pageIndex + 1);
      this.perPage.set(event?.pageSize);
      this.search();
    }
    );
  }

  search() {
    this.isLoadingResults.set(true);
    this.repoSubscriptions.push(this.repoService.searchRepos(
      this.searchForm.get('searchQuery')?.value,
      this.searchForm.get('searchBy')?.value,
      this.searchForm.get('programLang')?.value,
      this.searchForm.get('minStars')?.value,
      this.page(),
      this.perPage()
    ).subscribe({next: (res: Repo[]) => {
      this.isLoadingResults.set(false);
      this.repos.set(res);
    }, error: (err) => {
      console.error("Error", err);
      this.isLoadingResults.set(false);
      this.isRateLimitReached.set(true);
    }}));
  }

  viewCommits(repoName: string, owner: any) {
    this.router.navigate(['/commits', repoName, owner.url.split('/').pop()]);
  }

  ngOnDestroy() {
    this.repoSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
