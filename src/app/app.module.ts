import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule,ThemeService} from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HereMapComponent } from './here-map/here-map.component';



@NgModule({
  declarations: [
    AppComponent,
    HereMapComponent
  ],
  providers:[ThemeService],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule
  ],
 
  bootstrap: [AppComponent]
})
export class AppModule {
 
 }
