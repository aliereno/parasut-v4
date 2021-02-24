/*
 * Paraşüt - API V4
 * # GİRİŞ  ## API Hakkında  Paraşüt API'yi kullanmak veya görüşlerinizi bizimle paylaşmak isterseniz lütfen bizimle destek@parasut.com adresi üzerinden iletişime geçiniz.  API'yi kullanarak Paraşüt verilerine ulaşabilir ve kendi yazdığınız uygulamalar ile entegre edebilirsiniz. API vasıtasıyla Paraşüt Web arayüzü ile yapılan hemen her işlemi gerçekleştirebilirsiniz.   - API geliştirmesinde çoğunlukla JSONAPI (http://jsonapi.org/) standartlarına uymaya çalıştık.  - Dökümantasyon oluşturulmasında ise OpenAPI-Swagger 2.0 kullandık.  - API hizmetimizin `BASE_URL`i `https://api.parasut.com` şeklindedir.  - V4 endpointlerine ulaşmak için `https://api.parasut.com/v4` şeklinde kullanabilirsiniz.  ## Genel Bilgiler  - API metodlarına erişmek için baz URL olarak `https://api.parasut.com/v4/firma_no` adresi kullanılır.   - Bu yapıda kullanılan `firma_no` parametresi bilgisine erişilmek istenin firmanın Paraşüt veritabanındaki kayıt numarasıdır.   - Örneğin 115 numaralı firmanın müşteri/tedarikçi listesine erişmek için `https://api.parasut.com/v4/115/contacts` adresi kullanılır. - İstekleri gönderirken `Content-Type` header'ı olarak `application/json` veya `application/vnd.api+json` göndermelisiniz. - Yeni bir kayıt oluştururken **ilgili** kaydın `ID` parametresini boş göndermeli veya hiç göndermemelisiniz.   - Örnek: Satış faturası oluştururken `data->id` boş olmalı, ama `relationships->contact->data->id` dolu olmalı, çünkü gönderdiğiniz müşterinizin ID'si daha önceden elinizde bulunmalıdır. Aynı şekilde `relationships->details->data` içerisinde tanımladığınız ID'ler de boş olmalı, çünkü henüz fatura kalemi yaratmadınız. - API endpointlerine ulaşmak için, aldığınız `access_token`'ı sorgulara `Authorization` header'ı olarak `Bearer access_token` şeklinde göndermelisiniz. - Dakikada 60 adet istek gönderebilirsiniz.  # Authentication  <!-- ReDoc-Inject: <security-definitions> -->  Paraşüt API kimlik doğrulama için oAuth2 kullanmaktadır. Bu protokolü destekleyen istemci kütüphanelerini kullanarak oturum açabilir ve API'yi kullanabilirsiniz.  Gerekli CLIENT_ID, CLIENT_SECRET ve REDIRECT_URL bilgilerini almak için destek@parasut.com adresine mail atabilirsiniz.  Kimlik doğrulama işleminin başarılı olması durumunda bir adet kimlik jetonu (authentication token) ve bir adet de yenileme jetonu (refresh token) gönderilecektir. Kimlik jetonu 2 saat süreyle geçerlidir ve her istekte http başlık bilgilerinin içerisinde gönderilmelidir. Bu sürenin sonunda kimlik jetonu geçerliliğini yitirecektir ve yenileme jetonu kullanılarak tekrar üretilmesi gerekmektedir.  ## access_token almak:  access_token almanız için iki farklı seçenek bulunmaktadır.  Kullanım şeklinize bağlı olarak iki yöntemden birini tercih etmelisiniz.  ### 1. grant_type=authorization_code  Bu yöntemi kullanabilmek için öncelikle aşağıda belirtildiği gibi kullanıcıyı başarılı authentication işleminin ardından yönlendirmek istediğiniz `REDIRECT_URL`'i bize ulaşarak kayıt ettirmeniz gerekmektedir. `REDIRECT_URL` varsayılan olarak `urn:ietf:wg:oauth:2.0:oob` gelmektedir.  Size özel bir REDIRECT_URL tanımlamak isterseniz destek@parasut.com adresine mail atabilirsiniz.  1. Kullanıcıyı şu adrese yönlendirin:    ```   BASE_URL/oauth/authorize?client_id=CLIENT_ID&redirect_uri=REDIRECT_URL&response_type=code   ```  2. Oturum açmışsa ve uygulamayı kabul ederse, kullanıcı sizin tanımladığınız REDIRECT_URL'e şu şekilde gelmesi gerekiyor:   `REDIRECT_URL?code=xxxxxxx`  3. Burada size gelen \"code\" parametresi ile access token almalısınız.  ```bash curl -F grant_type=authorization_code \\ -F client_id=CLIENT_ID \\ -F client_secret=CLIENT_SECRET \\ -F code=RETURNED_CODE \\ -F redirect_uri=REDIRECT_URL \\ -X POST BASE_URL/oauth/token ```  ### 2. grant_type=password  E-posta ve şifre ile access_token almanız için aşağıdaki istekte size özel alanları doldurarak POST isteği atmanız gerekmektedir.  ```bash curl -F grant_type=password \\ -F client_id=CLIENT_ID \\ -F client_secret=CLIENT_SECRET \\ -F username=YOUREMAIL \\ -F password=YOURPASSWORD \\ -F redirect_uri=urn:ietf:wg:oauth:2.0:oob \\ -X POST BASE_URL/oauth/token ```  ### Sonuç  Her iki yöntem sonucunda size aşağıdaki gibi bir sonuç dönecektir:  ```json {  \"access_token\": \"XYZXYZXYZ\",  \"token_type\": \"bearer\",  \"expires_in\": 7200,  \"refresh_token\": \"ABCABCABC\" } ```  Burada dönen `access_token`'ı API endpointlerine ulaşmak için gönderdiğiniz sorgulara `Authorization` header'ı olarak `Bearer XYZXYZXYZ` şeklinde eklemeniz gerekiyor.   #### Refresh token ile yeni access_token alma örneği:  `access_token` geçerliliğini 2 saat içerisinde yitirdiği için `refresh_token` ile yeni token alabilirsiniz.  ```bash curl -F grant_type=refresh_token \\ -F client_id=CLIENT_ID \\ -F client_secret=CLIENT_SECRET \\ -F refresh_token=REFRESH_TOKEN \\ -X POST BASE_URL/oauth/token ```  `refresh_token` ile yeni bir `access_token` alırken aynı zamanda yeni bir `refresh_token` da almaktasınız. Dolayısıyla, daha sonra yeniden bir `access_token` alma isteğinizde size dönen yeni `refresh_token`ı kullanmalısınız.  # SIK KULLANILAN İŞLEMLER  ## Kullanıcı Bilgisi  `access_token` aldığınız kullanıcının genel bilgilerini görmek için [/me](/#operation/showMe) adresini kullanabilirsiniz.  ## Satış Faturası Oluşturma  Satış faturası oluşturmak için bir müşteri (`contact`) `id`'si ve bir veya birden fazla ürün (`product`) `id`'sine ihtiyacınız vardır.  ### Müşteri  ##### Yeni bir müşteri ile  Eğer ihtiyaç duyduğunuz müşteri bilgisi henüz yoksa, öncelikle müşteri oluşturmanız gereklidir. Bunun için [Müşteri oluşturma](/#operation/createContact) endpoint'ini kullanmalısınız. Başarılı bir şekilde müşteri oluşturulursa size dönecek olan yanıt ihtiyaç duyacağınız müşteri `id`'sini içerir.  ##### Mevcut bir müşteri ile  Eğer daha önceden zaten oluşturduğunuz bir müşteri ile ilişkili bir satış faturası oluşturacaksanız öncelikle o müşterinin `id`'sini öğrenmeniz gerekir. Bunun için [Müşteri listesi](/#operation/listContacts) endpoint'ini kullanabilirsiniz. Müşteri listesi endpoint'i isim, e-posta, vergi numarası gibi çeşitli filtreleri destekler. Bunları kullanarak aradığınız müşteriyi bulabilirsiniz.  ### Ürün  ##### Yeni bir ürün ile  Eğer ihtiyaç duyduğunuz ürün bilgisi henüz yoksa, öncelikle ürün oluşturmanız gereklidir. Bunun için [Ürün oluşturma](/#operation/createProduct) endpoint'ini kullanmalısınız. Başarılı bir şekilde ürün oluşturulursa size dönecek olan yanıt ihtiyaç duyacağınız ürün `id`'sini içerir.  ##### Mevcut bir ürün ile  Eğer daha önceden oluşturduğunuz bir ürünü kullanarak bir satış faturası oluşturacaksanız öncelikle o ürünün `id`'sini öğrenmeniz gerekir. Bunun için [Ürün listesi](/#operation/listProducts) endpoint'ini kullanabilirsiniz. Ürün listesi endpoint'i isim, kod gibi çeşitli filtreleri destekler. Bunları kullanarak aradığınız ürünü bulabilirsiniz.  ---  İhtiyaç duyduğunuz müşteri ve ürün `id`'lerini aldıktan sonra [Satış Faturası Oluşturma](/#operation/createSalesInvoice) endpoint'i ile satış faturası oluşturabilirsiniz. Endpoint'in tanımında sağ tarafta beklediğimiz veri şekli bulunmaktadır, aşağıdaki bilgileri verinin şekli ile kıyaslamak daha açıklayıcı olabilir.  Dikkat edilecek noktalar: * `relationships` altındaki `contact`'te bulunan `id` alanına müşteri `id`'sini girmeniz gereklidir. * `relationships` altındaki `details` kısmı bir listedir (`array`) ve fatura kalemlerini temsil eder. Bu listenin her elemanının ilişkili olduğu bir ürün vardır. Yani `details` altındaki her elemanın kendine ait bir `relationships` kısmı mevcuttur. Buradaki `product` `id` alanı üstteki ürün adımlarında elde ettiğiniz `id`'yi koymanız gereken yerdir.  ## Satış Faturasına Tahsilat Ekleme  [Tahsilat ekleme](/#operation/paySalesInvoice) kısmındaki ilgili alanları doldurarak satış faturasına tahsilat ekleyebilirsiniz.  ## Satış Faturasının Tahsilatını Silme  Bir satış faturasının tahsilatını silmek aslında o tahsilatı oluşturan para akış işlemini silmek demektir. Bir işlemi silmeden önce o işlemin `id`'sine ihtiyacınız vardır.  Bir satış faturasına ait tahsilatları almak için [Satış faturası bilgilerini alma (show)](/#operation/showSalesInvoice) endpoint'ine istek atarken `?include=payments` parametresini de eklemelisiniz. Bu size satış faturası bilgilerine ilave olarak tahsilatları da verir.  Tahsilatlar ile birlikte o tahsilatları oluşturan işlemleri de almak için yine aynı endpoint'e `?include=payments.transaction` parametresini ekleyerek istek yapmanız gerekir. Bu size hem satış faturası bilgilerini, hem tahsilat bilgilerini hem de tahsilatı oluşturan işlemlerin bilgilerini verir.  `?include=payments.transaction` parametresini kullanarak yaptığınız istek ile işlem (`transaction`) `id`'sini aldıktan sonra [işlem silme](/#operation/deleteTransaction) endpoint'inde bu `id`'yi kullanarak silme işlemini yapabilirsiniz.  ## Satış Faturası Resmileştirme  Oluşturduğunuz bir satış faturası varsa onu e-Arşiv veya e-Fatura olarak resmileştirmek için aşağıdakileri yapmanız gereklidir.  1. Öncelikle müşterinizin e-Fatura kullanıcısı olup olmadığını öğrenmelisiniz. Bunun için müşterinizin e-Fatura gelen kutusu olup olmadığına bakmak gereklidir. [e-Fatura gelen kutusu](/#operation/listEInvoiceInboxes) endpoint'ine müşterinin vkn'sini kullanarak bir istek yaptığınızda eğer bir gelen kutusu olduğuna dair yanıt alıyorsanız müşteri e-Fatura kullanıcısıdır. Müşteri e-Fatura kullanıcısı ise resmileştirme için e-Fatura oluşturmak, e-Fatura kullanıcısı değilse e-Arşiv oluşturmak gereklidir. İhracat Faturaları her zaman e-Fatura olarak resmileştirilmelidir.  Oluşturduğunuz e-Fatura, e-Arşiv ve e-Smm’nin düzenleme tarihi e-Fatura/e-Smm’ye geçiş sağladığınız aktivasyon tarihinden sonra olmalıdır. Aynı zamanda oluşturduğunuz e-Fatura’nın düzenleme tarihi alıcının etiketi kullanmaya başladığı tarihten de önce olamaz. Alıcının etiketi kullanmaya başladığı tarihi e-Fatura gelen kutusunu çekerek görüntüleyebilirsiniz.  2. e-Fatura / e-Arşiv / e-Smm oluşturma:    * Önceki adımda müşterinin e-Fatura kullanıcısı olduğu öğrenildiyse,  [e-Fatura oluşturma endpoint'i](/#operation/createEInvoice) kullanılarak e-Fatura oluşturmak gereklidir.    * Önceki adımda müşterinin e-Arşiv kullanıcısı olduğu öğrenildiyse,  [e-Arşiv oluşturma endpoint'i](/#operation/createEArchive) kullanılarak e-Arşiv oluşturmak gereklidir.    * Eğer makbuz kullanıcısı iseniz, [e-Smm oluşturma endpoint'ini](/#operation/createESmm) kullanarak e-Smm oluşturmanız gereklidir.     e-Fatura / e-Arşiv / e-Smm oluşturma işlemi synchronous değildir. Yani istek arka planda yerine getirilir. Bu yüzden e-Fatura / e-Arşiv / e-Smm oluşturma endpoint'leri cevap olarak oluşturma işleminin durumunu takip edebileceğiniz bir işlem `id`'si döner. Bu işlem `id`'sini [sorgulama](/#tag/TrackableJobs) endpoint'inde belirli aralıklarla kullanıp oluşturma işleminin durumunu takip etmeniz gerekmektedir. İşlem durumu ile ilgili aşağıdaki yanıtları alabilirsiniz:    * `status: \"pending\"` işlemin sırada olduğunu, henüz başlamadığını gösterir.    * `status: \"running\"` işlemin yapılmakta olduğunu ancak henüz sonuçlanmadığını gösterir.    * `status: \"error\"` işlemde bir hata olduğu anlamına gelir. Dönen yanıtta hata mesajını inceleyebilirsiniz.    * `status: \"done\"` işlemin başarılı bir şekilde sonuçlandığını gösterir. 3. e-Fatura / e-Arşiv / e-Smm işleminin başarılı bir şekilde sonuçlandığını gördükten sonra e-Fatura / e-Arşiv / e-Smm bilgilerini almak için [Satış faturası bilgilerini alma (show)](/#operation/showSalesInvoice) endpoint'ine `?include=active_e_document` parametresi ile istek yapmanız gerekmektedir. Buradan sıradaki adımda ihtiyaç duyacağınız e-Fatura / e-Arşiv / e-Smm `id`'lerini ve başka bilgileri de alabilirsiniz. 4. e-Fatura / e-Arşiv / e-Smm başarıyla resmileştirildikten sonra müşterilerinize PDF olarak göndermek isteyebilirsiniz. Bunun için:    * e-Arşiv için, 4. adımda elde edeceğiniz e-Arşiv `id`'sini kullanarak [e-Arşiv PDF](/#operation/showEArchivePdf) endpoint'ine istek atabilirsiniz. Bu endpoint PDF henüz yoksa boş bir yanıt ile birlikte 204 döner. Yani 204 almayana kadar belirli aralıklarla bu endpoint'e istek yapmanız gerekmektedir. Geçerli yanıt aldığınızda size dönecek olan PDF URL 1 saat için geçerlidir. Bu yüzden bu linki direk olarak müşterinizle **paylaşmamalısınız**. İndirip müşterinize kendiniz göndermelisiniz.    * e-Arşiv için anlatılan senaryonun aynısı e-Fatura için de geçerlidir. Tek farklı kısım isteği yapacağınız endpoint'tir: [e-Fatura PDF](/#operation/showEInvoicePdf)    * e-Arşiv için anlatılan senaryonun aynısı e-Smm için de geçerlidir. Tek farklı kısım isteği yapacağınız endpoint'tir: [e-Smm PDF](/#operation/showESmmPdf)  ## İrsaliye Oluşturma  İrsaliye oluşturmak için bir müşteri/tedarikçi (`contact`) `id`'si ve bir veya birden fazla ürün (`product`) `id`'sine ihtiyacınız vardır.  ### Müşteri/Tedarikçi  ##### Yeni bir müşteri/tedarikçi ile  Eğer ihtiyaç duyduğunuz müşteri/tedarikçi bilgisi henüz yoksa, öncelikle müşteri/tedarikçi oluşturmanız gereklidir. Bunun için [Müşteri/Tedarikçi oluşturma](/#operation/createContact) endpoint'ini kullanmalısınız. Başarılı bir şekilde müşteri/tedarikçi oluşturulursa size dönecek olan yanıt ihtiyaç duyacağınız müşteri/tedarikçi `id`'sini içerir.  ##### Mevcut bir müşteri/tedarikçi ile  Eğer daha önceden zaten oluşturduğunuz bir müşteri/tedarikçi ile ilişkili bir irsaliye oluşturacaksanız öncelikle o müşteri/tedarikçinin `id`'sini öğrenmeniz gerekir. Bunun için [Müşteri/tedarikçi listesi](/#operation/listContacts) endpoint'ini kullanabilirsiniz. Müşteri/tedarikçi listesi endpoint'i isim, e-posta, vergi numarası gibi çeşitli filtreleri destekler. Bunları kullanarak aradığınız müşteri/tedarikçiyi bulabilirsiniz.  ### Ürün  ##### Yeni bir ürün ile  Eğer ihtiyaç duyduğunuz ürün bilgisi henüz yoksa, öncelikle ürün oluşturmanız gereklidir. Bunun için [Ürün oluşturma](/#operation/createProduct) endpoint'ini kullanmalısınız. Başarılı bir şekilde ürün oluşturulursa size dönecek olan yanıt ihtiyaç duyacağınız ürün `id`'sini içerir.  ##### Mevcut bir ürün ile  Eğer daha önceden oluşturduğunuz bir ürünü kullanarak bir irsaliye oluşturacaksanız öncelikle o ürünün `id`'sini öğrenmeniz gerekir. Bunun için [Ürün listesi](/#operation/listProducts) endpoint'ini kullanabilirsiniz. Ürün listesi endpoint'i isim, kod gibi çeşitli filtreleri destekler. Bunları kullanarak aradığınız ürünü bulabilirsiniz.  ---  İhtiyaç duyduğunuz müşteri/tedarikçi ve ürün `id`'lerini aldıktan sonra [İrsaliye Oluşturma](/#operation/createShipmentDocument) endpoint'i ile irsaliye oluşturabilirsiniz. Endpoint'in tanımında sağ tarafta beklediğimiz veri şekli bulunmaktadır, aşağıdaki bilgileri verinin şekli ile kıyaslamak daha açıklayıcı olabilir.  Dikkat edilecek noktalar: * `relationships` altındaki `contact`'te bulunan `id` alanına müşteri/tedarikçi `id`'sini girmeniz gereklidir. * `relationships` altındaki `stock_movements` kısmı bir listedir (`array`) ve irsaliye kalemlerini temsil eder. Bu listenin her elemanının ilişkili olduğu bir ürün vardır. Yani `stock_movements` altındaki her elemanın kendine ait bir `relationships` kısmı mevcuttur. Buradaki `product` `id` alanı üstteki ürün adımlarında elde ettiğiniz `id`'yi koymanız gereken yerdir. 
 *
 * OpenAPI spec version: 4.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.18
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.parasut) {
      root.parasut = {};
    }
    root.parasut.PurchaseBillAttributes = factory(root.parasut.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';

  /**
   * The PurchaseBillAttributes model module.
   * @module model/PurchaseBillAttributes
   * @version 4.0.0
   */

  /**
   * Constructs a new <code>PurchaseBillAttributes</code>.
   * @alias module:model/PurchaseBillAttributes
   * @class
   * @param totalVat {Number} 
   * @param itemType {module:model/PurchaseBillAttributes.ItemTypeEnum} 
   * @param issueDate {Date} 
   * @param dueDate {Date} 
   * @param currency {module:model/PurchaseBillAttributes.CurrencyEnum} 
   * @param netTotal {Number} 
   */
  var exports = function(totalVat, itemType, issueDate, dueDate, currency, netTotal) {
    this.totalVat = totalVat;
    this.itemType = itemType;
    this.issueDate = issueDate;
    this.dueDate = dueDate;
    this.currency = currency;
    this.netTotal = netTotal;
  };

  /**
   * Constructs a <code>PurchaseBillAttributes</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PurchaseBillAttributes} obj Optional instance to populate.
   * @return {module:model/PurchaseBillAttributes} The populated <code>PurchaseBillAttributes</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      if (data.hasOwnProperty('archived'))
        obj.archived = ApiClient.convertToType(data['archived'], 'Boolean');
      if (data.hasOwnProperty('total_paid'))
        obj.totalPaid = ApiClient.convertToType(data['total_paid'], 'Number');
      if (data.hasOwnProperty('gross_total'))
        obj.grossTotal = ApiClient.convertToType(data['gross_total'], 'Number');
      if (data.hasOwnProperty('total_excise_duty'))
        obj.totalExciseDuty = ApiClient.convertToType(data['total_excise_duty'], 'Number');
      if (data.hasOwnProperty('total_communications_tax'))
        obj.totalCommunicationsTax = ApiClient.convertToType(data['total_communications_tax'], 'Number');
      if (data.hasOwnProperty('total_vat'))
        obj.totalVat = ApiClient.convertToType(data['total_vat'], 'Number');
      if (data.hasOwnProperty('total_discount'))
        obj.totalDiscount = ApiClient.convertToType(data['total_discount'], 'Number');
      if (data.hasOwnProperty('total_invoice_discount'))
        obj.totalInvoiceDiscount = ApiClient.convertToType(data['total_invoice_discount'], 'Number');
      if (data.hasOwnProperty('remaining'))
        obj.remaining = ApiClient.convertToType(data['remaining'], 'Number');
      if (data.hasOwnProperty('remaining_in_trl'))
        obj.remainingInTrl = ApiClient.convertToType(data['remaining_in_trl'], 'Number');
      if (data.hasOwnProperty('payment_status'))
        obj.paymentStatus = ApiClient.convertToType(data['payment_status'], 'String');
      if (data.hasOwnProperty('is_detailed'))
        obj.isDetailed = ApiClient.convertToType(data['is_detailed'], 'Boolean');
      if (data.hasOwnProperty('sharings_count'))
        obj.sharingsCount = ApiClient.convertToType(data['sharings_count'], 'Number');
      if (data.hasOwnProperty('e_invoices_count'))
        obj.eInvoicesCount = ApiClient.convertToType(data['e_invoices_count'], 'Number');
      if (data.hasOwnProperty('remaining_reimbursement'))
        obj.remainingReimbursement = ApiClient.convertToType(data['remaining_reimbursement'], 'Number');
      if (data.hasOwnProperty('remaining_reimbursement_in_trl'))
        obj.remainingReimbursementInTrl = ApiClient.convertToType(data['remaining_reimbursement_in_trl'], 'Number');
      if (data.hasOwnProperty('created_at'))
        obj.createdAt = ApiClient.convertToType(data['created_at'], 'Date');
      if (data.hasOwnProperty('updated_at'))
        obj.updatedAt = ApiClient.convertToType(data['updated_at'], 'Date');
      if (data.hasOwnProperty('item_type'))
        obj.itemType = ApiClient.convertToType(data['item_type'], 'String');
      if (data.hasOwnProperty('description'))
        obj.description = ApiClient.convertToType(data['description'], 'String');
      if (data.hasOwnProperty('issue_date'))
        obj.issueDate = ApiClient.convertToType(data['issue_date'], 'Date');
      if (data.hasOwnProperty('due_date'))
        obj.dueDate = ApiClient.convertToType(data['due_date'], 'Date');
      if (data.hasOwnProperty('invoice_no'))
        obj.invoiceNo = ApiClient.convertToType(data['invoice_no'], 'String');
      if (data.hasOwnProperty('currency'))
        obj.currency = ApiClient.convertToType(data['currency'], 'String');
      if (data.hasOwnProperty('exchange_rate'))
        obj.exchangeRate = ApiClient.convertToType(data['exchange_rate'], 'Number');
      if (data.hasOwnProperty('net_total'))
        obj.netTotal = ApiClient.convertToType(data['net_total'], 'Number');
      if (data.hasOwnProperty('withholding_rate'))
        obj.withholdingRate = ApiClient.convertToType(data['withholding_rate'], 'Number');
      if (data.hasOwnProperty('vat_withholding_rate'))
        obj.vatWithholdingRate = ApiClient.convertToType(data['vat_withholding_rate'], 'Number');
      if (data.hasOwnProperty('invoice_discount_type'))
        obj.invoiceDiscountType = ApiClient.convertToType(data['invoice_discount_type'], 'String');
      if (data.hasOwnProperty('invoice_discount'))
        obj.invoiceDiscount = ApiClient.convertToType(data['invoice_discount'], 'Number');
    }
    return obj;
  }

  /**
   * @member {Boolean} archived
   */
  exports.prototype.archived = undefined;

  /**
   * @member {Number} totalPaid
   */
  exports.prototype.totalPaid = undefined;

  /**
   * @member {Number} grossTotal
   */
  exports.prototype.grossTotal = undefined;

  /**
   * @member {Number} totalExciseDuty
   */
  exports.prototype.totalExciseDuty = undefined;

  /**
   * @member {Number} totalCommunicationsTax
   */
  exports.prototype.totalCommunicationsTax = undefined;

  /**
   * @member {Number} totalVat
   */
  exports.prototype.totalVat = undefined;

  /**
   * @member {Number} totalDiscount
   */
  exports.prototype.totalDiscount = undefined;

  /**
   * @member {Number} totalInvoiceDiscount
   */
  exports.prototype.totalInvoiceDiscount = undefined;

  /**
   * @member {Number} remaining
   */
  exports.prototype.remaining = undefined;

  /**
   * @member {Number} remainingInTrl
   */
  exports.prototype.remainingInTrl = undefined;

  /**
   * @member {module:model/PurchaseBillAttributes.PaymentStatusEnum} paymentStatus
   */
  exports.prototype.paymentStatus = undefined;

  /**
   * @member {Boolean} isDetailed
   */
  exports.prototype.isDetailed = undefined;

  /**
   * @member {Number} sharingsCount
   */
  exports.prototype.sharingsCount = undefined;

  /**
   * @member {Number} eInvoicesCount
   */
  exports.prototype.eInvoicesCount = undefined;

  /**
   * @member {Number} remainingReimbursement
   */
  exports.prototype.remainingReimbursement = undefined;

  /**
   * @member {Number} remainingReimbursementInTrl
   */
  exports.prototype.remainingReimbursementInTrl = undefined;

  /**
   * @member {Date} createdAt
   */
  exports.prototype.createdAt = undefined;

  /**
   * @member {Date} updatedAt
   */
  exports.prototype.updatedAt = undefined;

  /**
   * @member {module:model/PurchaseBillAttributes.ItemTypeEnum} itemType
   */
  exports.prototype.itemType = undefined;

  /**
   * @member {String} description
   */
  exports.prototype.description = undefined;

  /**
   * @member {Date} issueDate
   */
  exports.prototype.issueDate = undefined;

  /**
   * @member {Date} dueDate
   */
  exports.prototype.dueDate = undefined;

  /**
   * @member {String} invoiceNo
   */
  exports.prototype.invoiceNo = undefined;

  /**
   * @member {module:model/PurchaseBillAttributes.CurrencyEnum} currency
   */
  exports.prototype.currency = undefined;

  /**
   * @member {Number} exchangeRate
   */
  exports.prototype.exchangeRate = undefined;

  /**
   * @member {Number} netTotal
   */
  exports.prototype.netTotal = undefined;

  /**
   * @member {Number} withholdingRate
   */
  exports.prototype.withholdingRate = undefined;

  /**
   * @member {Number} vatWithholdingRate
   */
  exports.prototype.vatWithholdingRate = undefined;

  /**
   * @member {module:model/PurchaseBillAttributes.InvoiceDiscountTypeEnum} invoiceDiscountType
   */
  exports.prototype.invoiceDiscountType = undefined;

  /**
   * @member {Number} invoiceDiscount
   */
  exports.prototype.invoiceDiscount = undefined;



  /**
   * Allowed values for the <code>paymentStatus</code> property.
   * @enum {String}
   * @readonly
   */
  exports.PaymentStatusEnum = {
    /**
     * value: "paid"
     * @const
     */
    paid: "paid",

    /**
     * value: "overdue"
     * @const
     */
    overdue: "overdue",

    /**
     * value: "unpaid"
     * @const
     */
    unpaid: "unpaid",

    /**
     * value: "partially_paid"
     * @const
     */
    partiallyPaid: "partially_paid"
  };


  /**
   * Allowed values for the <code>itemType</code> property.
   * @enum {String}
   * @readonly
   */
  exports.ItemTypeEnum = {
    /**
     * value: "purchase_bill"
     * @const
     */
    purchaseBill: "purchase_bill",

    /**
     * value: "cancelled"
     * @const
     */
    cancelled: "cancelled",

    /**
     * value: "recurring_purchase_bill"
     * @const
     */
    recurringPurchaseBill: "recurring_purchase_bill",

    /**
     * value: "refund"
     * @const
     */
    refund: "refund"
  };


  /**
   * Allowed values for the <code>currency</code> property.
   * @enum {String}
   * @readonly
   */
  exports.CurrencyEnum = {
    /**
     * value: "TRL"
     * @const
     */
    TRL: "TRL",

    /**
     * value: "USD"
     * @const
     */
    USD: "USD",

    /**
     * value: "EUR"
     * @const
     */
    EUR: "EUR",

    /**
     * value: "GBP"
     * @const
     */
    GBP: "GBP"
  };


  /**
   * Allowed values for the <code>invoiceDiscountType</code> property.
   * @enum {String}
   * @readonly
   */
  exports.InvoiceDiscountTypeEnum = {
    /**
     * value: "percentage"
     * @const
     */
    percentage: "percentage",

    /**
     * value: "amount"
     * @const
     */
    amount: "amount"
  };

  return exports;

}));