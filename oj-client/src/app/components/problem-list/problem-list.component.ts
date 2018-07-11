import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';
import { Observable, Subscription } from 'rxjs';
import { InputService } from '../../services/input.service';

@Component({
  selector: 'app-problem-list',
  templateUrl: `./problem-list.component.html`,
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {

  problems: Problem[] = [];
  searchTerm: string = '';
  subscriptionInput : Subscription;
  constructor(private dataService: DataService, private input: InputService ) { }

  ngOnInit() {
    this.getProblems();
    this.getSearchTerm();
  }

  getProblems(): void {
    this.dataService.getProblems()
      .subscribe(problems => this.problems = problems);
  }

  getSearchTerm(): void {
    this.subscriptionInput = this.input.getInput()
                          .subscribe(
                            inputTerm => this.searchTerm = inputTerm
                          );
  }

}
