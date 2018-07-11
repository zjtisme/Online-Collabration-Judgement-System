import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';
import { WindowrefService } from '../../services/windowref.service';
import { AuthService } from '../../services/auth.service';


const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: 0,
  name: "",
  desc: "",
  difficulty: "Easy"
});

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  difficulties = ["Easy", "Medium", "Hard", "Super"];
  isAdmin = false;

  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  constructor(private dataService: DataService, private _window: WindowrefService,
    private auth: AuthService) { }

  ngOnInit() {
    if(this.auth.isAuthenticated()) {
      if(!this.auth.userProfile){
        this.auth.getProfile((err, profile) => {
          if(profile) {
            // this.auth.getRoles(profile.sub)
            //   .subscribe(data => {
            //     if(data.length == 0)
            //       this.isAdmin = false;
            //     else {
            //       if(data.some(obj => obj.name === 'Admin'))
            //         this.isAdmin = true;
            //       else
            //         this.isAdmin = false;
            //     }
            //   });
            if(profile.name.indexOf("admin") != -1)
              this.isAdmin = true;
          }
        })
      }else{
        let profile = this.auth.userProfile;
            // this.auth.getRoles(profile.sub)
            //   .subscribe(data => {
            //     if(data.length == 0)
            //       this.isAdmin = false;
            //     else {
            //       if(data.some(obj => obj.name === 'Admin'))
            //         this.isAdmin = true;
            //       else
            //         this.isAdmin = false;
            //     }
            //   })
            if(profile.name.indexOf("admin") != -1)
              this.isAdmin = true;
      }


    }
  }

  addProblem(): void {
    this.dataService.addProblem(this.newProblem).subscribe(problem=>this._window.nativeWindow.location.href="http://localhost:3000", err=>console.log(err));
    this.newProblem = Object.assign({}, DEFAULT_PROBLEM);
  }

}
