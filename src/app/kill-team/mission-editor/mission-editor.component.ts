import { Component, OnInit, Input, AfterContentChecked, AfterContentInit } from '@angular/core';
import { Mission } from '../../models/mission.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { MissionService } from '../../services/mission.service';
import { AuthService } from '../../services/auth.service'; // DO NOT DELETE
import { MatSnackBar, MatDialog, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-mission-editor',
  templateUrl: './mission-editor.component.html',
  styleUrls: ['./mission-editor.component.scss']
})
export class MissionEditorComponent implements OnInit, AfterContentInit {
  @Input() private mission: Mission;
  private uuid: string;
  durationInSeconds = 3;

  mapPath = 'maps';

  constructor(
    private db: AngularFirestore,
    private missionService: MissionService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService, // DO NOT DELETE
    public dialog: MatDialog
  ) {
    if (!this.mission) {
      this.mission = new Mission();
    }
  }

  ngOnInit() {
    if (!this.mission) {
      this.mission = new Mission();
    }
  }

  ngAfterContentInit() {
    this.loadMission();
  }

  private loadMission() {
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('uuid');
    });

    this.missionService.getMission(this.uuid).subscribe(snapshot => {
      if (snapshot.data()) {
        this.mission = snapshot.data();
      } else {
        this.mission = new Mission();
      }
    });
  }

  public saveMission() {
    if (!this.mission.uuid) {
      this.mission.uuid = this.mission.title.trim().toLowerCase().replace(/ /g, '_');
    }

    this.missionService.addMission(Object.assign({}, this.mission));
    this.openSaveSnackBar();
  }

  public deleteMission() {
    if (this.mission.uuid) {
      this.missionService.deleteMission(this.mission.uuid);
    }
    this.router.navigate(['/missions/list']);
  }

  public confirmMissionDeletion() {
    this.openDeleteSnackBar();
  }

  public removeCarriageReturns(value: string): string {
    return value.replace(/[\n\r]+/g, '');
  }

  openSaveSnackBar() {
    this.snackBar.openFromComponent(SaveSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  openDeleteSnackBar() {
    const deleteSnackBarRef = this.snackBar.openFromComponent(DeleteSnackBarComponent, {
    });

    deleteSnackBarRef.afterDismissed().subscribe(result => {
      if (result.dismissedByAction) {
        this.deleteMission();
      }
    });
  }

  public cancel() {
    this.router.navigate([`/missions/view/${this.mission.uuid}`]);
  }

  public setSpecialRuleImage(url: string) {
    this.mission.special_rule_image = url;
  }

  public setTwoPlayerMap(url: string) {
    this.mission.two_player_map = url;
  }

  public setFourPlayerMap(url: string) {
    this.mission.four_player_map = url;
  }
}

@Component({
  selector: 'app-save-snack-bar',
  templateUrl: 'save.snack-bar.html',
  styles: [`
  .save-snack-bar {
    color: orangered;
  }
  `],
})
export class SaveSnackBarComponent {}

@Component({
  selector: 'app-delete-snack-bar',
  templateUrl: 'delete.snack-bar.html',
  styles: [`
  .delete-snack-bar {
    color: orangered;
  }
  `],
})
export class DeleteSnackBarComponent {
  constructor(public snackBarRef: MatSnackBarRef<DeleteSnackBarComponent>) {}

  cancelDelete() {
    this.snackBarRef.dismiss();
  }

  confirmDelete() {
    this.snackBarRef.dismissWithAction();
  }
}
