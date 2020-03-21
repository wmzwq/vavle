import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, RangeKnob, ToastController, LoadingController, App } from 'ionic-angular';
import { AlarmPage } from '../alarm/alarm';
import { HttpSerProvider } from '../../app/http-serve';
import * as echarts from 'echarts';
import { LoginPage } from '../login/login';
import { BaseUI } from '../../app/baseui';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BaseUI{

  @ViewChild('chart') chart: ElementRef;

  loginMark: string;
  token: string;
  OnlineCount: any;
  AccountCount: any;
  OfflineCount: any;
  FaultCount: any;
  rank: any[];
  deviceName: any[];
  faultNum: any[];
  month: string | number;
  start: string;
  end: string;
  faultData: any;
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpservice: HttpSerProvider,
    public toastCtrl: ToastController,
    public app: App,
    private loadingCtrl: LoadingController, 
  ) {
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
    this.faultData=formatDate( new Date().getTime() + ( 1000 * 3600 * 24 * (1) ) ) 
   this. end=formatDate( new Date().getTime() + ( 1000 * 3600 * 24 * (-30) ) )
    this.Main();
    this.fault()
  }

  ionViewDidEnter() {
    // this.initChart();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  fault(){
    var url = "http://122.228.89.215:8891//UserApp/GetMainPage";
    this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token,
      "data": "{'queryJson':\"{'StartTime':'"+this.start+"', 'EndTime':'"+this.faultData+"'}\"} "
    })).then(res => {
      this.OnlineCount = res.data.OnlineCount;
      this.AccountCount = res.data.AccountCount;
      this.OfflineCount = res.data.OfflineCount;
      this.FaultCount = res.data.FaultCount;
      if( this.FaultCount !=0){
        var circle1=document.getElementById("circle1")
        circle1.style.display="block";
      }
      console.log(res)
    
    
    });
  }
  Main() {
    var url = "http://122.228.89.215:8891//UserApp/GetMainPage";
    this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token,
      "data": "{'queryJson':\"{'StartTime':'"+this.start+"', 'EndTime':'"+this.end+"'}\"} "
    })).then(res => {

      if(res.code==400){
        const toast = super.showToast(this.toastCtrl, '登录信息已过期，请重新登录');
        this.app.getRootNav().setRoot(LoginPage);
      }

     let rank = res.data.FaultRank;
      let deviceArr = [];
      let dataArr = [];
       for (var i = 0; i < rank.length; i++) {
       deviceArr.push(rank[i].F_DeviceName);
       dataArr.push(rank[i].F_FaultCount);
       }
       console.log(res)
      this. loader = this.loadingCtrl.create({
        content: "数据通讯中，请稍候！",
        duration: 10000,
  
      });
      this. loader.present();
      this.initChart(deviceArr,dataArr);
    });
  }

  initChart(deviceArr,dataArr) {
    const ec = echarts as any;
    var myChart = ec.init(document.getElementById('chart'));
    var option = {
      color: ['#7598CE'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        height: '85%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: deviceArr,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {  
            interval:0,  
            rotate:40  
         }  
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          type: 'bar',
          barWidth: '60%',
          data: dataArr
        }
      ]
    }
    this. loader.dismiss()
    myChart.setOption(option);
  }

  gotoAlarm() {
    this.navCtrl.push(AlarmPage);
  }
  doRefresh(refresher){

    console.log("下拉刷新");
    this.Main();
    this.fault()
    setTimeout(() => { 
        console.log('加载完成后，关闭刷新'); 
        refresher.complete();
        const toast = super.showToast(this.toastCtrl, '加载成功');
      
      
    }, 2000);
}

}
