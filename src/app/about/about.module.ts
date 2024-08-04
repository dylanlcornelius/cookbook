import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { CountUpModule } from 'ngx-countup';

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, CountUpModule, AboutRoutingModule],
})
export class AboutModule {}
