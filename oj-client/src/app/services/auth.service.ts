// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

(window as any).global = window;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'hlo5mRaCs5gVKa3OfvYSBsEMeCSlRnc0',
    domain: 'bittigger503tony.auth0.com',
    responseType: 'token id_token',
    audience: 'https://bittigger503tony.auth0.com/userinfo',
    redirectUri: 'http://localhost:3000',
    scope: 'openid profile email'
  });

  userProfile:any;
  userRoles: any;
  accessToken: any;

  constructor(public router: Router, private http: HttpClient) {}

  public login(): void {
    this.auth0.authorize();
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        window.location.href="http://localhost:3000";
        // this.router.navigate(['']);
        } else if (err) {
        window.location.href="http://localhost:3000";
        // this.router.navigate(['']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

  public resetPassword(): void {
    let url = 'https://bittigger503tony.auth0.com/dbconnections/change_password';
    let headers = new HttpHeaders({ 'content-type': 'application/json' });
    let body = { client_id: 'hlo5mRaCs5gVKa3OfvYSBsEMeCSlRnc0',
     email: this.userProfile.email,
     connection: 'Username-Password-Authentication' };

     this.http.post(url, body, {headers: headers})
      .toPromise()
      .then((res: HttpResponse<any>) => {
        console.log(res);
      }).catch(this.handleError);
   }

   // public isAdmin(): Promise<boolean> {
   //   if(!this.userProfile) {
   //     this.getProfile((err, profile) => {
   //       this.userProfile = profile;
   //       this.getRoles(this.userProfile.user_id)
   //        .subscribe(data => {
   //          if(data.length > 0)
   //            return true;
   //          else
   //            return false;
   //        });
   //     });
   //   }else{
   //     this.getRoles(this.userProfile.user_id)
   //      .subscribe(data => {
   //        if(data.length > 0)
   //          return true;
   //        else
   //          return false;
   //      });
   //   }
   // }

   public getRoles(userId): Observable<any[]> {
        let url = `https://bittigger503tony.us.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api/users/${userId}/roles`;
        let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5UVkJOakV4TTBVNE5UVkZRa1F3TmtRMVFUQkNRakUyTWpVM1FVUTRRamRHUmpSQ056aERNdyJ9.eyJpc3MiOiJodHRwczovL2JpdHRpZ2dlcjUwM3RvbnkuYXV0aDAuY29tLyIsInN1YiI6ImxMYURCUmt3aVB3bE1iampoNWZlQmRycTI0ZVJobUhSQGNsaWVudHMiLCJhdWQiOiJ1cm46YXV0aDAtYXV0aHotYXBpIiwiaWF0IjoxNTMwMDQ1OTY0LCJleHAiOjE1MzAxMzIzNjQsImF6cCI6ImxMYURCUmt3aVB3bE1iampoNWZlQmRycTI0ZVJobUhSIiwic2NvcGUiOiJyZWFkOnVzZXJzIHJlYWQ6YXBwbGljYXRpb25zIHJlYWQ6Y29ubmVjdGlvbnMgcmVhZDpjb25maWd1cmF0aW9uIHVwZGF0ZTpjb25maWd1cmF0aW9uIHJlYWQ6Z3JvdXBzIGNyZWF0ZTpncm91cHMgdXBkYXRlOmdyb3VwcyBkZWxldGU6Z3JvdXBzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIHVwZGF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgcmVhZDpwZXJtaXNzaW9ucyBjcmVhdGU6cGVybWlzc2lvbnMgdXBkYXRlOnBlcm1pc3Npb25zIGRlbGV0ZTpwZXJtaXNzaW9ucyByZWFkOnJlc291cmNlLXNlcnZlciBjcmVhdGU6cmVzb3VyY2Utc2VydmVyIHVwZGF0ZTpyZXNvdXJjZS1zZXJ2ZXIgZGVsZXRlOnJlc291cmNlLXNlcnZlciIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.M8C1aaklQKpAz5pzS3ZsidsDyA9U6gzMeAtb6d9iZOgiaoQJtBeGc3lhN3oh8NwLLxFxs3RDClMeikJRHqh1YpcQbSUzF1N4AMrZMfpdgYvSDS6m7oKCQt9S3Xtci3tfeO2MNdUs4A_udeN3-8UwU3nFWgfcIVe6Y-f0dct2C3MmUkiLtrOOl2lFUsbKolXlCuw_wUNwpK6lTq3Xiw4ZB_8x5QchSXp4KpSAPjReIWBDoY54LJYPWsQsMPNGS_MWAIPOIXguRC9Cikbp9JMH2FAZ6Q7u93GgWZhxVL_4qeC3MqZtUbsxhFp6FyS8oN9NfWrOA-A7-pq4qhQmFLXZ6w'
        let headers = new HttpHeaders({'authorization': 'Bearer ' + token});
        return this.http.get<any[]>(url, {headers: headers});
   }

   private handleError(error: any): Promise<any> {
     console.error("Error occurred", error);
     return Promise.reject(error.message || error);
   }

   

}
