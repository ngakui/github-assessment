import { Component, OnDestroy, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ReposService } from '../services/repos.service';
import { Router } from '@angular/router';
import { Repo } from '../model/repo.model';
import { Subscription } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-repos',
  imports: [
    CommonModule,
    MatTableModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './repos.component.html',
  styleUrl: './repos.component.scss'
})
export class ReposComponent implements OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator;

  repos: WritableSignal<Repo[]> = signal([]);
  searchForm: FormGroup = new FormGroup({});

  repoSubscriptions: Subscription[] = [];

  constructor(private repoService: ReposService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchQuery: ['', Validators.required],
      searchBy: ['name'],
      programLang: [''],
      minStars: [1]
    });
  }

  search() {
    this.repoSubscriptions.push(this.repoService.searchRepos(
      this.searchForm.get('searchQuery')?.value,
      this.searchForm.get('searchBy')?.value,
      this.searchForm.get('programLang')?.value,
      this.searchForm.get('minStars')?.value
    ).subscribe((res: Repo[]) => {
      this.repos.set(res);
    }));
  }

  viewCommits(repoName: string, owner: string) {
    this.router.navigate(['/commits', repoName, owner]);
  }

  ngOnDestroy() {
    this.repoSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
