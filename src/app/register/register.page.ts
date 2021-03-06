import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import axios from 'axios';
import { LoginService } from '../login/login.service';
const TOKEN_USERNAME = 'username-key';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  stringLoading = "Please wait. We are registering your account."
  constructor(
    public alertController: AlertController,
    public router: Router,
    private loginSrvc: LoginService,
    private storage: Storage,
    private loadingCtrl: LoadingController
  ) { }
  ngOnInit() {
    this.storage.get(TOKEN_USERNAME).then(username => {
      if(username){
        this.router.navigateByUrl('/forum/forum-home');
      }
    });
  }
  validateEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }
  validatePhoneNumber(phonenumber) {
    var regex = /^[+|0-9][0-9]{7,15}$/;
    return regex.test(phonenumber);
  }
  validatePassword(password) {
    var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;
    return regex.test(password);
  }
  async presentAlert(success, stringNotification) {
    const alertFailed = await this.alertController.create({
      header: 'Error',
      message: stringNotification,
      buttons: ['OK']
    });
    const alertSuccess = await this.alertController.create({
      header: 'Success',
      message: stringNotification,
      buttons: [
        {
          text: 'Login',
          handler: () => {
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });
    if(success) { await alertSuccess.present(); }
    else { await alertFailed.present(); }
  }
  onRegister(form) {
    var stringNotification = "";
    var success = false;
    var counter = 0;
    var registerPage = this;
    console.log(form);
    if(!form.value.email || !form.value.password || !form.value.retypepassword || !form.value.username || !form.value.phonenumber) {
      stringNotification += "Please enter your ";
      if(!form.value.email){
        stringNotification += "email";
        counter++;
      } 
      if(!form.value.password){
        if(counter>0) {
          stringNotification += ", ";
        }
        stringNotification += "password";
        counter++;
      } 
      if(!form.value.retypepassword){
        if(counter>0) {
          stringNotification += ", ";
        }
        stringNotification += " retype password";
        counter++;
      } 
      if(!form.value.username) {
        if(counter>0) {
          stringNotification += ", ";
        }
        stringNotification += " username";
        counter++;
      } 
      if(!form.value.phonenumber) {
        if(counter>0){
          stringNotification += ", ";
        }
        stringNotification += " phone number";
        counter++;
      }
      registerPage.presentAlert(success, stringNotification);
    }
    else if(!this.validateEmail(form.value.email)) {
      stringNotification = "Please input valid email!";
      registerPage.presentAlert(success, stringNotification);
    }
    else if(form.value.password !== form.value.retypepassword) {
      stringNotification = "Please retype correct password!";
      registerPage.presentAlert(success, stringNotification);
    }
    else if((form.value.phonenumber.length < 8 && form.value.phonenumber.length > 15) || !this.validatePhoneNumber(form.value.phonenumber)) {
      stringNotification = "Please input valid phone number!";
      registerPage.presentAlert(success, stringNotification);
    }
    else if(!this.validatePassword(form.value.password)) {
      stringNotification = "Please input valid password! Minimum 7 characters with at least 1 alphabet and 1 number.";
      registerPage.presentAlert(success, stringNotification);
    }
    else {
      registerPage.presentLoading(this.stringLoading);
      axios({
        method: 'post',
        url: environment.endPointConstant.registerEndPoint,
        headers: {
          "Content-Type": "application/json"
        },
        data: 
        {
          'phoneNumber': form.value.phonenumber,
          'email': form.value.email,
          'username': form.value.username,
          'password': form.value.password
        }
      })
      .then(function (response) {
        form.reset();
        registerPage.loadingCtrl.dismiss();
        if(response.data.Response.responseCode == "FAILED"){
          stringNotification = response.data.Response.message;
        }
        else if(response.data.Response.responseCode == "SUCCESS"){
          success = true;
          stringNotification = "Register Success! Please do Login";
        }
        registerPage.presentAlert(success, stringNotification);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
  presentLoading(stringLoading){
    console.log("mulai present")
    this.loadingCtrl.create({
      keyboardClose: true,
      message: stringLoading
    })
    .then(loadingEl => {
      loadingEl.present();
    })
    console.log("selesai present")
  }
}