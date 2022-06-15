import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessoiresComponent } from './accessoires/accessoires.component';
import { AccountComponent } from './account/account.component';
import { AddComponent } from './add/add.component';
import { BookComponent } from './book/book.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CartComponent } from './cart/cart.component';
import { CategoryComponent } from './category/category.component';
import { CgvComponent } from './cgv/cgv.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { DecoComponent } from './deco/deco.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { NoticeComponent } from './notice/notice.component';
import { PayComponent } from './pay/pay.component';
import { ProductComponent } from './product/product.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { SearchComponent } from './search/search.component';



const routes: Routes = [
  { 
   path: 'home', 
   component: HomeComponent 
   },
   { 
    path: 'coming-soon', 
    component: ComingSoonComponent 
    },
    { 
      path: 'rechercher', 
      component: SearchComponent
      },
   { 
    path: 'mon-compte', 
    canActivate: [AuthGuard],
    component: AccountComponent 
    },
    { 
      path: 'connexion', 
      component: LoginComponent 
    },
    { 
      path: 'nouveau', 
      component: RegisterComponent 
    },
    { 
      path: 'recupreation', 
      component: ResetComponent 
    },
   { 
    path: 'tirages-photos', 
    component: CategoryComponent 
    },
    { 
      path: 'deco-murale', 
      component: DecoComponent 
    },
    { 
        path: 'accessoires', 
        component: AccessoiresComponent 
    },
    { 
          path: 'livres-photos', 
          //component: BookComponent 
          component: ComingSoonComponent 
    },
    { 
      path: 'calendriers', 
      //component: CalendarComponent 
      component: ComingSoonComponent 
    },
    { 
      path: 'mon-panier', 
      canActivate: [AuthGuard],
      component: CartComponent 
    },
    { 

      path: 'charger', 
      component: AddComponent 
    },
    { 
      path: 'paiement',
      canActivate: [AuthGuard],
      component: PayComponent 
    },
    { 
      path: 'produit', 
      component: ProductComponent 
    },
   { 
     path: 'cgv', 
     component: CgvComponent 
   },
   { 
    path: 'notice', 
    component: NoticeComponent 
  },
  { 
    path: 'delivery', 
    component: DeliveryComponent 
  },
  { 
    path: 'notfound', 
    component: NotfoundComponent 
  },
   { 
     path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', redirectTo: 'notfound'},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
