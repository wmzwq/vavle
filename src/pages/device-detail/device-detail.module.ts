import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceDetailPage } from './device-detail';

@NgModule({
  declarations: [
    DeviceDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DeviceDetailPage),
  ],
})
export class DeviceDetailPageModule {}
