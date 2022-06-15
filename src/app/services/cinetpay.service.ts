import { Injectable } from '@angular/core';
declare var CinetPay;
@Injectable({
  providedIn: 'root'
})
export class CinetpayService {
  private CinetPay: any;

  private apikey: string = '17143088862973981cc5ad6.22031662';
  private site_id: number = 589285;
  private notify_url: string = 'https://cintepay.theprintplus-cm.com/notify.php';

  private trans_id: any; //Your transaction id
  private cpm_custom: any;
  private designation: any;
  private currency: string = 'XOF';

  
  constructor() {}

  seamless(amount : number){
    return new Promise(resolve => {

      //Generation d'une id de transaction
      this.trans_id = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();


      CinetPay.setConfig({
        apikey: this.apikey,
        site_id: this.site_id,
        notify_url: this.notify_url
      });
      //Lorsque la signature est généré
      CinetPay.on('signatureCreated', function (token) {
        //console.log('Tocken généré: ' + token);
      });
      CinetPay.on('paymentPending', function (e) {
        //console.log('code:' + e.code + 'Message::' + e.message);
      });
      CinetPay.on('error', function (e) {
        //console.log('Error code:' + e.code + 'Message::' + e.message);
      });
      CinetPay.on('paymentSuccessfull', function (paymentInfo) {
        resolve(paymentInfo);
        /*
          //if payment is successfull paymentInfo.cpm_result == '00'
            if (typeof paymentInfo.lastTime != 'undefined') {
              if (paymentInfo.cpm_result == '00') {
              }
            }
        */ 

      });

      CinetPay.setSignatureData({
        amount: amount,
        trans_id: this.trans_id,
        currency: this.currency,
        designation: this.designation,
        custom: this.cpm_custom
      });

      CinetPay.getSignature();  

    });
  }

}