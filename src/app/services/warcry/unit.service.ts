import { Injectable } from '@angular/core';
import { Unit } from '../../models/warcry/unit.model';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument, DocumentSnapshot } from '@angular/fire/firestore';
import { units_config } from './unit.config';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  public units: AngularFirestoreCollection<Unit>;

  private unitDoc: AngularFirestoreDocument<Unit>;

  constructor(private db: AngularFirestore) {
    this.units = db.collection<Unit>(units_config.endpoint);
  }

  addUnit(unit: Unit) {
    this.units.doc(unit.uuid).set(unit);
  }

  updateUnit(id: string, unit: Unit) {
    this.unitDoc = this.db.doc<Unit>(`${units_config.endpoint}/${id}`);
    this.unitDoc.update(unit);
  }

  deleteUnit(id: string) {
    this.unitDoc = this.db.doc<Unit>(`${units_config.endpoint}/${id}`);
    this.unitDoc.delete();
  }

  getUnit(id: string): any {
    const unit = this.db.doc<Unit>(`${units_config.endpoint}/${id}`);
    return unit.get();
  }
}
