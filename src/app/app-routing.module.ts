import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MissionEditorComponent } from './kill-team/mission-editor/mission-editor.component';
import { MissionViewComponent } from './kill-team/mission-view/mission-view.component';
import { AuthGuard } from './authentication/auth.guard';
import { AuthenticationComponent } from './authentication/authentication.component';
import { MissionListComponent } from './kill-team/mission-list/mission-list.component';
import { TacticEditorComponent } from './kill-team/tactic-editor/tactic-editor.component';
import { TacticViewComponent } from './kill-team/tactic-view/tactic-view.component';
import { TacticListComponent } from './kill-team/tactic-list/tactic-list.component';
import { PreGameChecklistComponent } from './pre-game-checklist/pre-game-checklist.component';
import { RandomMissionComponent } from './kill-team/random-mission/random-mission.component';
import { CampaignTableComponent } from './kill-team/campaign-table/campaign-table.component';

// { path: 'generate', component: QueueComponent, canActivate: [AuthGuard] },
const routes: Routes = [
  { path: 'list', redirectTo: 'missions/list', pathMatch: 'full'},
  { path: 'missions/list', component: MissionListComponent},
  { path: 'missions/view/:uuid', component: MissionViewComponent},
  { path: 'missions/edit/:uuid', component: MissionEditorComponent, canActivate: [AuthGuard]},
  { path: 'tactics/list', component: TacticListComponent},
  { path: 'tactics/edit/:uuid', component: TacticEditorComponent, canActivate: [AuthGuard]},
  { path: 'tactics/view/:uuid', component: TacticViewComponent},
  { path: 'pre-game-checklist', component: PreGameChecklistComponent},
  { path: 'login', component: AuthenticationComponent},
  { path: 'random', component: RandomMissionComponent},
  { path: 'campaign-table', component: CampaignTableComponent},
  { path: '', redirectTo: 'missions/list', pathMatch: 'full' },
  { path: '**', redirectTo: 'missions/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
