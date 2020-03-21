import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { NativeService } from '../providers/NativeService ';
import { Network } from '@ionic-native/network';
declare var screen :any;    
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any ;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, splashScreen: SplashScreen,
    public storage: Storage,
    private nativeService:NativeService,
    private network: Network ,
    public modalCtrl: ModalController) {
    
    this.storage.get('firstIn').then((result) => {

      // if (result) {
        if (window.localStorage.getItem('username')) {
        
           this.rootPage =TabsPage;
        } else {
          this.rootPage = LoginPage;
        }
      // } 

    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
       this.nativeService.detectionUpgrade()
      this.checkNetwork();
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  checkNetwork() {
    if(this.network.type === 'unknown') {
      console.log('This is a unknown network, please be careful!');
    } else if(this.network.type === 'none') {
      console.log('none network!');
      // const modal = this.modalCtrl.create(WifePage);
      // modal.present();
    } else {
      console.log('we got a ' + this.network.type + ' connection, woohoo!');
    }
    
  }
}
