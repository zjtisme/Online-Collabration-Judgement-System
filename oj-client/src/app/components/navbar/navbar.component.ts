import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InputService } from '../../services/input.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = "Online Judge System";
  username = "";
  searchBox: FormControl = new FormControl();
  subscription: Subscription;
  constructor(public auth: AuthService, private input: InputService, private router: Router) {
  }

  ngOnInit() {
      if(this.auth.isAuthenticated()) {
      if (this.auth.userProfile) {
        this.username = this.auth.userProfile.nickname;
      } else {
        this.auth.getProfile((err, profile) => {
          this.username = profile.nickname;
        });
      }
    }

    this.subscription = this.searchBox
                        .valueChanges.pipe(debounceTime(200)).subscribe(term => this.input.changeInput(term));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  searchProblem(): void {
    this.router.navigate(['/problems']);
  }

  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
  }

}
