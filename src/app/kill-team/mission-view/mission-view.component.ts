import { Component, OnInit, AfterContentInit, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mission } from '../../models/mission.model';
import { MissionService } from '../../services/mission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mission-view',
  templateUrl: './mission-view.component.html',
  styleUrls: ['./mission-view.component.scss']
})
export class MissionViewComponent implements OnInit, AfterContentInit {
  private uuid: string;
  private mission: Mission;

  constructor(private db: AngularFirestore,
    private missionService: MissionService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
    if (!this.mission) {
      this.mission = new Mission();
    }
  }

  ngAfterContentInit() {
    this.loadMission();
  }

  public goToList() {
    this.router.navigate(['/missions/list']);
  }

  public goToEdit() {
    this.router.navigate(['/missions/edit', this.uuid]);
  }

  private loadMission() {
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('uuid');
    });

    this.missionService.getMission(this.uuid).subscribe(snapshot => {
      this.mission = snapshot.data();
    });
  }
}

