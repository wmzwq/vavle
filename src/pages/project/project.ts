import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DevicePage } from '../device/device';
import { HttpSerProvider } from '../../app/http-serve';
import { InAppBrowser } from '@ionic-native/in-app-browser';
declare var BMap;
import { Geolocation } from '@ionic-native/geolocation';
import * as $ from 'jquery';
import { BaseUI } from '../../app/baseui';
declare var BMapLib;
@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage extends BaseUI {

  loginMark: string;
  token: string;
  projectList: any[];
  map: any
  myGeo: any
  myIcon: any;
  hidebutton: boolean;
  flashbutton: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpservice: HttpSerProvider,
    private iab: InAppBrowser,
    private geolocation: Geolocation,
    public toastCtrl: ToastController
  ) {
    super();
    this.loginMark = window.localStorage.getItem('loginMark');
    this.token = window.localStorage.getItem('token');
    this.getProjectList();

  }


  getProjectList() {
    var url = "http://122.228.89.215:8891/UserApp/GetProjectList";
    this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token,
      "data": "{'pagination':{rows:50,page: 1,sidx:'',sord:'ASC'},'queryJson':\"{}\"} "
    })).then(res => {
      this.projectList = res.data;
      console.log(res)
    });
  }

  openScada(item) {
    var id = item.F_Id;
    const browser = this.iab.create('http://122.228.89.215:8890/Valve/MyScada/Run?Id=' + id + '&roomName=1', "_blank", "hideurlbar=yes");

    browser.show;
  }

  gotoDevice(item) {
    this.navCtrl.push(DevicePage, { F_Id: item.F_Id });
  }




  getLocation() {

    this.geolocation.getCurrentPosition().then((resp) => {

      if (resp && resp.coords) {

        let locationPoint = new BMap.Point(resp.coords.longitude, resp.coords.latitude);

        let convertor = new BMap.Convertor();

        let pointArr = [];

        pointArr.push(locationPoint);

        convertor.translate(pointArr, 1, 5, (data) => {

          if (data.status === 0) {

            let marker = new BMap.Marker(data.points[0], { icon: this.myIcon });

            this.map.panTo(data.points[0]);

            marker.setPosition(data.points[0]);

            this.map.addOverlay(marker);

          }

        })

        this.map.centerAndZoom(locationPoint, 13);

        console.log('GPS定位：您的位置是 ' + resp.coords.longitude + ',' + resp.coords.latitude);

      }

    }).catch(e => {

      console.log('Error happened when get current position.');

    });
  }
  projectMap() {

    if ($('#allmap').css('display') === 'none') {
      $('#allmap').css({ 'display': 'block' })
      $('.project').css({ 'display': 'none' })
      $('.messagebar').css({ 'display': 'none' })
      $('.maptool2').css({ 'display': 'block' })
    }
    else if ($('#allmap').css('display') === 'block') {
      $('#allmap').css({ 'display': 'none' })
      $('.project').css({ 'display': 'block' })
      $('.messagebar').css({ 'display': 'none' })
      $('.maptool2').css({ 'display': 'none' })
    }



    this.map = new BMap.Map("allmap");; // 创建Map实例
    // 添加带有定位的导航控件
    var navigationControl = new BMap.NavigationControl({

      // 启用显示定位
      enableGeolocation: true
    });
    this.map.addControl(navigationControl);
    // 添加定位控件
    // var geolocationControl = new BMap.GeolocationControl();
    // geolocationControl.addEventListener("locationSuccess", function(e){
    //   // 定位成功事件
    //   var address = '';
    //   address += e.addressComponent.province;
    //   address += e.addressComponent.city;
    //   address += e.addressComponent.district;
    //   address += e.addressComponent.street;
    //   address += e.addressComponent.streetNumber;
    //   alert("当前定位地址为：" + address);
    // });
    // geolocationControl.addEventListener("locationError",function(e){
    //   // 定位失败事件
    //   alert(e.message);
    // });
    // this.map.addControl(geolocationControl);
    this.hidebutton = false; //防止点击marker激活点击背景事件
    this.flashbutton = false;//防止重复点击刷新
    var allOverlay = this.map.getOverlays(); //清除除了客户外的标注点
    for (var i = 0; i < allOverlay.length; i++) {
      this.map.removeOverlay(allOverlay[i]);
    }
    var url = "http://122.228.89.215:8891/UserApp/GetProjectList";
    this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token,
      "data": "{'pagination':{rows:50,page: 1,sidx:'',sord:'ASC'},'queryJson':\"{}\"} "
    })).then(res => {
      if (res.data == null) {
        console.log("1")
        this.map.centerAndZoom("温州", 13); // 初始化地图,用城市名设置地图中心点
        return;
      }
      var AllRoom = res.data;
      console.log(res)
      var pointArr = [];//定位点集合
      for (var i = 0; i < AllRoom.length; i++) {
        if (AllRoom[i].F_ProjectMap == null) continue; //无定位的去掉

        var points = AllRoom[i].F_ProjectMap.split(',');
        var point = new BMap.Point(points[0], points[1]);
        pointArr.unshift(point);//添加到数组
        var myIcon = new BMap.Icon("assets/imgs/gps_map.png", new BMap.Size(32, 32), {
          anchor: new BMap.Size(15, 30)
        });
        var marker = new BMap.Marker(point, {
          icon: myIcon
        }); // 创建标注
        this.map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(4); //跳动的动画
        marker.id = i; //标注

        var label = new BMap.Label(AllRoom[i].F_ProjectName, {
          offset: new BMap.Size(-50, 30)
        }); //设置label(标注的样式)

        var label2 = new BMap.Label(AllRoom[i].F_ProjectAddness, {
          offset: new BMap.Size(-50, 30)
        }); //设置label(标注的样式)
        label.setStyle({
          color: " #153469",
          fontSize: "16px",
          lineHeight: "20px",
          maxWidth: "none",
          backgroundColor: "0.05",
          border: "none"
        });
        label2.setStyle({
          color: " #153469",
          fontSize: "16px",
          lineHeight: "20px",
          maxWidth: "none",
          backgroundColor: "0.05",
          border: "none"
        });
        marker.setTitle(AllRoom[i].F_ProjectAddness);
        marker.setLabel(label);
        marker.addEventListener("click", function () {

          this.hidebutton = false; //显示参数条
          $("#project").text(this.getLabel().content);
          $("#company").text(this.getTitle());
          $("#f_id").text(AllRoom[this.id].F_Id);
          $(".messagebar").show();
          setTimeout(function () {
            this.hidebutton = true;
          }, 50);
        });
        this.map.centerAndZoom(point, 18);//指定地图显示范围            
        var v = this.map.getViewport(pointArr);//此类代表视野，不可实例化，通过对象字面量形式表示
        this.map.centerAndZoom(v.center, v.zoom);//设置地图中心点和视野级别
        this.flashbutton = true;
      }
    });
  }
  scada1() {
    var f_id = $('#f_id').text();
    console.log(f_id)
    const browser = this.iab.create('http://122.228.89.215:8890/Valve/MyScada/Run?Id=' + f_id + '&roomName=1', "_blank", "hideurlbar=yes");
    browser.show;
  }
  goDevice() {
    var f_id = $('#f_id').text();
    this.navCtrl.push(DevicePage, { F_Id: f_id });
  }
  dw() {
    this.getLocation()
  }
  sx() {

    $('#allmap').css({ 'display': 'block' })
    $('.project').css({ 'display': 'none' })
    $('.messagebar').css({ 'display': 'none' })
    $('.maptool2').css({ 'display': 'block' })


    this.map = new BMap.Map("allmap");; // 创建Map实例
    // 添加带有定位的导航控件
    var navigationControl = new BMap.NavigationControl({

      // 启用显示定位
      enableGeolocation: true
    });
    this.map.addControl(navigationControl);

    this.hidebutton = false; //防止点击marker激活点击背景事件
    this.flashbutton = false;//防止重复点击刷新
    var allOverlay = this.map.getOverlays(); //清除除了客户外的标注点
    for (var i = 0; i < allOverlay.length; i++) {
      this.map.removeOverlay(allOverlay[i]);
    }
    var url = "http://122.228.89.215:8891/UserApp/GetProjectList";
    this.httpservice.post(url, JSON.stringify({
      "loginMark": this.loginMark,
      "token": this.token,
      "data": "{'pagination':{rows:50,page: 1,sidx:'',sord:'ASC'},'queryJson':\"{}\"} "
    })).then(res => {
      if (res.data == null) {
        console.log("1")
        this.map.centerAndZoom("温州", 13); // 初始化地图,用城市名设置地图中心点
        return;
      }
      var AllRoom = res.data;
      console.log(res)
      var pointArr = [];//定位点集合
      for (var i = 0; i < AllRoom.length; i++) {
        if (AllRoom[i].F_ProjectMap == null) continue; //无定位的去掉

        var points = AllRoom[i].F_ProjectMap.split(',');
        var point = new BMap.Point(points[0], points[1]);
        pointArr.unshift(point);//添加到数组
        var myIcon = new BMap.Icon("assets/imgs/gps_map.png", new BMap.Size(32, 32), {
          anchor: new BMap.Size(15, 30)
        });
        var marker = new BMap.Marker(point, {
          icon: myIcon
        }); // 创建标注
        this.map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(4); //跳动的动画
        marker.id = i; //标注

        var label = new BMap.Label(AllRoom[i].F_ProjectName, {
          offset: new BMap.Size(-50, 30)
        }); //设置label(标注的样式)

        var label2 = new BMap.Label(AllRoom[i].F_ProjectAddness, {
          offset: new BMap.Size(-50, 30)
        }); //设置label(标注的样式)
        label.setStyle({
          color: " #153469",
          fontSize: "16px",
          lineHeight: "20px",
          maxWidth: "none",
          backgroundColor: "0.05",
          border: "none"
        });
        label2.setStyle({
          color: " #153469",
          fontSize: "16px",
          lineHeight: "20px",
          maxWidth: "none",
          backgroundColor: "0.05",
          border: "none"
        });
        marker.setTitle(AllRoom[i].F_ProjectAddness);
        marker.setLabel(label);
        marker.addEventListener("click", function () {

          this.hidebutton = false; //显示参数条
          $("#project").text(this.getLabel().content);
          $("#company").text(this.getTitle());
          $("#f_id").text(AllRoom[this.id].F_Id);
          $(".messagebar").show();
          setTimeout(function () {
            this.hidebutton = true;
          }, 50);
        });
        this.map.centerAndZoom(point, 18);//指定地图显示范围            
        var v = this.map.getViewport(pointArr);//此类代表视野，不可实例化，通过对象字面量形式表示
        this.map.centerAndZoom(v.center, v.zoom);//设置地图中心点和视野级别
        this.flashbutton = true;
      }
    });
    const toast = super.showToast(this.toastCtrl, '刷新阀门位置成功');


  }
  doRefresh(refresher) {

    console.log("下拉刷新");



    this.getProjectList();
    setTimeout(() => {
      console.log('加载完成后，关闭刷新');
      refresher.complete();
      $('#allmap').css({ 'display': 'none' })
      $('.project').css({ 'display': 'block' })
      $('.messagebar').css({ 'display': 'none' })
      $('.maptool2').css({ 'display': 'none' })
      //toast提示
      const toast = super.showToast(this.toastCtrl, '加载成功');


    }, 2000);
  }

}
