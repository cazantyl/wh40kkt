import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import * as firebase from 'firebase/app';
import { UserService } from './services/user.service'; // DO NOT REMOVE
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Warhammer Utilities';
  user = firebase.auth().currentUser;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.user = authService.user;
  }

  public ngOnInit(): void {
    this.addGoogleAnalytics();
  }

  public login() {
    this.authService.doGoogleLogin().then(data => {
      this.user = this.authService.user;
    });
  }

  public logout() {
    this.authService.doLogout();
  }

  public navigateToList() {
    this.router.navigate(['/missions/list']);
  }

  public navigateToTactics() {
    this.router.navigate(['/tactics/list']);
  }

  public navigateToPreGameChecklist() {
    this.router.navigate(['/pre-game-checklist']);
  }

  public reportBug() {
    window.open('https://github.com/cazantyl/wh40kkt/issues', '_blank');
  }
  public becomePatron() {
    window.open('https://www.patreon.com/bePatron?u=22270501', '_blank');
  }

  public navigateToCampaignTable() {
    this.router.navigate(['/campaign-table']);
  }

  private addGoogleAnalytics(): void {
    const analyticsKey: string = environment.uatag;
    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsKey}`;
    document.head.appendChild(analyticsScript);

    const gtagScript = document.createElement('script');
    gtagScript.innerHTML = `window.dataLayer = window.dataLayer || [];` +
      `function gtag(){dataLayer.push(arguments);}` +
      `gtag("js", new Date());` +
      `gtag("config", "${analyticsKey}");`;
    document.head.appendChild(gtagScript);
  }
}
