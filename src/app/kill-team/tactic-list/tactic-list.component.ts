import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Tactic } from '../../models/tactic.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TacticService } from '../../services/tactic.service';
import { tactics_config } from '../../services/tactic.config';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { includes } from 'lodash';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tactic-list',
  templateUrl: './tactic-list.component.html',
  styleUrls: ['./tactic-list.component.scss']
})
export class TacticListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private tacticsObservable: Observable<Tactic[]>;
  private tactics: Tactic[];
  private dataSource;
  public filterValue = '';

  displayedColumns: string[] = ['title', 'description', 'cost', 'source', 'view'];

  constructor(private db: AngularFirestore, private tacticService: TacticService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
    ) {
      this.dataSource = new MatTableDataSource();
    }

  ngOnInit() {
    this.tacticsObservable = this.db.collection(tactics_config.endpoint).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          // Get document data
          const data = a.payload.doc.data() as Tactic;
          // Get document id
          const id = a.payload.doc.id;
          data.uuid = id;
          // Use spread operator to add the id to the document data
          return { id, ...data };
        });
      })
    );

    this.tacticsObservable.subscribe(data => {
      this.tactics = data;
      this.dataSource = new MatTableDataSource<Tactic>(this.tactics);
    });
  }

  public goToEdit(tactic: Tactic) {
    this.router.navigate(['/tactics/edit', tactic.uuid]);
  }

  public applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.dataSource.filter = this.buildFilterString(filterValue);
  }

  private updateQueue(tactics: Tactic[]): void {
    this.tactics = tactics;
    this.dataSource = new MatTableDataSource(this.tactics);
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.customFilter;
    this.dataSource.filter = this.buildFilterString(this.filterValue);
    this.dataSource.paginator = this.paginator;
  }

  private buildFilterString(search: string): string {
    return `${search}`;
  }

  private customFilter(data: Tactic, filter: any): boolean {
    const filters: string[] = filter.split(';');

    const filterValue = filters[0].trim().toLowerCase();

    for (const key of Object.keys(data)) {
      if (includes(data[key].toString().toLowerCase(), filterValue)) {
        return true;
      }
    }

    return false;
  }

  public goToView(tactic) {
    this.router.navigate(['/tactics/view', tactic.uuid]);
  }

  private createNewTactic() {
    const dialogRef = this.dialog.open(NewTacticDialogComponent, {
      width: '250px',
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newTactic = new Tactic();
        newTactic.uuid = result.trim().toLowerCase().replace(/ /g, '_');
        this.goToEdit(newTactic);
      }
    });
  }
}


@Component({
  selector: 'app-new-tactic-dialog',
  templateUrl: 'new-tactic.dialog.html',
})
export class NewTacticDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NewTacticDialogComponent>,
    @Inject(MAT_DIALOG_DATA) {}
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
