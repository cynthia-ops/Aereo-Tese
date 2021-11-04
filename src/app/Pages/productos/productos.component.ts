import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Productos, Usuario } from 'src/app/models';
import { AuthService } from 'src/app/Servicios/auth.service';
import { FirebaseService } from 'src/app/Servicios/firebase.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  public user$: Observable<any> = this.authServ.afServ.user;
  collection = { data: [] }
  array: any

  productoForm: FormGroup;
  idFirebaseUpdate: string;
  updSave: boolean;
  path: string = "Productos/"

  //interfaces
  productos: Productos[];

  admin: any;

  urrAux: string

  config: any
  closeResult = "";
  usuario: Usuario;

  //
  // uploadPercent: Observable<number>;
  // urlImage: Observable<string>;
  // urlFInd: Subscription;
  // usuario: Usuario;

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

  // onUpload(e) {
  //   /* console.log(e.target.files[0]); */
  //   /* const id = Math.random().toString(36).substring(2); */
  //   const file = e.target.files[0];
  //   const filePath = `cars/${file.name}`;
  //   const ref = this.storage.ref(filePath);
  //   const task = this.storage.upload(filePath, file);
  //   this.uploadPercent = task.percentageChanges();
  //   task.snapshotChanges().pipe(
  //     finalize(
  //       () => this.urlImage = ref.getDownloadURL())).subscribe();

  // }

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
    this.productoForm = this.fb.group({
      proveedor: ['', Validators.required],
      producto: ['', Validators.required],
      costo: ['', Validators.required],
      stock: ['', Validators.required],
    });
    //

    this.fibaseService.getCollections(this.path).subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return {
          proveedor: e.payload.doc.data().proveedor,
          producto: e.payload.doc.data().producto,
          costo: e.payload.doc.data().costo,
          stock: e.payload.doc.data().stock,

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

  guardarProducto() {
    this.fibaseService.createArticulo(this.path, this.productoForm.value).
      then(resp => {
        this.productoForm.reset();
        this.modalService.dismissAll();
        // this.urlImage = new Observable;
      })
      .catch(error => {
        console.error(error);

      })
  }

  actualizarProducto() {
    if (this.idFirebaseUpdate != null) {
      console.log(this.path, this.idFirebaseUpdate);

      this.fibaseService.updateArticulo(this.path, this.idFirebaseUpdate, this.productoForm.value).then(() => {
        this.productoForm.reset();
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
    this.productoForm.setValue({
      proveedor: item.proveedor,
      producto: item.producto,
      costo: item.costo,
      stock: item.stock,
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
      this.productoForm.reset();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}