import { Component, OnInit, AfterContentInit, Inject, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Tactic } from '../../models/tactic.model';
import { TacticService } from '../../services/tactic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tactic-view',
  templateUrl: './tactic-view.component.html',
  styleUrls: ['./tactic-view.component.scss']
})
export class TacticViewComponent implements OnInit, AfterContentInit {
  @Input() public passedUuid: string;
  public uuid: string;
  private tactic: Tactic;

  constructor(private db: AngularFirestore,
    private tacticService: TacticService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
    ) {
     }

  ngOnInit() {
    if (!this.tactic) {
      this.tactic = new Tactic();
    }
  }

  ngAfterContentInit() {
    this.loadTactic();
  }

  public goToList() {
    this.router.navigate(['/tactics/list']);
  }

  public goToEdit() {
    this.router.navigate(['/tactics/edit', this.uuid]);
  }

  private loadTactic() {
    if (!this.passedUuid) {
      this.route.paramMap.subscribe(params => {
        this.uuid = params.get('uuid');
      });
    } else {
      this.uuid = this.passedUuid;
    }

    this.tacticService.getTactic(this.uuid).subscribe(snapshot => {
      this.tactic = snapshot.data();
    });
  }
}

