import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import {
  MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule,
  MatToolbarModule, MatIconModule, MatMenuModule, MatTableModule, MatPaginatorModule,
  MatSortModule, MatDialogModule, MatSnackBarModule, MatCheckboxModule,
  MatTooltipModule, MatSliderModule, MatExpansionModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MissionEditorComponent, SaveSnackBarComponent,
         DeleteSnackBarComponent } from './kill-team/mission-editor/mission-editor.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TacticViewComponent } from './kill-team/tactic-view/tactic-view.component';
import { MissionViewComponent } from './kill-team/mission-view/mission-view.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { MissionListComponent, NewMissionDialogComponent } from './kill-team/mission-list/mission-list.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { TacticEditorComponent, SaveTacticSnackBarComponent,
         DeleteTacticSnackBarComponent } from './kill-team/tactic-editor/tactic-editor.component';
import { TacticListComponent, NewTacticDialogComponent } from './kill-team/tactic-list/tactic-list.component';
import { PreGameChecklistComponent } from './pre-game-checklist/pre-game-checklist.component';
import { RandomMissionComponent } from './kill-team/random-mission/random-mission.component';
import { CampaignTableComponent } from './kill-team/campaign-table/campaign-table.component';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSliderModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  declarations: [AppComponent, AuthenticationComponent,
    MissionEditorComponent, MissionViewComponent, MissionListComponent, NewMissionDialogComponent,
    NewTacticDialogComponent,
    SaveSnackBarComponent, SaveTacticSnackBarComponent,
    DeleteSnackBarComponent, DeleteTacticSnackBarComponent,
    TacticEditorComponent, TacticViewComponent, TacticListComponent,
    FileUploadComponent, FileSizePipe, PreGameChecklistComponent, RandomMissionComponent, CampaignTableComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [NewMissionDialogComponent, NewTacticDialogComponent,
    SaveSnackBarComponent, SaveTacticSnackBarComponent,
    DeleteSnackBarComponent, DeleteTacticSnackBarComponent],
})
export class AppModule { }
