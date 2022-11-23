import { PROJECT_STATUS } from './../../base/constant';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project.model';
import { DonateService } from 'src/app/services/donate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public project$: Observable<Project[]>;
  public status = PROJECT_STATUS;
  public totalDonateAndProject;

  constructor(
    private projectService: ProjectService,
    private donateService: DonateService
  ) { }

  ngOnInit(): void {
    this.project$ = this.projectService.findAll();
    this.donateService.getTotalProjectAndDonate()
      .subscribe(res => this.totalDonateAndProject = res);
  }
}
