import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpSerProvider } from '../../app/http-serve';
import * as $ from 'jquery';
import {
  BaseUI
} from '../../app/baseui';
/**
 * Generated class for the AlarmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html',
})
export class AlarmPage extends BaseUI{
  loginMark: string;
  token: string;
  policeList: void;
  month: string | number;
  start: string;
  end: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpSerProvider,public alertCtrl: AlertController) {
    super();
    this.loginMark = window.localStorage.getItem('loginMark');
    this.token = window.localStorage.getItem('token');
    const formatDate = ( time: any ) => {
      // 格式化日期，获取今天的日期
      const Dates = new Date( time );
      const year: number = Dates.getFullYear();
     this.month = ( Dates.getMonth() + 1 ) < 10 ? '0' + ( Dates.getMonth() + 1 ) : ( Dates.getMonth() + 1 );
      const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
      return year + '-' + this.month + '-' + day;

      
    };
    this.start = formatDate( new Date().getTime() ); // 当前时间
  
   this. end=formatDate( new Date().getTime() + ( 1000 * 3600 * 24 * (1) ) )
    this.police()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmPage');
   
  }
  police(){
    var url = "http://122.228.89.215:8891/UserApp/GetFaultList";
    this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token,
      "data": "{'pagination':{rows:50,page: 1,sidx:'',sord:'ASC'},'queryJson':\"{'F_DeviceId':'','StartTime':'"+this.start+"','EndTime':'"+this.end+"'}\"} "
    })).then(res => {
      this.policeList=res.data
 if(res.data.length==0){
  $('#default').css({'display': 'block'})
 }
     console.log(res)
    });
  }
  
  disposal(item){
 
    const prompt = this.alertCtrl.create({
      title: '故障处置',
      message: "请输入故障处置原因",
      inputs: [
        {
          name: 'title',
      
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: data => {
      var url = "http://122.228.89.215:8891/UserApp/SolveFault";
      console.log(JSON.stringify({
        "loginMark": this.loginMark,
        "token": this.token,
        "F_Id":item.F_Id,
        "F_FaultHandleReason":data.title,
      }))
       this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token,
      "F_Id":item.F_Id,
      "F_FaultHandleReason":data.title,
    })).then(res => {
  
     console.log(res)
    });
          }
        }
      ]
    });
    prompt.present();
  
  }
}
