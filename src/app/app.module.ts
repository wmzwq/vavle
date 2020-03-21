import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule, JsonpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpSerProvider } from './http-serve';
import { DevicePage } from '../pages/device/device';
import { ProjectPage } from '../pages/project/project';
import { DeviceDetailPage } from '../pages/device-detail/device-detail';
import { UserPage } from '../pages/user/user';
import { LoginPage } from '../pages/login/login';
import { IonicStorageModule } from '@ionic/storage';
import { AlarmPage } from '../pages/alarm/alarm';
import { Geolocation } from '@ionic-native/geolocation';
import {AppVersion} from '@ionic-native/app-version';
import {File} from '@ionic-native/file';
import {FileTransfer,FileTransferObject} from "@ionic-native/file-transfer";
import {FileOpener} from '@ionic-native/file-opener';
import { NativeService } from '../providers/NativeService ';
import { Network } from '@ionic-native/network';
@NgModule({
  declarations: [
    MyApp,
    AlarmPage,
    HomePage,
    TabsPage,
    DevicePage,
    ProjectPage,
    DeviceDetailPage,
    UserPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp,{
      iconMode: 'ios',
      // mode:'ios',
      tabsHideOnSubPages: 'true', //隐藏全部子页面 tabs
      backButtonText: '' /*配置返回按钮*/
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AlarmPage,
    
    HomePage,
    TabsPage,
    DevicePage,
    ProjectPage,
    DeviceDetailPage,
    UserPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpSerProvider,
    InAppBrowser,
    Geolocation,
    AppVersion,
    File,
    FileTransfer,
    FileOpener,
    FileTransferObject,
    NativeService,
    Network,
    ThemeableBrowser,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
