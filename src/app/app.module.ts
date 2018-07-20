import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

//import all essential component to the module
import { AppComponent } from './app.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';
import { ArticleCreateComponent } from './articles/article-create/article-create.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app.routing.module';


@NgModule({
  declarations: [
    AppComponent,
    ArticleListComponent,
    ArticleCreateComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
