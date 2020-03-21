import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { HttpSerProvider } from '../../app/http-serve';
import * as $ from 'jquery';
import {
  BaseUI
} from '../../app/baseui';
 @IonicPage()
@Component({
  selector: 'page-device-detail',
  templateUrl: 'device-detail.html',
})
export class DeviceDetailPage extends BaseUI{

  loginMark: string;
  token: string;
  F_Id: any;
  F_AccountNumber: any;
  inforList: any;
  detailsList: any[];
  name: any;
  address: any;
  number: any;
  type: any;
  CH4: any;
  H2S: any;
  MC: any;
  temperature: any;
  ScadaEntity: any;
  Alarm: any;
  alarmState: any;
   TypeName: any;
   myInterval: number;
   Humidity: any;
   ActuatorLocation: any;
   F_Pressure2: any;
   F_Pressure: any;
   F_ActuatorLocation: any;
   F_BatteryVoltage: any;
   F_InputVoltage: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private httpservice: HttpSerProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
     private loadingCtrl: LoadingController, 
  ) {
    super();
    this.loginMark = window.localStorage.getItem('loginMark');
    this.token = window.localStorage.getItem('token');
    this.F_Id = this.navParams.data.F_Id;
    this.F_AccountNumber = this.navParams.data.F_AccountNumber;
    this.getDetails();
    this.getInfo();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceDetailPage');
  }

  getInfo() {
    var url = "http://122.228.89.215:8891/UserApp/GetDeviceList";
    this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token,
      "data": "{'pagination':{rows:50,page: 1,sidx:'',sord:'ASC'},'queryJson':\"{'F_AccountNumber':'" + this.F_AccountNumber + "'}\"} "
    })).then(res => {
      this.inforList = res.data[0];
      this.name = this.inforList.F_AccountName;
      this.number = this.inforList.F_AccountNumber;
      this.address = this.inforList.F_AccountAddness;
      this.TypeName = this.inforList.F_AccountTypeName;
      this.type = this.inforList.F_AccountType;
      this.ScadaEntity = this.inforList.F_ScadaEntity;    
      if (this.inforList.F_ScadaEntity != null) {
        this.CH4 = this.inforList.F_ScadaEntity.CH4;
        this.H2S = this.inforList.F_ScadaEntity.H2S;
        this.MC = this.inforList.F_ScadaEntity.MC
        this.ActuatorLocation = this.inforList.F_ScadaEntity.F_ActuatorLocation
        this.temperature = this.inforList.F_ScadaEntity.F_Temperature;
        this.Humidity=this.inforList.F_ScadaEntity.F_Humidity;
        if(this.type=="5"){
          this.F_Pressure2=(this.ScadaEntity.F_Pressure2).toFixed(1);
          this.F_Pressure=(this.ScadaEntity.F_Pressure).toFixed(1);
          this.F_ActuatorLocation=(this.ScadaEntity.F_ActuatorLocation).toFixed(1);
          this.F_BatteryVoltage=(this.ScadaEntity.F_BatteryVoltage).toFixed(1);
          this.F_InputVoltage=(this.ScadaEntity.F_InputVoltage).toFixed(1);
        }
    
      }
      console.log("cs",res)
    });
  }

  getDetails() {
    var url = "http://122.228.89.215:8891/UserApp/GetFaultList";
    this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token,
      "data": "{'pagination':{rows:50,page: 1,sidx:'F_AlarmRemove ASC,F_Date DESC',sord:''},'queryJson':\"{'F_DeviceId':'" + this.F_AccountNumber + "'}\"} "
    })).then(res => {
      this.detailsList = res.data;
      if(res.data.length==0){
        $('#default').css({'display': 'block'})
        $('.alarm').css({'display': 'none'})
       }
      console.log(this.detailsList);
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
      const toast = super.showToast(this.toastCtrl, res.info);
      
      this.getDetails();
      this.getInfo();
     console.log(res)
    });
          }
        }
      ]
    });
    prompt.present();
  
  }
  back() {
    this.viewCtrl.dismiss();
  }
  fireReset(data,val) {
    
   var gatewayId=data.substr(0,12)
   var nodeId=data.substr(12,2)
    if (!gatewayId || !nodeId) {
      const toast = super.showToast(this.toastCtrl,'网关地址和节点编号不能为空');
      return;
  }
  if (gatewayId.length != 12) {
    const toast = super.showToast(this.toastCtrl,'网关地址长度出错');
      return;
  }
  if (nodeId.length != 2) {
    const toast = super.showToast(this.toastCtrl,'节点地址长度出错');
      
  }
    var isdear=false;
    let loader = this.loadingCtrl.create({
      content: "数据通讯中，请稍候！",
      duration: 10000,

    });
    loader.present();
    var sock = null;
    var gatewayId1=gatewayId.substr(0,2)
    var gatewayId2=gatewayId.substr(2,2)
    var gatewayId3=gatewayId.substr(4,2)
    var gatewayId4=gatewayId.substr(6,2)
    var gatewayId5=gatewayId.substr(8,2)
    var gatewayId6=gatewayId.substr(10,2)
        //ws://122.228.89.215:8182
        var cmd;
        var lockReconnect=false
       var serverUrl= "ws://122.228.89.215:16370/echo"
       var  reconnectTime=5000///断线重连时间间隔
        sock = new WebSocket(serverUrl);
         cmd = [0xFF, 0xBB, 18, 0x00, 0x43, gatewayId1,  gatewayId2, gatewayId3, gatewayId4, gatewayId5, gatewayId6, 0, 0, 0, 0, 0x2F, 0x06, nodeId, 0x02, 0x03, val, 0, 0, 0, 0, 0, 0xFF, 0xEE];
        initEventHandle()
        function toast(message){
          const m = document.createElement('div');
          m.innerHTML = message;
          m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 90%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
          document.body.appendChild(m); 
          setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() { document.body.removeChild(m) }, d * 1000);
          }, 2000);
        }
        function initEventHandle(){
          if ("WebSocket" in window) {
            sock.onopen = function () {
              console.log('send', cmd)
              sendBytes(cmd)
              
            };
            sock.onmessage = function (evt) {
              isdear=true
              loader.dismiss();
              var received_msg = evt.data;
                      console.log(received_msg);
                      var json = JSON.parse(received_msg);
                      if (json.hasOwnProperty("Code")) {  
                                          
                          if (json["Code"] == 200) {
                            const message="通讯成功"
                            toast(message) 
                                           
                          }
                          else if (json["Code"] == 400) {
                            const message="网关繁忙"
                            toast(message)   
                           
                          }
                          else if (json["Code"] == 404) {
                            const message="网关离线"
                            toast(message)       
                           
                            
                          }
                          else { 
                            const message="通讯失败"
                            toast(message)                               
                          }
                        }
            };
            sock.onclose = function () {
              isdear=true
              loader.dismiss();
              console.log('复位命令已关闭');
              reconnect();
            };
            sock.onerror = function (data) {
              isdear=true
              loader.dismiss();
              console.log('onerror', data);
            }
          } else {
            const message="您的设备不支持 WebSocket！无法使用远程上传与下载功能！"
            toast(message) 
          }
      }

       
        function createWebSocket() {
          try {
              sock = new WebSocket(serverUrl);
              initEventHandle()
          } catch (e) {
            reconnect();
              console.error(e);
          }
      }
      function reconnect() {
          if (lockReconnect) return;
           lockReconnect = true;
          setTimeout(function () {
            createWebSocket();
             lockReconnect = false;
          }, reconnectTime);
      }
     function sendBytes(bytes) {
          var buffer = new ArrayBuffer(bytes.length);
          var view = new DataView(buffer);
          view.setUint8(0, bytes.length);
          for (var i = 0; i < bytes.length; i++) {
              view.setUint8(i, bytes[i]);
          }
          console.log(view)
          sock.send(view);
      }

      this.myInterval = setInterval(() => {
        console.log(isdear)
        if(isdear==false){
          const toast = super.showToast(this.toastCtrl, "通讯超时" , );
        }
        clearInterval(this.myInterval);
      }, 11000);
  }
  SwitchControl(){
 
    let alert = this.alertCtrl.create({
      title: '阀门控制，并确认',
      cssClass:'headChoice',
      message: "操作不可恢复，确认操作吗？",
      buttons: [{
          text: '关闭',
          handler: () => {
            var val="0";
            this.fireReset( this.number,val);
          }
        },
        {
          text: '打开',
          handler: () => {
           var val="1";
            this.fireReset( this.number,val);
          }
        }
      ]
    });
    alert.present();
  }
  actuator(){
    let alert = this.alertCtrl.create({
      title:'控制执行器位置，请输入{0,100}的值，并确认',
      inputs:[
        {
          name:'albumName',
        }
      ],
      buttons:['取消',
        {
          text:'确定',
          handler:data =>{
            this.fireReset( this.number,data.albumName);
            console.log(data.albumName)
          }
        }]
    })
    alert.present();
  }
}
