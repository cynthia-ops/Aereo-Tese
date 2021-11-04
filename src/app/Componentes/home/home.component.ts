import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
 
})
export class HomeComponent implements OnInit {

  data: any = []
  id: any
  i: number

  constructor(
    private firebaseServ: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.firebaseServ.getMochila().subscribe(
      resp => {
        this.data = resp.map((e: any) => {
          return {
            tiposMochila: e.payload.doc.data().tiposMochila,
            genero: e.payload.doc.data().genero,
            descripcion: e.payload.doc.data().descripcion,
            color: e.payload.doc.data().color,
            precio: e.payload.doc.data().precio,
            medidas: e.payload.doc.data().medidas,
            material: e.payload.doc.data().material,
            cantidad: e.payload.doc.data().cantidad,
            calificacion: e.payload.doc.data().calificacion,
            url: e.payload.doc.data().url,
            idFirebase: e.payload.doc.id
          }
        })
      }
    )

  }

  verMochila(item: any) {
    this.firebaseServ.sendObjectSorce(item)
    this.router.navigate(['detalles', item.idFirebase])
  }

}
