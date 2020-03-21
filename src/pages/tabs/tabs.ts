import { Component } from '@angular/core';

import { Md5 } from 'ts-md5/dist/md5';
import { HomePage } from '../home/home';
import { ProjectPage } from '../project/project';
import { UserPage } from '../user/user';
import { HttpSerProvider } from '../../app/http-serve';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  
  tab1Root = HomePage;
  tab2Root = ProjectPage;
  tab3Root = UserPage;
  loginMark: string;
  token: string;
  username: string;
  password: string;


  constructor(private httpservice: HttpSerProvider,) {
    this.loginMark = window.localStorage.getItem('loginMark');
    this.token = window.localStorage.getItem('token');
    this.username = window.localStorage.getItem('loginMark');
    this.password = window.localStorage.getItem('token');
   
  }
  login(){
    this.httpservice.get('http://122.228.89.215:8891/Login/AppCheckLogin?data={"username":"' + this.username + '","password":"' + Md5.hashStr(this.password).toString() + '"}',
    null).then(res => {
      if (res.code == 200) {
        window.localStorage.setItem('loginMark', res.data.loginMark);
        window.localStorage.setItem('token', res.data.token);
        
      }
    })
  }
}
