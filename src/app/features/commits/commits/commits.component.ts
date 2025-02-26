import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CommitsService } from '../services/commits.service';
import { Commit } from '../model/commit.model';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-commits',
  imports: [MatTableModule],
  templateUrl: './commits.component.html',
  styleUrl: './commits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommitsComponent implements OnDestroy, OnInit {

  commits: WritableSignal<Commit[]> = signal([]);
  repoName: WritableSignal<string> = signal('');

  constructor(private commitService: CommitsService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      console.log('params', params);
      this.repoName.set(params['repo']);
      this.commitService.getReposCommits(params['repo'], params['owner']).subscribe((res: Commit[]) => {
        this.commits.set(res);
      });
    });
   }

  ngOnInit() {
  
  }

  ngOnDestroy() {
  }

}
