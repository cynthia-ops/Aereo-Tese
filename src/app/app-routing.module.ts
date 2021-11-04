import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { HomeComponent } from './Componentes/home/home.component';
import { DistribuidoresComponent } from './Pages/distribuidores/distribuidores.component';
import { ProductosComponent } from './Pages/productos/productos.component';

const routes: Routes = [
  { path: 'proveedor', component: DistribuidoresComponent },
  { path: 'producto', component: ProductosComponent },

  { path: 'Inicio', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'producto' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
