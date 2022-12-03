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
import { DetailComponent } from './detail/detail.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { ItemComponent } from './item/item.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { NoticeComponent } from './notice/notice.component';
import { PartnersComponent } from './partners/partners.component';
import { PayComponent } from './pay/pay.component';
import { ProductComponent } from './product/product.component';
import { RedirectComponent } from './redirect/redirect.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { SearchComponent } from './search/search.component';
import { SuccessComponent } from './success/success.component';



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
      path: 'redirect', 
      component: RedirectComponent 
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
      path: 'detail', 
      component: DetailComponent 
  },
    { 
      path: 'details', 
      component: DetailsComponent 
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
      path: 'success', 
      component: SuccessComponent 
    },
    { 
      path: 'partners', 
      component: PartnersComponent 
    },
   { 
     path: 'cgv', 
     component: CgvComponent 
   },
   { 
    path: 'edit', 
    component: EditComponent 
  },
   { 
    path: 'item', 
    component: ItemComponent 
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
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
