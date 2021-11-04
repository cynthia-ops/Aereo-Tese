import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  objecjSorce = new BehaviorSubject<{}>({})
  data: any = []

  $getObjecjtSorce = this.objecjSorce.asObservable();


  constructor(
    private firestore: AngularFirestore,
    private router: Router) { }

  getCollections<tipo>(path: string) {
    const coollection = this.firestore.collection<tipo>(path);
    return coollection.snapshotChanges();
  }

  crearDoc(path: string, data: any, id: string) {
    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string) {
    const collection = this.firestore.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string) {
    const collection = this.firestore.collection(path);
    return collection.doc(id).delete();
  }

  getUser() {
    return this.firestore.collection("usuarios").snapshotChanges();
  }

  getId() {
    return this.firestore.createId();
  }

  createUser(user: any) {
    return this.firestore.collection("usuarios").add(user);
  }

  sendObjectSorce(data: any) {
    this.objecjSorce.next(data);
  }

  createArticulo(path: string, item: any) {
    return this.firestore.collection(path).add(item);
  }

  updateArticulo(path: string, id: any, Smartphone: any) {
    return this.firestore.collection(path).doc(id).update(Smartphone);
  }

  getMochila() {
    return this.firestore.collection("Mochila").snapshotChanges();
  }

  createMochila(Mochila: any) {
    return this.firestore.collection("Mochila").add(Mochila);
  }

  updateMochila(id: any, Mochila: any) {
    return this.firestore.collection("Mochila").doc(id).update(Mochila);
  }

  eliminarMochila(id: any) {
    return this.firestore.collection("Mochila").doc(id).delete();
  }

  agregarUrl(Mochila: any) {
    return this.firestore.collection("Mochila").doc(Mochila.id).update(Mochila.url);
  }


}


