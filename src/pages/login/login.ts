import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, Platform, ToastController, LoadingController, App } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
import 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5';

import { HttpSerProvider } from '../../app/http-serve';
import { HomePage } from '../home/home';
import { BaseUI } from '../../app/baseui';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BaseUI{

  private headers = new Headers({
    'Content-Type': 'application/json'
  });
  list: any[];
  settings: any;
  public isRemember: boolean = false;
  expenses: any = [];
  username: string;
  password: string;
  login: Array<any> = [];
  spinner1: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public storage: Storage,
    private httpservice: HttpSerProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private app: App
  ) {
    super();
    if(window.localStorage.getItem('username')!=null){
      this.username=window.localStorage.getItem('username')
      this.password=window.localStorage.getItem('password')
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  ionViewDidEnter() {

  }
  logIn() {
    var loading = super.showLoading(this.loadingCtrl, "登录中...");
    this.httpservice.get('http://122.228.89.215:8891/Login/AppCheckLogin?data={"username":"' + this. username  + '","password":"' + Md5.hashStr(this. password).toString() + '"}',
      null).then(res => {
        if (res.code == 200) {
          console.log(res)
          window.localStorage.setItem('username', this. username );
          window.localStorage.setItem('password',this. password);
          window.localStorage.setItem('loginMark', res.data.loginMark);
          window.localStorage.setItem('token', res.data.token);
          const toast = super.showToast(this.toastCtrl, res.info);
         
          loading.dismiss();
          this.app.getRootNav().setRoot(TabsPage);
          // this.navCtrl.setRoot(TabsPage);
        } else {
          loading.dismiss();
          const toast = super.showToast(this.toastCtrl, res.info);
         
        }
      })
  }

}
