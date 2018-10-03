import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { Md5 } from 'ts-md5';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from '@ionic-native/in-app-browser';

/**
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * Campo          | Tipo          | Tamaño | Descripción                                                                          |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * merchantId	    | Numérico      | 12     | Es el número identificador del comercio en el sistema de PayU,                       |
 *                |               |        | este número lo encontrarás en el correo de creación de la cuenta.	Todos los países  |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * referenceCode  | Alfa numérico | 255    | Es la referencia de la venta o pedido. Deber ser único por cada                      |
 *                |               |        | transacción que se envía al sistema. Normalmente es una forma de que                 |
 *                |               |        | identifiques las peticiones que se envían a la pasarela de pagos.	Todos los paíse   |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * description    | Alfa numérico |	255    | Es la descripción de la venta.	Todos los paíse                                       |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * amount         | Numérico      |	14,2   | Es el monto total de la transacción. Puede contener dos dígitos decimales.           |
 *                |               |        | Ej. 10000.00 ó 10000.	Todos los países                                              |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * tax            | Numérico      |	14,2   | Es el valor del IVA (Impuesto al Valor Agregado solo valido para Colombia) de la     |
 *                |               |        | transacción, si se envía el IVA nulo el sistema aplicará el 19% automáticamente.     |
 *                |               |        | Puede contener dos dígitos decimales.                                                |
 *                |               |        | Ej: 19000.00. En caso de no tener IVA debe enviarse en 0.	Todos los países          |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * taxReturnBase  | Numérico      |	32     | Es el valor base sobre el cual se calcula el IVA (solo valido para Colombia). En caso|
 *                |               |        | de que no tenga IVA debe enviarse en 0.	Todos los países                            |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * signature      |	Alfa numérico |	255    | Es la firma digital creada para cada uno de las transacciones.	Todos los países      |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * accountId      |	Numérico      |	6      | Identificador de la cuenta del usuario para cada país que tenga asociado el comercio,|
 *                |               |        | al enviarla se despliegan solo los medios de pago pertenecientes a dicho país.	      |
 *                |               |        | Todos los países                                                                     |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * currency       |	Alfa numérico |	3      | La moneda respectiva en la que se realiza el pago. El proceso de conciliación se hace| 
 *                |               |        | en pesos a la tasa representativa del día.	Todos los países                          |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * buyerFullName  |	Alfa numérico |	150    | Nombre completo del comprador.	Todos los países                                      |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * buyerEmail     |	Alfa numérico |	255    | Campo que contiene el correo electrónico del comprador para notificarle el resultado |
 *                |               |        | de la transacción por correo electrónico. Se recomienda hacer una validación si se 1 |
 *                |               |        | toma este dato en un formulario.	Todos los países                                    |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * shippingAddress|	Alfa numérico |	255    | La dirección de entrega de la mercancía.	Todos los países                            |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * shippingCity   |	Alfa numérico |	50     | La Ciudad de entrega de la mercancía.	Todos los países                              |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * shippingCountry|	Alfa numérico |	2      | El código ISO del país de entrega de la mercancía.	Todos los países                  |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 * telephone      |	Alfa numérico |	50     | El teléfono de residencia del comprador.	Todos los países                            |
 * ---------------+---------------+--------+--------------------------------------------------------------------------------------+
 */

//reference_pol=844765052
//transactionId=bf2361ff-5ea6-46f4-be9b-e14daf4f02b8
//lapTransactionState=PENDING

