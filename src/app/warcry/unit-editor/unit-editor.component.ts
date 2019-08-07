import { Component, OnInit, Input, AfterContentChecked, AfterContentInit } from '@angular/core';
import { Unit } from '../../models/warcry/unit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UnitService } from '../../services/warcry/unit.service';
import { AuthService } from '../../services/auth.service'; // DO NOT DELETE
import { MatSnackBar, MatDialog, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-unit-editor',
  templateUrl: './unit-editor.component.html',
  styleUrls: ['./unit-editor.component.scss']
})
export class UnitEditorComponent implements OnInit, AfterContentInit {
  @Input() private unit: Unit;
  private uuid: string;
  durationInSeconds = 3;

  mapPath = 'maps';

  constructor(
    private db: AngularFirestore,
    private unitService: UnitService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService, // DO NOT DELETE
    public dialog: MatDialog
  ) {
    if (!this.unit) {
      this.unit = new Unit();
    }
  }

  ngOnInit() {
    if (!this.unit) {
      this.unit = new Unit();
    }
  }

  ngAfterContentInit() {
    this.loadunit();
  }

  private loadunit() {
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('uuid');
    });

    this.unitService.getUnit(this.uuid).subscribe(snapshot => {
      if (snapshot.data()) {
        this.unit = snapshot.data();
      } else {
        this.unit = new Unit();
      }
    });
  }

  public saveUnit() {
    if (!this.unit.uuid) {
      this.unit.uuid = this.unit.name.trim().toLowerCase().replace(/ /g, '_');
    }

    this.unitService.addUnit(Object.assign({}, this.unit));
    this.openSaveSnackBar();
  }

  public deleteUnit() {
    if (this.unit.uuid) {
      this.unitService.deleteUnit(this.unit.uuid);
    }
    this.router.navigate(['/warcry/units/list']);
  }

  public confirmunitDeletion() {
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
        this.deleteUnit();
      }
    });
  }

  public cancel() {
    this.router.navigate([`/warcry/units/view/${this.unit.uuid}`]);
  }

  public setImage(url: string) {
    this.unit.image = url;
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
