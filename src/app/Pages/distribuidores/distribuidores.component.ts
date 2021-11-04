import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Proveedor, Usuario } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-distribuidores',
  templateUrl: './distribuidores.component.html',
  styleUrls: ['./distribuidores.component.css']
})
export class DistribuidoresComponent implements OnInit {
  public user$: Observable<any> = this.authServ.afServ.user;
  collection = { data: [] }
  array: any

  proveedorForm: FormGroup;
  idFirebaseUpdate: string;
  updSave: boolean;
  path: string = "Proveedores/"

  //interfaces
  productos: Proveedor[];

  admin: any;

  urrAux: string

  config: any
  closeResult = "";
  usuario: Usuario;

  constructor(
    private authServ: AuthService,
    private firebaseService: FirebaseService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    private fibaseService: FirebaseService,
    // private readonly storage: AngularFireStorage,
    private router: Router
  ) {

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }

  ngOnInit(): void {

    this.authServ.getUserCurrent().subscribe(user => {
      if (user) {
        this.firebaseService.getDoc<Usuario>('Usuarios', user.uid).subscribe(res => {
          this.usuario = res;
          this.loadData();
        });
      } else {
        this.router.navigate(['login']);
        console.log("No estas logueado");
      }
    });

  }

  loadData() {
    this.idFirebaseUpdate = "";

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.collection.data.length
    };

    //
    this.proveedorForm = this.fb.group({
      empresa: ['', Validators.required],
      rfc: ['', Validators.required],
      nom_prov: ['', Validators.required],
      app_prov: ['', Validators.required],
      telefono: ['', Validators.required],
      calle: ['', Validators.required],
      colonia: ['', Validators.required],
      municipio: ['', Validators.required],
      ciudad: ['', Validators.required],
    });
    //

    this.fibaseService.getCollections(this.path).subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return {

          empresa: e.payload.doc.data().empresa,
          rfc: e.payload.doc.data().rfc,
          nom_prov: e.payload.doc.data().nom_prov,
          app_prov: e.payload.doc.data().app_prov,
          telefono: e.payload.doc.data().telefono,
          calle: e.payload.doc.data().calle,
          colonia: e.payload.doc.data().colonia,
          municipio: e.payload.doc.data().municipio,
          ciudad: e.payload.doc.data().ciudad,

          idFirebase: e.payload.doc.id
        }
      })
      console.log(this.collection.data);

    },
      error => {
        console.error(error);
      }
    )
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  eliminar(item: any): void {
    this.fibaseService.deleteDoc(this.path, item.idFirebase)

/*   this.collection.data.pop(item);
 */};

  guardarProveedor() {
    this.fibaseService.createArticulo(this.path, this.proveedorForm.value).
      then(resp => {
        this.proveedorForm.reset();
        this.modalService.dismissAll();
        // this.urlImage = new Observable;
      })
      .catch(error => {
        console.error(error);

      })
  }

  actualizarProveedor() {
    if (this.idFirebaseUpdate != null) {
      console.log(this.path, this.idFirebaseUpdate);

      this.fibaseService.updateArticulo(this.path, this.idFirebaseUpdate, this.proveedorForm.value).then(() => {
        this.proveedorForm.reset();
        this.modalService.dismissAll();
        // this.urlImage = new Observable;
      })
        .catch(error => {
          console.error(error);

        });
    }
  }

  //esto es codigo del modal
  editar(content, item: any) {
    this.updSave = true;
    this.idFirebaseUpdate = item.idFirebase

    //llenando formulario con los datos a editar
    this.proveedorForm.setValue({
      empresa: item.empresa,
      rfc: item.rfc,
      nom_prov: item.nom_prov,
      app_prov: item.app_prov,
      telefono: item.telefono,
      calle: item.calle,
      colonia: item.colonia,
      municipio: item.municipio,
      ciudad: item.ciudad,
      
    });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  nuevo(content) {
    this.updSave = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.proveedorForm.reset();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