const API_KEY = "4Vj8eK4rloUd272L48hsrarnUA";
const MERCHANT_ID = 508029;
const ACCOUNT_ID = 512321;
const TAX_PERCENTAGE = 0.19;
const TEST = 1;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private paymentString: string;
  private paymentData: any = {
    merchantId: MERCHANT_ID,
    referenceCode: "pedSkilo12",
    description: "Una venta de prueba",
    amount: 20000,
    tax: 3193,
    taxReturnBase: 16807,
    signature: Md5.hashStr("~pedSkilo1~3193~COP"), //"ApiKey~merchantId~referenceCode~tx_value~currency"
    accountId: ACCOUNT_ID,
    currency: "COP",
    buyerFullName: "VICTOR GARZON MARIN",
    buyerEmail: "vgarzom@gmail.com",
    shippingAddress: "calle 55",
    shippingCity: "Bogotá",
    shippingCountry: "Colombia",
    telephone: "+575555555"
  };

  private responseUrl: string = "http://www.eskilo.com/payu/response";
  private confirmationUrl: string = "http://www.skilo.com/payu/confirmation";

  private post_url: string = "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu";

  constructor(public navCtrl: NavController, private iab: InAppBrowser, private platform: Platform, private alertCtrl: AlertController) {

  }

  callPayu() {
    var amount = this.paymentData.amount;
    var returnBase = Math.floor(amount / (1 + TAX_PERCENTAGE));
    var tax = amount - returnBase;

    this.paymentData.amount = amount;
    this.paymentData.tax = tax;
    this.paymentData.taxReturnBase = returnBase;
    this.paymentData.signature = Md5.hashStr(API_KEY + "~" + MERCHANT_ID + "~" + this.paymentData.referenceCode + "~" + amount + "~COP"), //"ApiKey~merchantId~referenceCode~tx_value~currency"

      console.log(JSON.stringify(this.paymentData));

    var payment = `
    <html>
      <body>
        <h5>Estamos redirigiendo a PayU, por favor espera un momento</h5>
        <form action="${this.post_url}" method="post" id="payu_form">
          <input type="hidden" name="merchantId" value="${this.paymentData.merchantId}">
          <input type="hidden" name="referenceCode" value="${this.paymentData.referenceCode}">
          <input type="hidden" name="description" value="${this.paymentData.description}">
          <input type="hidden" name="amount" value="${this.paymentData.amount}">
          <input type="hidden" name="tax" value="${this.paymentData.tax}">
          <input type="hidden" name="taxReturnBase" value="${this.paymentData.taxReturnBase}">
          <input type="hidden" name="signature" value="${this.paymentData.signature}">
          <input type="hidden" name="accountId" value="${this.paymentData.accountId}">
          <input type="hidden" name="currency" value="${this.paymentData.currency}">
          <input type="hidden" name="buyerFullName" value="${this.paymentData.buyerFullName}">
          <input type="hidden" name="buyerEmail" value="${this.paymentData.buyerEmail}">
          <input type="hidden" name="test" value="${TEST}">
          <input name="responseUrl"    type="hidden"  value="${this.responseUrl}">
          <input name="confirmationUrl"    type="hidden"  value="${this.confirmationUrl}">
          <button type="submit" value="submit" #submitBtn style="display: none" ></button>
        </form>
        <script type="text/javascript">document.getElementById("payu_form").submit();</script>
      </body>
    </html>`;
    console.log(payment);
    this.paymentString = 'data:text/html;base64,' + btoa(payment);
    console.log(this.paymentString);

    const browser = this.iab.create(this.paymentString, "_blank", {
      location: "no",
      clearcache: "yes",
      hardwareback: "no"
    });

    browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
      console.log("------------------------> Event received <------------------------")

      //reference_pol=844765052
      //transactionId=bf2361ff-5ea6-46f4-be9b-e14daf4f02b8
      //lapTransactionState=PENDING


      const result: string[] = event.url.split("?");
      const url = result[0];

      console.log(JSON.stringify(event));
      console.log("-----------------------------------------------------------------");
      console.log(url);
      if (url === this.confirmationUrl) {
        console.log("Confirmation URL called");
        browser.close();
      } else if (url === this.responseUrl) {
        console.log("Response URL called");
        browser.close();

        const data = result[1];

        const dataValues: string[] = data.split("&");

        var reference_pol = "";
        var transactionId = "";
        var transactionState = "";

        for (var i = 0; i < dataValues.length; i++) {
          const s = dataValues[i];
          const dvariables: string[] = s.split("=");
          switch (dvariables[0]) {
            case "reference_pol":
              reference_pol = dvariables[1];
              break;
            case "transactionId":
              transactionId = dvariables[1];
              break;
            case "lapTransactionState":
              transactionState = dvariables[1];
              break;
            default:
              break;
          }
        }

        const alert = this.alertCtrl.create({
          title: transactionState + "!",
          subTitle: 'Puedes hacer seguimiento de tu transacción con el número de referencia: ' + reference_pol,
          buttons: ['OK']
        });
        alert.present();
      }
    });

  }
}
