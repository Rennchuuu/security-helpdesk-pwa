import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [] // No bootstrap component since we use standalone
})
export class AppModule {}
