import { Component, OnInit, Input, AfterContentChecked, AfterContentInit } from '@angular/core';
import { Tactic } from '../../models/tactic.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { TacticService } from '../../services/tactic.service';
import { AuthService } from '../../services/auth.service'; // DO NOT DELETE
import { MatSnackBar, MatDialog, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-tactic-editor',
  templateUrl: './tactic-editor.component.html',
  styleUrls: ['./tactic-editor.component.scss']
})
export class TacticEditorComponent implements OnInit, AfterContentInit {
  @Input() private tactic: Tactic;
  private uuid: string;
  durationInSeconds = 3;

  mapPath = 'maps';

  constructor(
    private db: AngularFirestore,
    private tacticService: TacticService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService, // DO NOT DELETE
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    if (!this.tactic) {
      this.tactic = new Tactic();
    }
  }

  ngOnInit() {
    if (!this.tactic) {
      this.tactic = new Tactic();
      this.tactic.cost = 0;
    }
  }

  ngAfterContentInit() {
    this.loadTactic();
  }

  private loadTactic() {
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('uuid');
    });

    this.tacticService.getTactic(this.uuid).subscribe(snapshot => {
      if (snapshot.data()) {
        this.tactic = snapshot.data();
        if (!this.tactic.cost) {
          this.tactic.cost = 0;
        }
      } else {
        this.tactic = new Tactic();
      }
    });
  }

  public saveTactic() {
    if (!this.tactic.uuid) {
      this.tactic.uuid = this.tactic.title.trim().toLowerCase().replace(/ /g, '_');
    }

    this.tacticService.addTactic(Object.assign({}, this.tactic));
    this.openSaveSnackBar();
  }

  public deleteTactic() {
    if (this.tactic.uuid) {
      this.tacticService.deleteTactic(this.tactic.uuid);
    }
    this.router.navigate(['/tactics/list']);
  }

  public confirmTacticDeletion() {
    this.openDeleteSnackBar();
  }

  public removeCarriageReturns(value: string): string {
    return value.replace(/[\n\r]+/g, '');
  }

  openSaveSnackBar() {
    this.snackBar.openFromComponent(SaveTacticSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  openDeleteSnackBar() {
    const deleteSnackBarRef = this.snackBar.openFromComponent(DeleteTacticSnackBarComponent, {
      // duration: this.durationInSeconds * 1000,
    });

    deleteSnackBarRef.afterDismissed().subscribe(result => {
      if (result.dismissedByAction) {
        this.deleteTactic();
      }
    });
  }

  public cancel() {
    this.router.navigate([`/tactics/view/${this.tactic.uuid}`]);
  }
}

@Component({
  selector: 'app-save-tactic-snack-bar',
  templateUrl: 'save.snack-bar.html',
  styles: [`
  .save-snack-bar {
    color: orangered;
  }
  `],
})
export class SaveTacticSnackBarComponent {}

@Component({
  selector: 'app-delete-tactic-snack-bar',
  templateUrl: 'delete.snack-bar.html',
  styles: [`
  .delete-snack-bar {
    color: orangered;
  }
  `],
})
export class DeleteTacticSnackBarComponent {
  constructor(public snackBarRef: MatSnackBarRef<DeleteTacticSnackBarComponent>) {}

  cancelDelete() {
    this.snackBarRef.dismiss();
  }

  confirmDelete() {
    this.snackBarRef.dismissWithAction();
  }
}
