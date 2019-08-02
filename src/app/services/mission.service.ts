import { Injectable } from '@angular/core';
import { Mission } from '../models/mission.model';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument, DocumentSnapshot } from '@angular/fire/firestore';
import { missions_config } from './mission.config';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  public missions: AngularFirestoreCollection<Mission>;

  private missionDoc: AngularFirestoreDocument<Mission>;

  constructor(private db: AngularFirestore) {
    this.missions = db.collection<Mission>(missions_config.endpoint);
  }

  addMission(mission: Mission) {
    this.missions.doc(mission.uuid).set(mission);
  }

  updateMission(id: string, mission: Mission) {
    this.missionDoc = this.db.doc<Mission>(`${missions_config.endpoint}/${id}`);
    this.missionDoc.update(mission);
  }

  deleteMission(id: string) {
    this.missionDoc = this.db.doc<Mission>(`${missions_config.endpoint}/${id}`);
    this.missionDoc.delete();
  }

  getMission(id: string): any {
    const mission = this.db.doc<Mission>(`${missions_config.endpoint}/${id}`);
    return mission.get();
  }
}
