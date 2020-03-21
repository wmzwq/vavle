import { Injectable } from '@angular/core';
import { Platform, AlertController, ToastController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { FileOpener } from '@ionic-native/file-opener';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Observable } from 'rxjs/Rx';
import { HttpSerProvider } from '../app/http-serve';
import { BaseUI } from '../app/baseui';

@Injectable()
export class NativeService extends BaseUI {
  loginMark: string;
  token: string;

  constructor(private platform: Platform,
    private alertCtrl: AlertController,
    private transfer: FileTransfer,
    private appVersion: AppVersion,
    private file: File,
    private fileOpener: FileOpener,
    // private msg : MsgProvider,
    private inAppBrowser: InAppBrowser,
    private httpservice: HttpSerProvider,
    public toastCtrl: ToastController) {
    super();
    this.loginMark = window.localStorage.getItem('loginMark');
    this.token = window.localStorage.getItem('token');
  }


  /**
   * 检查app是否需要升级
   */
  detectionUpgrade() {
    //this.appVersion.getVersionNumber()  获取当前apk的版本号类似于1.0.2
    this.appVersion.getVersionNumber().then(res => {
      var _that = this;
      var url = "http://122.228.89.215:8891/UserApp/EditionInfo";
      this.httpservice.post(url, JSON.stringify({
        "data": "{'pagination':{rows:50,page: 1,sidx:'F_EditionNumber',sord:'DESC'},'queryJson':\"{'F_EditionType':'1'}\"} "

      })).then(req => {
        try {
          console.log("banben", req)
          var appVersion = req.data.rows[0].F_EditionNumber
          var downLoadUrl = req.data.rows[0].F_DownloadSite
          window.localStorage.setItem('downLoadUrl', downLoadUrl);
          //当前apk和调用接口的版本号进行对比
          if (appVersion > res) {
            this.alertCtrl.create({
              title: '升级',
              subTitle: '发现新版本,是否立即升级？',
              buttons: [
                {
                  text: '否',
                  role: 'cancel',
                  handler: () => {
                    console.log('不进行更新');
                  }
                },
                {
                  text: '是',
                  handler: () => {
                    this.downloadApp();
                  }
                },
              ]
            }).present();

          }

        } catch (e) {
          const toast = super.showToast(this.toastCtrl, "/Edition/getpagelist接口异常:" + e);

        }

      });

    })

  }

  /**
   * 下载安装app
   */
  downloadApp() {
    if (this.isAndroid()) {
      let alert = this.alertCtrl.create({
        title: '下载进度：0%',
        enableBackdropDismiss: false,
        buttons: ['后台下载']
      });
      alert.present();
      let that = this;
      const fileTransfer: FileTransferObject = this.transfer.create();
      const apk = this.file.externalApplicationStorageDirectory + '阀门.apk'; //apk保存在手机里的目录
      const url = localStorage.getItem("downLoadUrl");     //调用接口获取到的下载路径
      fileTransfer.download(url, apk).then((entry) => {
        that.openApk(entry.toURL());
      });

      fileTransfer.onProgress((event: ProgressEvent) => {
        let num = Math.floor(event.loaded / event.total * 100);
        if (num === 100) {
          alert.dismiss();
        } else {
          let title = document.getElementsByClassName('alert-title')[0];
          title && (title.innerHTML = '下载进度：' + num + '%');
        }
      });

    }
    if (this.isIos()) {
      this.openUrlByBrowser(localStorage.getItem("downLoadUrl"));
    }
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 打开下载的apk
   */
  openApk(url: string) {
    this.fileOpener.open(url, 'application/vnd.android.package-archive').then(res => {
      const toast = super.showToast(this.toastCtrl, "打开apk成功" + res);

    }).catch(err => {
      const toast = super.showToast(this.toastCtrl, "打开apk失败!" + err);

    })
  }
  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   * @returns {Promise<string>}
   */
  getVersionNumber(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getVersionNumber().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        observer.error(false);
      });
    });
  }
}
