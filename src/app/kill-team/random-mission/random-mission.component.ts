import { Component, OnInit } from '@angular/core';
import { missions_config } from '../../services/mission.config';
import { Observable } from 'rxjs';
import { Mission } from '../../models/mission.model';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { MissionService } from '../../services/mission.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-random-mission',
  templateUrl: './random-mission.component.html',
  styleUrls: ['./random-mission.component.scss']
})
export class RandomMissionComponent implements OnInit {

  private missionsObservable: Observable<Mission[]>;
  private missions: Mission[];

  constructor(private db: AngularFirestore, private missionService: MissionService,
    private router: Router) { }

  ngOnInit() {
    this.missionsObservable = this.db.collection(missions_config.endpoint).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Mission;
          const id = a.payload.doc.id;
          data.uuid = id;
          return { id, ...data };
        });
      })
    );

    this.missionsObservable.subscribe(data => {
      this.missions = data;
      this.chooseRandomMission();
    });
  }

  public chooseRandomMission() {
    const randMission = this.missions[Math.floor(Math.random() * this.missions.length)];
    this.router.navigate(['/missions/view', randMission.uuid]);
  }
}
