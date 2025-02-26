import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CommitsService } from '../services/commits.service';
import { Commit } from '../model/commit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-commits',
  imports: [
    MatTableModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatButtonModule,
    CommonModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './commits.component.html',
  styleUrl: './commits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommitsComponent implements OnDestroy, OnInit {

  commits: WritableSignal<Commit[]> = signal([]);
  repoName: WritableSignal<string> = signal('');
  repoOwner: WritableSignal<string> = signal('');

  searchForm: FormGroup = new FormGroup({});

  //unsubscribe from all subscriptions
  commitSubscriptions: Subscription[] = [];

  constructor(private commitService: CommitsService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchQuery: ['', Validators.required]
    });
    this.commitSubscriptions.push(this.route.params.subscribe(params => {
      console.log('params', params);
      this.repoName.set(params['repo']);
      this.repoOwner.set(params['owner']);
      this.commitService.getReposCommits(this.repoName(), this.repoOwner()).subscribe((res: Commit[]) => {
        this.commits.set(res);
      });
    }));
  }

  searchCommits() {
    if(this.searchForm.invalid && this.searchForm.get('searchQuery')?.value.trim() === '')
      return;
    this.commitSubscriptions.push(this.commitService.searchRepoCommits(this.searchForm.get('searchQuery')?.value, this.repoName(), this.repoOwner()).subscribe((res: Commit[]) => {
      this.commits.set(res);
    }));
  }

  backToRepos() {
    this.router.navigate(['/repos']);
  }

  ngOnInit() {
  
  }

  ngOnDestroy() {
    this.commitSubscriptions.forEach(sub => sub.unsubscribe());
  }

}
