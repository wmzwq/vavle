import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { HttpSerProvider } from '../../app/http-serve';
import { DeviceDetailPage } from '../device-detail/device-detail';

@IonicPage()
@Component({
  selector: 'page-device',
  templateUrl: 'device.html',
})
export class DevicePage {

  loginMark: string;
  token: string;
  deviceList :any[];
  F_Id :any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private httpservice: HttpSerProvider
  ) {
    this.loginMark = window.localStorage.getItem('loginMark');
    this.token = window.localStorage.getItem('token');
    this.F_Id=this.navParams.data.F_Id;
    this.getDeviceList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicePage');
  }

  getDeviceList(){
    var url = "http://122.228.89.215:8891/UserApp/GetDeviceList";
    this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token,
      "data": "{'pagination':{rows:50,page: 1,sidx:'',sord:'ASC'},'queryJson':\"{'F_ProjectId':'"+this.F_Id+"'}\"} "
    })).then(res => {
      console.log(res)
      this.deviceList=res.data;
      
    });
  }
  gotoDetails(item){
    console.log(item. F_AccountNumber)
    this.navCtrl.push(DeviceDetailPage,{F_Id: item.F_Id, F_AccountNumber: item. F_AccountNumber});
  }
  back() {
    this.viewCtrl.dismiss();
  }
}
