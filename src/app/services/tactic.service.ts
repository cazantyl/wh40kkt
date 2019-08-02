import { Injectable } from '@angular/core';
import { Tactic } from '../models/tactic.model';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument, DocumentSnapshot } from '@angular/fire/firestore';
import { tactics_config } from './tactic.config';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TacticService {

  public tactics: AngularFirestoreCollection<Tactic>;

  private tacticDoc: AngularFirestoreDocument<Tactic>;

  constructor(private db: AngularFirestore) {
    this.tactics = db.collection<Tactic>(tactics_config.endpoint);
  }

  addTactic(tactic: Tactic) {
    this.tactics.doc(tactic.uuid).set(tactic);
  }

  updateTactic(id: string, tactic: Tactic) {
    this.tacticDoc = this.db.doc<Tactic>(`${tactics_config.endpoint}/${id}`);
    this.tacticDoc.update(tactic);
  }

  deleteTactic(id: string) {
    this.tacticDoc = this.db.doc<Tactic>(`${tactics_config.endpoint}/${id}`);
    this.tacticDoc.delete();
  }

  getTactic(id: string): any {
    const tacticSubject: Subject<Tactic> = new Subject<Tactic>();

    const tactic = this.db.doc<Tactic>(`${tactics_config.endpoint}/${id}`);
    return tactic.get();
  }
}
