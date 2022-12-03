import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home/home.component';
import { PayComponent } from './pay/pay.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { AddComponent } from './add/add.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPhotoEditorModule} from "ngx-photo-editor";
import { DecoComponent } from './deco/deco.component';
import { AccessoiresComponent } from './accessoires/accessoires.component';
import { CalendarComponent } from './calendar/calendar.component';
import { BookComponent } from './book/book.component';
import { CgvComponent } from './cgv/cgv.component';
import { NoticeComponent } from './notice/notice.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
//import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { InternationalPhoneNumberModule } from 'ng-phone-number';
import { FormsModule } from '@angular/forms';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { CartComponent } from './cart/cart.component';
import { SearchComponent } from './search/search.component';
import { RedirectComponent } from './redirect/redirect.component';
import { ItemComponent } from './item/item.component';
import { EditComponent } from './edit/edit.component';


import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

//676734912177-5t60ddc1ias75s49rdfdm7bdk8ul706r.apps.googleusercontent.com => id
//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 => code secret
// theprintplus237@gmail.com
// Mot de passe : DokotiStudio237
import {Ng2TelInputModule} from 'ng2-tel-input';
import { environment } from 'src/environments/environment';


import { ngxLoadingAnimationTypes, NgxLoadingModule } from "ngx-loading";
import { DetailsComponent } from './details/details.component';
import { DetailComponent } from './detail/detail.component';
import { SuccessComponent } from './success/success.component';
import { PartnersComponent } from './partners/partners.component';
import {JpImagePreloadModule} from '@jaspero/ng-image-preload';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PrivacyComponent,
    ProductComponent,
    CategoryComponent,
    HomeComponent,
    PayComponent,
    AccountComponent,
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    NotfoundComponent,
    SubcategoryComponent,
    AddComponent,
    DecoComponent,
    AccessoiresComponent,
    CalendarComponent,
    BookComponent,
    CgvComponent,
    NoticeComponent,
    DeliveryComponent,
    ComingSoonComponent,
    CartComponent,
    SearchComponent,
    RedirectComponent,
    ItemComponent,
    EditComponent,
    DetailsComponent,
    DetailComponent,
    SuccessComponent,
    PartnersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxPhotoEditorModule,
    //NgbModule,
    BrowserAnimationsModule,
    Ng2TelInputModule,
    //FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(),
    JpImagePreloadModule.forRoot(),
    InternationalPhoneNumberModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: "rgba(0,0,0,0.1)",
      backdropBorderRadius: "4px",
      primaryColour: "#ffffff",
      secondaryColour: "#ffffff",
      tertiaryColour: "#ffffff",
    }),
    NgbModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    NgbActiveModal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
