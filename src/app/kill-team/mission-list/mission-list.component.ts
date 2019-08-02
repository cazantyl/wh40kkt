import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mission } from '../../models/mission.model';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { MissionService } from '../../services/mission.service';
import { missions_config } from '../../services/mission.config';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import { includes, filter } from 'lodash';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.scss']
})
export class MissionListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private missionsObservable: Observable<Mission[]>;
  private missions: Mission[];
  private dataSource: MatTableDataSource<Mission>;
  private filteredMissions;
  public filterValue = '';

  public showCoreRulebook = true;
  public showElitesRulebook = true;
  public showCommandersRulebook = true;
  public showArenaRulebook = false;
  public showTournamentRulebooks = false;
  public showOther = true;

  public showOpenPlay = true;
  public showMatchedPlay = true;
  public showNarrativePlay = true;

  public ignoreCommandersGames = false;

  public hideTable = false;
  public isMobile = false;
  public resizeEventSubscription: Subscription;
  public pageEvent: PageEvent;

  private MOBILE_WINDOW_SIZE = 700;

  displayedColumns: string[]; // = ['title', 'type', 'description', 'source'];

  public sources = ['core rulebook', 'elites rulebook', 'commanders rulebook', 'arena rulebook', 'tournament rulebooks'];

  constructor(private db: AngularFirestore, private missionService: MissionService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.hideTable = window.innerWidth < this.MOBILE_WINDOW_SIZE ? true : false;
    this.isMobile = this.hideTable;
    // observe window resize events on a delay of 200 ms, and fire off a function
    // so that the DOM can know whether to display mobile or desktop view

    this.initializeForm();
    this.checkScreenSize();

    this.resizeEventSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.hideTable = window.innerWidth < this.MOBILE_WINDOW_SIZE ? true : false;
        this.checkScreenSize();
      });

    this.missionsObservable = this.db.collection(missions_config.endpoint).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          // Get document data
          const data = a.payload.doc.data() as Mission;
          // Get document id
          const id = a.payload.doc.id;
          data.uuid = id;
          // Use spread operator to add the id to the document data
          return { id, ...data };
        });
      })
    );
    this.missionsObservable.subscribe(data => {
      this.missions = data;
      this.updateQueue();
    });
  }

  private initializeForm(): void {

    this.showCoreRulebook = true;
    this.showElitesRulebook = true;
    this.showCommandersRulebook = true;
    this.showArenaRulebook = false;
    this.showTournamentRulebooks = false;
    this.showOther = true;
    this.showOpenPlay = true;
    this.showMatchedPlay = true;
    this.showNarrativePlay = true;
    this.ignoreCommandersGames = false;

    if (sessionStorage.getItem('storedFilterValue')) {
      this.filterValue = JSON.parse(sessionStorage.getItem('storedFilterValue'));
    } else {
      this.filterValue = '';
    }

    if (sessionStorage.getItem('storedShowCoreRulebook')) {
      this.showCoreRulebook = JSON.parse(sessionStorage.getItem('storedShowCoreRulebook'));
    }

    if (sessionStorage.getItem('storedShowElitesRulebook')) {
      this.showElitesRulebook = JSON.parse(sessionStorage.getItem('storedShowElitesRulebook'));
    }

    if (sessionStorage.getItem('storedShowCommandersRulebook')) {
      this.showCommandersRulebook = JSON.parse(sessionStorage.getItem('storedShowCommandersRulebook'));
    }

    if (sessionStorage.getItem('storedShowArenaRulebook')) {
      this.showArenaRulebook = JSON.parse(sessionStorage.getItem('storedShowArenaRulebook'));
    }

    if (sessionStorage.getItem('storedShowTournamentRulebooks')) {
      this.showTournamentRulebooks = JSON.parse(sessionStorage.getItem('storedShowTournamentRulebooks'));
    }

    if (sessionStorage.getItem('storedShowOther')) {
      this.showOther = JSON.parse(sessionStorage.getItem('storedShowOther'));
    }

    if (sessionStorage.getItem('storedShowOpenPlay')) {
      this.showOpenPlay = JSON.parse(sessionStorage.getItem('storedShowOpenPlay'));
    }

    if (sessionStorage.getItem('storedShowMatchedPlay')) {
      this.showMatchedPlay = JSON.parse(sessionStorage.getItem('storedShowMatchedPlay'));
    }

    if (sessionStorage.getItem('storedShowNarrativePlay')) {
      this.showNarrativePlay = JSON.parse(sessionStorage.getItem('storedShowNarrativePlay'));
    }

    if (sessionStorage.getItem('storedIgnoreCommandersGames')) {
      this.ignoreCommandersGames = JSON.parse(sessionStorage.getItem('storedIgnoreCommandersGames'));
    }

    this.applyFilter(this.filterValue);
    this.updateQueue();
  }

  public clearSearch() {
    sessionStorage.clear();
    this.initializeForm();
  }

  @HostListener('window:beforeunload', ['$event'])
  ngOnDestroy(event?) {
    // sessionStorage.setItem('stored', JSON.stringify(this.show));

    sessionStorage.setItem('storedFilterValue', JSON.stringify(this.filterValue));

    sessionStorage.setItem('storedShowCoreRulebook', JSON.stringify(this.showCoreRulebook));
    sessionStorage.setItem('storedShowElitesRulebook', JSON.stringify(this.showElitesRulebook));
    sessionStorage.setItem('storedShowCommandersRulebook', JSON.stringify(this.showCommandersRulebook));
    sessionStorage.setItem('storedShowArenaRulebook', JSON.stringify(this.showArenaRulebook));
    sessionStorage.setItem('storedShowTournamentRulebooks', JSON.stringify(this.showTournamentRulebooks));
    sessionStorage.setItem('storedShowOther', JSON.stringify(this.showOther));

    sessionStorage.setItem('storedShowOpenPlay', JSON.stringify(this.showOpenPlay));
    sessionStorage.setItem('storedShowMatchedPlay', JSON.stringify(this.showMatchedPlay));
    sessionStorage.setItem('storedShowNarrativePlay', JSON.stringify(this.showNarrativePlay));
    sessionStorage.setItem('storedIgnoreCommandersGames', JSON.stringify(this.ignoreCommandersGames));
  }

  private checkScreenSize(): void {
    const previousDisplayState = this.isMobile;
    this.isMobile = window.innerWidth < this.MOBILE_WINDOW_SIZE ? true : false;

    if (!this.isMobile) {
      this.displayedColumns = ['title', 'type', 'description', 'source'];
    } else {
      this.displayedColumns = ['title', 'type', 'source'];
    }
  }


  public goToEdit(mission: Mission) {
    this.router.navigate(['/missions/edit', mission.uuid]);
  }

  public applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.dataSource.filter = this.buildFilterString(filterValue);
  }

  public buildFilteredSourcesArray(): string[] {
    const sourcesArray = [];
    if (this.showCoreRulebook) {
      sourcesArray.push('core rulebook');
    }
    if (this.showElitesRulebook) {
      sourcesArray.push('elites rulebook');
    }
    if (this.showCommandersRulebook) {
      sourcesArray.push('commanders rulebook');
    }
    if (this.showArenaRulebook) {
      sourcesArray.push('arena rulebook');
    }
    if (this.showTournamentRulebooks) {
      sourcesArray.push('tournament rulebooks');
    }

    return sourcesArray;
  }

  public buildFilteredGameTypesArray(): string[] {
    const gameTypeArray = [];

    if (this.showOpenPlay) {
      gameTypeArray.push('open play mission');
    }
    if (this.showMatchedPlay) {
      gameTypeArray.push('matched play mission');
    }
    if (this.showNarrativePlay) {
      gameTypeArray.push('narrative play mission');
    }
    return gameTypeArray;
  }

  private updateQueue(): void {
    const sourcesArray = this.buildFilteredSourcesArray();
    const gameTypesArray = this.buildFilteredGameTypesArray();

    this.filteredMissions = filter(this.missions, mission => {
      if (!mission.requiresCommander) {
        mission.requiresCommander = false;
      }
      if (mission.requiresCommander && this.ignoreCommandersGames) {
        return false;
      }
      if (sourcesArray.includes(mission.source.toLowerCase()) && gameTypesArray.includes(mission.type.toLowerCase())) {
        return true;
      } else if (this.showOther && gameTypesArray.includes(mission.type.toLowerCase())) {
        return !this.sources.includes(mission.source.toLowerCase());
      } else {
        return false;
      }
    });

    this.dataSource.data = this.filteredMissions;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private buildFilterString(search: string): string {
    return `${search}`;
  }

  public goToView(mission) {
    this.router.navigate(['/missions/view', mission.uuid]);
  }

  private createNewMission() {
    const dialogRef = this.dialog.open(NewMissionDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newMission = new Mission();
        newMission.uuid = result.trim().toLowerCase().replace(/ /g, '_');
        this.goToEdit(newMission);
      }
    });
  }

  public chooseRandomMission() {
    const randMission = this.dataSource.data[Math.floor(Math.random() * this.dataSource.data.length)];
    this.router.navigate(['/missions/view', randMission.uuid]);
  }
}


@Component({
  selector: 'app-new-mission-dialog',
  templateUrl: 'new-mission.dialog.html',
})
export class NewMissionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NewMissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) { }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
