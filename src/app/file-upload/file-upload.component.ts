import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Download URL
  downloadURL: Observable<string>;

  @Input() path: string;
  @Output() public downloadURLEvent = new EventEmitter<string>();

  // State for dropzone CSS toggling
  isHovering: boolean;

  srcResult;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore
  ) {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    // The storage path
    const path = `${this.path}/${file.name}`;
    const fileRef = this.storage.ref(path);

    // Totally optional metadata
    const customMetadata = { app: 'wh40kktm' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();

    this.task.then(result => {
      // The file's download URL
      // this.downloadURL = this.task.downloadURL();
      this.downloadURL = fileRef.getDownloadURL();
      this.downloadURL.subscribe(url => {
        this.downloadURLEvent.emit(url);
      });
    });
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.addEventListener('loadend', (e: any) => {
        console.log(e);
        console.log(reader.result);
        this.srcResult = reader.result;
        reader.readAsArrayBuffer(this.srcResult);
      });
    }
  }
}
