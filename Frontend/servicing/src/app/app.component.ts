import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: any ;
  currentRoute: string[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      console.log('current route: ', this.router.url);
      this.currentRoute = this.router.url.split('/');
      this.checkRoute();
    });
  }

  ngOnInit(): void {
  }

  checkRoute(): void {
    if (!this.currentRoute.includes('payment') && !this.currentRoute.includes('ForgetPassword') && !this.currentRoute.includes('changePassword') && !this.currentRoute.includes('verification') ) {
      this.user = sessionStorage.getItem('EmailId');
      console.log("user", this.user);
      if (this.user == null || this.user == undefined || this.user == '') {
        this.router.navigate(['/login']);
      }else if (this.currentRoute.includes('login')) {
        // User is already logged in and trying to access the login page,
        // redirect them to the dashboard or another appropriate route
        this.router.navigate(['/dashBoard']);
      }
    }
  }
}



  


