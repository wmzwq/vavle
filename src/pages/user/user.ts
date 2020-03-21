import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { HttpSerProvider } from '../../app/http-serve';
import { LoginPage } from '../login/login';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  loginMark: string;
  token: string;
  mobile: any[];
  name: any[];
  account: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private httpservice: HttpSerProvider,private app: App, private iab: InAppBrowser, private thb: ThemeableBrowser,) {
    this.loginMark = window.localStorage.getItem('loginMark');
    this.token = window.localStorage.getItem('token');
    this.getInformation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  getInformation() {
    var url = "http://122.228.89.215:8891/UserAppInfo/GetPageListAPP";
    this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token
    })).then(res => {

      this.mobile = res.data.F_Mobile;
      this.name = res.data.F_RealName;
      this.account = res.data.F_Account;      
    });
  }

  logout(){
    this.app.getRootNav().setRoot(LoginPage);
  }

}
