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
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.parasut);
  }
}(this, function(expect, parasut) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new parasut.SalesInvoicesApi();
  });

  describe('(package)', function() {
    describe('SalesInvoicesApi', function() {
      describe('archiveSalesInvoice', function() {
        it('should call archiveSalesInvoice successfully', function(done) {
          // TODO: uncomment, update parameter values for archiveSalesInvoice call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var opts = {};
          opts.include = "include_example";

          instance.archiveSalesInvoice(companyId, id, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse20112);
            expect(data.data).to.be.a(parasut.SalesInvoice);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("sales_invoices");
              expect(data.data.attributes).to.be.a(parasut.SalesInvoiceAttributes);
                    expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.invoiceNo).to.be.a('string');
                expect(data.data.attributes.invoiceNo).to.be("");
                expect(data.data.attributes.netTotal).to.be.a('number');
                expect(data.data.attributes.netTotal).to.be();
                expect(data.data.attributes.grossTotal).to.be.a('number');
                expect(data.data.attributes.grossTotal).to.be();
                expect(data.data.attributes.withholding).to.be.a('number');
                expect(data.data.attributes.withholding).to.be();
                expect(data.data.attributes.totalExciseDuty).to.be.a('number');
                expect(data.data.attributes.totalExciseDuty).to.be();
                expect(data.data.attributes.totalCommunicationsTax).to.be.a('number');
                expect(data.data.attributes.totalCommunicationsTax).to.be();
                expect(data.data.attributes.totalVat).to.be.a('number');
                expect(data.data.attributes.totalVat).to.be();
                expect(data.data.attributes.vatWithholding).to.be.a('number');
                expect(data.data.attributes.vatWithholding).to.be();
                expect(data.data.attributes.totalDiscount).to.be.a('number');
                expect(data.data.attributes.totalDiscount).to.be();
                expect(data.data.attributes.totalInvoiceDiscount).to.be.a('number');
                expect(data.data.attributes.totalInvoiceDiscount).to.be();
                expect(data.data.attributes.beforeTaxesTotal).to.be.a('number');
                expect(data.data.attributes.beforeTaxesTotal).to.be();
                expect(data.data.attributes.remaining).to.be.a('number');
                expect(data.data.attributes.remaining).to.be();
                expect(data.data.attributes.remainingInTrl).to.be.a('number');
                expect(data.data.attributes.remainingInTrl).to.be();
                expect(data.data.attributes.paymentStatus).to.be.a('string');
                expect(data.data.attributes.paymentStatus).to.be("paid");
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.itemType).to.be.a('string');
                expect(data.data.attributes.itemType).to.be("invoice");
                expect(data.data.attributes.description).to.be.a('string');
                expect(data.data.attributes.description).to.be("");
                expect(data.data.attributes.issueDate).to.be.a(Date);
                expect(data.data.attributes.issueDate).to.be(new Date());
                expect(data.data.attributes.dueDate).to.be.a(Date);
                expect(data.data.attributes.dueDate).to.be(new Date());
                expect(data.data.attributes.invoiceSeries).to.be.a('string');
                expect(data.data.attributes.invoiceSeries).to.be("");
                expect(data.data.attributes.invoiceId).to.be.a('number');
                expect(data.data.attributes.invoiceId).to.be(0);
                expect(data.data.attributes.currency).to.be.a('string');
                expect(data.data.attributes.currency).to.be("TRL");
                expect(data.data.attributes.exchangeRate).to.be.a('number');
                expect(data.data.attributes.exchangeRate).to.be();
                expect(data.data.attributes.withholdingRate).to.be.a('number');
                expect(data.data.attributes.withholdingRate).to.be();
                expect(data.data.attributes.vatWithholdingRate).to.be.a('number');
                expect(data.data.attributes.vatWithholdingRate).to.be();
                expect(data.data.attributes.invoiceDiscountType).to.be.a('string');
                expect(data.data.attributes.invoiceDiscountType).to.be("percentage");
                expect(data.data.attributes.invoiceDiscount).to.be.a('number');
                expect(data.data.attributes.invoiceDiscount).to.be();
                expect(data.data.attributes.billingAddress).to.be.a('string');
                expect(data.data.attributes.billingAddress).to.be("");
                expect(data.data.attributes.billingPhone).to.be.a('string');
                expect(data.data.attributes.billingPhone).to.be("");
                expect(data.data.attributes.billingFax).to.be.a('string');
                expect(data.data.attributes.billingFax).to.be("");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.orderNo).to.be.a('string');
                expect(data.data.attributes.orderNo).to.be("");
                expect(data.data.attributes.orderDate).to.be.a(Date);
                expect(data.data.attributes.orderDate).to.be(new Date());
                expect(data.data.attributes.shipmentAddres).to.be.a('string');
                expect(data.data.attributes.shipmentAddres).to.be("");
                expect(data.data.attributes.shipmentIncluded).to.be.a('boolean');
                expect(data.data.attributes.shipmentIncluded).to.be(false);
                expect(data.data.attributes.cashSale).to.be.a('boolean');
                expect(data.data.attributes.cashSale).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.SalesInvoiceRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contact).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier);
                      expect(data.data.relationships.contact.data).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData);
                        expect(data.data.relationships.contact.data.id).to.be.a('string');
                    expect(data.data.relationships.contact.data.id).to.be("");
                    expect(data.data.relationships.contact.data.type).to.be.a('string');
                    expect(data.data.relationships.contact.data.type).to.be("contacts");
                expect(data.data.relationships.details).to.be.a(parasut.SalesInvoiceRelationshipsDetails);
                      {
                    let dataCtr = data.data.relationships.details.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsDetailsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sales_invoice_details");
      
                            }
                  }
                expect(data.data.relationships.payments).to.be.a(parasut.PurchaseBillRelationshipsPayments);
                      {
                    let dataCtr = data.data.relationships.payments.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.PurchaseBillRelationshipsPaymentsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("payments");
      
                            }
                  }
                expect(data.data.relationships.tags).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTags);
                      {
                    let dataCtr = data.data.relationships.tags.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTagsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("tags");
      
                            }
                  }
                expect(data.data.relationships.salesOffer).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer);
                      expect(data.data.relationships.salesOffer.data).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData);
                        expect(data.data.relationships.salesOffer.data.id).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.id).to.be("");
                    expect(data.data.relationships.salesOffer.data.type).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.type).to.be("sales_offers");
                expect(data.data.relationships.sharings).to.be.a(parasut.SalesInvoiceRelationshipsSharings);
                      {
                    let dataCtr = data.data.relationships.sharings.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsSharingsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sharings");
      
                            }
                  }
                expect(data.data.relationships.recurrencePlan).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlan);
                      expect(data.data.relationships.recurrencePlan.data).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlanData);
                        expect(data.data.relationships.recurrencePlan.data.id).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.id).to.be("");
                    expect(data.data.relationships.recurrencePlan.data.type).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.type).to.be("recurrence_plans");
                expect(data.data.relationships.activeEDocument).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocument);
                      expect(data.data.relationships.activeEDocument.data).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocumentData);
                        expect(data.data.relationships.activeEDocument.data.id).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.id).to.be("");
                    expect(data.data.relationships.activeEDocument.data.type).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.type).to.be("e_archives");
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse20014Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("item_categories");
                expect(data.attributes).to.be.a(Object);
                expect(data.attributes).to.be();
                expect(data.relationships).to.be.a(Object);
                expect(data.relationships).to.be();

                      }
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('cancelSalesInvoice', function() {
        it('should call cancelSalesInvoice successfully', function(done) {
          // TODO: uncomment, update parameter values for cancelSalesInvoice call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var opts = {};
          opts.include = "include_example";

          instance.cancelSalesInvoice(companyId, id, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse20112);
            expect(data.data).to.be.a(parasut.SalesInvoice);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("sales_invoices");
              expect(data.data.attributes).to.be.a(parasut.SalesInvoiceAttributes);
                    expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.invoiceNo).to.be.a('string');
                expect(data.data.attributes.invoiceNo).to.be("");
                expect(data.data.attributes.netTotal).to.be.a('number');
                expect(data.data.attributes.netTotal).to.be();
                expect(data.data.attributes.grossTotal).to.be.a('number');
                expect(data.data.attributes.grossTotal).to.be();
                expect(data.data.attributes.withholding).to.be.a('number');
                expect(data.data.attributes.withholding).to.be();
                expect(data.data.attributes.totalExciseDuty).to.be.a('number');
                expect(data.data.attributes.totalExciseDuty).to.be();
                expect(data.data.attributes.totalCommunicationsTax).to.be.a('number');
                expect(data.data.attributes.totalCommunicationsTax).to.be();
                expect(data.data.attributes.totalVat).to.be.a('number');
                expect(data.data.attributes.totalVat).to.be();
                expect(data.data.attributes.vatWithholding).to.be.a('number');
                expect(data.data.attributes.vatWithholding).to.be();
                expect(data.data.attributes.totalDiscount).to.be.a('number');
                expect(data.data.attributes.totalDiscount).to.be();
                expect(data.data.attributes.totalInvoiceDiscount).to.be.a('number');
                expect(data.data.attributes.totalInvoiceDiscount).to.be();
                expect(data.data.attributes.beforeTaxesTotal).to.be.a('number');
                expect(data.data.attributes.beforeTaxesTotal).to.be();
                expect(data.data.attributes.remaining).to.be.a('number');
                expect(data.data.attributes.remaining).to.be();
                expect(data.data.attributes.remainingInTrl).to.be.a('number');
                expect(data.data.attributes.remainingInTrl).to.be();
                expect(data.data.attributes.paymentStatus).to.be.a('string');
                expect(data.data.attributes.paymentStatus).to.be("paid");
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.itemType).to.be.a('string');
                expect(data.data.attributes.itemType).to.be("invoice");
                expect(data.data.attributes.description).to.be.a('string');
                expect(data.data.attributes.description).to.be("");
                expect(data.data.attributes.issueDate).to.be.a(Date);
                expect(data.data.attributes.issueDate).to.be(new Date());
                expect(data.data.attributes.dueDate).to.be.a(Date);
                expect(data.data.attributes.dueDate).to.be(new Date());
                expect(data.data.attributes.invoiceSeries).to.be.a('string');
                expect(data.data.attributes.invoiceSeries).to.be("");
                expect(data.data.attributes.invoiceId).to.be.a('number');
                expect(data.data.attributes.invoiceId).to.be(0);
                expect(data.data.attributes.currency).to.be.a('string');
                expect(data.data.attributes.currency).to.be("TRL");
                expect(data.data.attributes.exchangeRate).to.be.a('number');
                expect(data.data.attributes.exchangeRate).to.be();
                expect(data.data.attributes.withholdingRate).to.be.a('number');
                expect(data.data.attributes.withholdingRate).to.be();
                expect(data.data.attributes.vatWithholdingRate).to.be.a('number');
                expect(data.data.attributes.vatWithholdingRate).to.be();
                expect(data.data.attributes.invoiceDiscountType).to.be.a('string');
                expect(data.data.attributes.invoiceDiscountType).to.be("percentage");
                expect(data.data.attributes.invoiceDiscount).to.be.a('number');
                expect(data.data.attributes.invoiceDiscount).to.be();
                expect(data.data.attributes.billingAddress).to.be.a('string');
                expect(data.data.attributes.billingAddress).to.be("");
                expect(data.data.attributes.billingPhone).to.be.a('string');
                expect(data.data.attributes.billingPhone).to.be("");
                expect(data.data.attributes.billingFax).to.be.a('string');
                expect(data.data.attributes.billingFax).to.be("");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.orderNo).to.be.a('string');
                expect(data.data.attributes.orderNo).to.be("");
                expect(data.data.attributes.orderDate).to.be.a(Date);
                expect(data.data.attributes.orderDate).to.be(new Date());
                expect(data.data.attributes.shipmentAddres).to.be.a('string');
                expect(data.data.attributes.shipmentAddres).to.be("");
                expect(data.data.attributes.shipmentIncluded).to.be.a('boolean');
                expect(data.data.attributes.shipmentIncluded).to.be(false);
                expect(data.data.attributes.cashSale).to.be.a('boolean');
                expect(data.data.attributes.cashSale).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.SalesInvoiceRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contact).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier);
                      expect(data.data.relationships.contact.data).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData);
                        expect(data.data.relationships.contact.data.id).to.be.a('string');
                    expect(data.data.relationships.contact.data.id).to.be("");
                    expect(data.data.relationships.contact.data.type).to.be.a('string');
                    expect(data.data.relationships.contact.data.type).to.be("contacts");
                expect(data.data.relationships.details).to.be.a(parasut.SalesInvoiceRelationshipsDetails);
                      {
                    let dataCtr = data.data.relationships.details.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsDetailsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sales_invoice_details");
      
                            }
                  }
                expect(data.data.relationships.payments).to.be.a(parasut.PurchaseBillRelationshipsPayments);
                      {
                    let dataCtr = data.data.relationships.payments.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.PurchaseBillRelationshipsPaymentsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("payments");
      
                            }
                  }
                expect(data.data.relationships.tags).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTags);
                      {
                    let dataCtr = data.data.relationships.tags.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTagsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("tags");
      
                            }
                  }
                expect(data.data.relationships.salesOffer).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer);
                      expect(data.data.relationships.salesOffer.data).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData);
                        expect(data.data.relationships.salesOffer.data.id).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.id).to.be("");
                    expect(data.data.relationships.salesOffer.data.type).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.type).to.be("sales_offers");
                expect(data.data.relationships.sharings).to.be.a(parasut.SalesInvoiceRelationshipsSharings);
                      {
                    let dataCtr = data.data.relationships.sharings.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsSharingsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sharings");
      
                            }
                  }
                expect(data.data.relationships.recurrencePlan).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlan);
                      expect(data.data.relationships.recurrencePlan.data).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlanData);
                        expect(data.data.relationships.recurrencePlan.data.id).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.id).to.be("");
                    expect(data.data.relationships.recurrencePlan.data.type).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.type).to.be("recurrence_plans");
                expect(data.data.relationships.activeEDocument).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocument);
                      expect(data.data.relationships.activeEDocument.data).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocumentData);
                        expect(data.data.relationships.activeEDocument.data.id).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.id).to.be("");
                    expect(data.data.relationships.activeEDocument.data.type).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.type).to.be("e_archives");
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse20014Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("item_categories");
                expect(data.attributes).to.be.a(Object);
                expect(data.attributes).to.be();
                expect(data.relationships).to.be.a(Object);
                expect(data.relationships).to.be();

                      }
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('convertEstimateToInvoice', function() {
        it('should call convertEstimateToInvoice successfully', function(done) {
          // TODO: uncomment, update parameter values for convertEstimateToInvoice call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var salesInvoiceForm = new parasut.SalesInvoiceForm2();
          salesInvoiceForm.data = new parasut.CompanyIdsalesInvoicesidconvertToInvoiceData();
          salesInvoiceForm.data.id = "";
          salesInvoiceForm.data.type = "sales_invoices";
          salesInvoiceForm.data.attributes = new parasut.SalesInvoiceAttributes();
          salesInvoiceForm.data.attributes.itemType = "invoice";
          salesInvoiceForm.data.attributes.description = "";
          salesInvoiceForm.data.attributes.issueDate = new Date();
          salesInvoiceForm.data.attributes.dueDate = new Date();
          salesInvoiceForm.data.attributes.invoiceSeries = "";
          salesInvoiceForm.data.attributes.invoiceId = 0;
          salesInvoiceForm.data.attributes.currency = "TRL";
          salesInvoiceForm.data.attributes.exchangeRate = ;
          salesInvoiceForm.data.attributes.withholdingRate = ;
          salesInvoiceForm.data.attributes.vatWithholdingRate = ;
          salesInvoiceForm.data.attributes.invoiceDiscountType = "percentage";
          salesInvoiceForm.data.attributes.invoiceDiscount = ;
          salesInvoiceForm.data.attributes.billingAddress = "";
          salesInvoiceForm.data.attributes.billingPhone = "";
          salesInvoiceForm.data.attributes.billingFax = "";
          salesInvoiceForm.data.attributes.taxOffice = "";
          salesInvoiceForm.data.attributes.taxNumber = "";
          salesInvoiceForm.data.attributes.country = "";
          salesInvoiceForm.data.attributes.city = "";
          salesInvoiceForm.data.attributes.district = "";
          salesInvoiceForm.data.attributes.isAbroad = false;
          salesInvoiceForm.data.attributes.orderNo = "";
          salesInvoiceForm.data.attributes.orderDate = new Date();
          salesInvoiceForm.data.attributes.shipmentAddres = "";
          salesInvoiceForm.data.attributes.shipmentIncluded = false;
          salesInvoiceForm.data.attributes.cashSale = false;
          salesInvoiceForm.data.relationships = new parasut.CompanyIdsalesInvoicesDataRelationships();
          salesInvoiceForm.data.relationships.details = new parasut.CompanyIdsalesInvoicesDataRelationshipsDetails();
          salesInvoiceForm.data.relationships.details.data = [new parasut.CompanyIdsalesInvoicesDataRelationshipsDetailsData()];
          salesInvoiceForm.data.relationships.details.data[0].id = "";
          salesInvoiceForm.data.relationships.details.data[0].type = "sales_invoice_details";
          salesInvoiceForm.data.relationships.details.data[0].attributes = new parasut.SalesInvoiceDetailAttributes();
          salesInvoiceForm.data.relationships.details.data[0].attributes.quantity = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.unitPrice = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.vatRate = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.discountType = "percentage";
          salesInvoiceForm.data.relationships.details.data[0].attributes.discountValue = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.exciseDutyType = "percentage";
          salesInvoiceForm.data.relationships.details.data[0].attributes.exciseDutyValue = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.communicationsTaxRate = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.description = "";
          salesInvoiceForm.data.relationships.details.data[0].attributes.deliveryMethod = "CFR";
          salesInvoiceForm.data.relationships.details.data[0].attributes.shippingMethod = "Belirtilmedi";
          salesInvoiceForm.data.relationships.details.data[0].relationships = new parasut.CompanyIdpurchaseBillsdetailedDataRelationshipsDetailsRelationships();
          salesInvoiceForm.data.relationships.details.data[0].relationships.product = new parasut.CompanyIdpurchaseBillsdetailedDataRelationshipsDetailsRelationshipsProduct();
          salesInvoiceForm.data.relationships.details.data[0].relationships.product.data = new parasut.CompanyIdpurchaseBillsdetailedDataRelationshipsDetailsRelationshipsProductData();
          salesInvoiceForm.data.relationships.details.data[0].relationships.product.data.id = "";
          salesInvoiceForm.data.relationships.details.data[0].relationships.product.data.type = "products";
          salesInvoiceForm.data.relationships.contact = new parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier();
          salesInvoiceForm.data.relationships.contact.data = new parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData();
          salesInvoiceForm.data.relationships.contact.data.id = "";
          salesInvoiceForm.data.relationships.contact.data.type = "contacts";
          salesInvoiceForm.data.relationships.category = new parasut.CompanyIdbankFeesDataRelationshipsCategory();
          salesInvoiceForm.data.relationships.category.data = new parasut.CompanyIdbankFeesDataRelationshipsCategoryData();
          salesInvoiceForm.data.relationships.category.data.id = "";
          salesInvoiceForm.data.relationships.category.data.type = "item_categories";
          salesInvoiceForm.data.relationships.tags = new parasut.CompanyIdbankFeesDataRelationshipsTags();
          salesInvoiceForm.data.relationships.tags.data = [new parasut.CompanyIdbankFeesDataRelationshipsTagsData()];
          salesInvoiceForm.data.relationships.tags.data[0].id = "";
          salesInvoiceForm.data.relationships.tags.data[0].type = "tags";
          salesInvoiceForm.data.relationships.salesOffer = new parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer();
          salesInvoiceForm.data.relationships.salesOffer.data = new parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData();
          salesInvoiceForm.data.relationships.salesOffer.data.id = "";
          salesInvoiceForm.data.relationships.salesOffer.data.type = "sales_offers";
          var opts = {};
          opts.include = "include_example";

          instance.convertEstimateToInvoice(companyId, id, salesInvoiceForm, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse20112);
            expect(data.data).to.be.a(parasut.SalesInvoice);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("sales_invoices");
              expect(data.data.attributes).to.be.a(parasut.SalesInvoiceAttributes);
                    expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.invoiceNo).to.be.a('string');
                expect(data.data.attributes.invoiceNo).to.be("");
                expect(data.data.attributes.netTotal).to.be.a('number');
                expect(data.data.attributes.netTotal).to.be();
                expect(data.data.attributes.grossTotal).to.be.a('number');
                expect(data.data.attributes.grossTotal).to.be();
                expect(data.data.attributes.withholding).to.be.a('number');
                expect(data.data.attributes.withholding).to.be();
                expect(data.data.attributes.totalExciseDuty).to.be.a('number');
                expect(data.data.attributes.totalExciseDuty).to.be();
                expect(data.data.attributes.totalCommunicationsTax).to.be.a('number');
                expect(data.data.attributes.totalCommunicationsTax).to.be();
                expect(data.data.attributes.totalVat).to.be.a('number');
                expect(data.data.attributes.totalVat).to.be();
                expect(data.data.attributes.vatWithholding).to.be.a('number');
                expect(data.data.attributes.vatWithholding).to.be();
                expect(data.data.attributes.totalDiscount).to.be.a('number');
                expect(data.data.attributes.totalDiscount).to.be();
                expect(data.data.attributes.totalInvoiceDiscount).to.be.a('number');
                expect(data.data.attributes.totalInvoiceDiscount).to.be();
                expect(data.data.attributes.beforeTaxesTotal).to.be.a('number');
                expect(data.data.attributes.beforeTaxesTotal).to.be();
                expect(data.data.attributes.remaining).to.be.a('number');
                expect(data.data.attributes.remaining).to.be();
                expect(data.data.attributes.remainingInTrl).to.be.a('number');
                expect(data.data.attributes.remainingInTrl).to.be();
                expect(data.data.attributes.paymentStatus).to.be.a('string');
                expect(data.data.attributes.paymentStatus).to.be("paid");
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.itemType).to.be.a('string');
                expect(data.data.attributes.itemType).to.be("invoice");
                expect(data.data.attributes.description).to.be.a('string');
                expect(data.data.attributes.description).to.be("");
                expect(data.data.attributes.issueDate).to.be.a(Date);
                expect(data.data.attributes.issueDate).to.be(new Date());
                expect(data.data.attributes.dueDate).to.be.a(Date);
                expect(data.data.attributes.dueDate).to.be(new Date());
                expect(data.data.attributes.invoiceSeries).to.be.a('string');
                expect(data.data.attributes.invoiceSeries).to.be("");
                expect(data.data.attributes.invoiceId).to.be.a('number');
                expect(data.data.attributes.invoiceId).to.be(0);
                expect(data.data.attributes.currency).to.be.a('string');
                expect(data.data.attributes.currency).to.be("TRL");
                expect(data.data.attributes.exchangeRate).to.be.a('number');
                expect(data.data.attributes.exchangeRate).to.be();
                expect(data.data.attributes.withholdingRate).to.be.a('number');
                expect(data.data.attributes.withholdingRate).to.be();
                expect(data.data.attributes.vatWithholdingRate).to.be.a('number');
                expect(data.data.attributes.vatWithholdingRate).to.be();
                expect(data.data.attributes.invoiceDiscountType).to.be.a('string');
                expect(data.data.attributes.invoiceDiscountType).to.be("percentage");
                expect(data.data.attributes.invoiceDiscount).to.be.a('number');
                expect(data.data.attributes.invoiceDiscount).to.be();
                expect(data.data.attributes.billingAddress).to.be.a('string');
                expect(data.data.attributes.billingAddress).to.be("");
                expect(data.data.attributes.billingPhone).to.be.a('string');
                expect(data.data.attributes.billingPhone).to.be("");
                expect(data.data.attributes.billingFax).to.be.a('string');
                expect(data.data.attributes.billingFax).to.be("");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.orderNo).to.be.a('string');
                expect(data.data.attributes.orderNo).to.be("");
                expect(data.data.attributes.orderDate).to.be.a(Date);
                expect(data.data.attributes.orderDate).to.be(new Date());
                expect(data.data.attributes.shipmentAddres).to.be.a('string');
                expect(data.data.attributes.shipmentAddres).to.be("");
                expect(data.data.attributes.shipmentIncluded).to.be.a('boolean');
                expect(data.data.attributes.shipmentIncluded).to.be(false);
                expect(data.data.attributes.cashSale).to.be.a('boolean');
                expect(data.data.attributes.cashSale).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.SalesInvoiceRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contact).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier);
                      expect(data.data.relationships.contact.data).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData);
                        expect(data.data.relationships.contact.data.id).to.be.a('string');
                    expect(data.data.relationships.contact.data.id).to.be("");
                    expect(data.data.relationships.contact.data.type).to.be.a('string');
                    expect(data.data.relationships.contact.data.type).to.be("contacts");
                expect(data.data.relationships.details).to.be.a(parasut.SalesInvoiceRelationshipsDetails);
                      {
                    let dataCtr = data.data.relationships.details.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsDetailsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sales_invoice_details");
      
                            }
                  }
                expect(data.data.relationships.payments).to.be.a(parasut.PurchaseBillRelationshipsPayments);
                      {
                    let dataCtr = data.data.relationships.payments.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.PurchaseBillRelationshipsPaymentsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("payments");
      
                            }
                  }
                expect(data.data.relationships.tags).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTags);
                      {
                    let dataCtr = data.data.relationships.tags.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTagsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("tags");
      
                            }
                  }
                expect(data.data.relationships.salesOffer).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer);
                      expect(data.data.relationships.salesOffer.data).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData);
                        expect(data.data.relationships.salesOffer.data.id).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.id).to.be("");
                    expect(data.data.relationships.salesOffer.data.type).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.type).to.be("sales_offers");
                expect(data.data.relationships.sharings).to.be.a(parasut.SalesInvoiceRelationshipsSharings);
                      {
                    let dataCtr = data.data.relationships.sharings.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsSharingsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sharings");
      
                            }
                  }
                expect(data.data.relationships.recurrencePlan).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlan);
                      expect(data.data.relationships.recurrencePlan.data).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlanData);
                        expect(data.data.relationships.recurrencePlan.data.id).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.id).to.be("");
                    expect(data.data.relationships.recurrencePlan.data.type).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.type).to.be("recurrence_plans");
                expect(data.data.relationships.activeEDocument).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocument);
                      expect(data.data.relationships.activeEDocument.data).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocumentData);
                        expect(data.data.relationships.activeEDocument.data.id).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.id).to.be("");
                    expect(data.data.relationships.activeEDocument.data.type).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.type).to.be("e_archives");
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse20014Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("item_categories");
                expect(data.attributes).to.be.a(Object);
                expect(data.attributes).to.be();
                expect(data.relationships).to.be.a(Object);
                expect(data.relationships).to.be();

                      }
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('createSalesInvoice', function() {
        it('should call createSalesInvoice successfully', function(done) {
          // TODO: uncomment, update parameter values for createSalesInvoice call and complete the assertions
          /*
          var companyId = 56;
          var salesInvoiceForm = new parasut.SalesInvoiceForm();
          salesInvoiceForm.data = new parasut.CompanyIdsalesInvoicesData();
          salesInvoiceForm.data.id = "";
          salesInvoiceForm.data.type = "sales_invoices";
          salesInvoiceForm.data.attributes = new parasut.SalesInvoiceCreateUpdateAttributes();
          salesInvoiceForm.data.attributes.itemType = "invoice";
          salesInvoiceForm.data.attributes.description = "";
          salesInvoiceForm.data.attributes.issueDate = new Date();
          salesInvoiceForm.data.attributes.dueDate = new Date();
          salesInvoiceForm.data.attributes.invoiceSeries = "";
          salesInvoiceForm.data.attributes.invoiceId = 0;
          salesInvoiceForm.data.attributes.currency = "TRL";
          salesInvoiceForm.data.attributes.exchangeRate = ;
          salesInvoiceForm.data.attributes.withholdingRate = ;
          salesInvoiceForm.data.attributes.vatWithholdingRate = ;
          salesInvoiceForm.data.attributes.invoiceDiscountType = "percentage";
          salesInvoiceForm.data.attributes.invoiceDiscount = ;
          salesInvoiceForm.data.attributes.billingAddress = "";
          salesInvoiceForm.data.attributes.billingPhone = "";
          salesInvoiceForm.data.attributes.billingFax = "";
          salesInvoiceForm.data.attributes.taxOffice = "";
          salesInvoiceForm.data.attributes.taxNumber = "";
          salesInvoiceForm.data.attributes.country = "";
          salesInvoiceForm.data.attributes.city = "";
          salesInvoiceForm.data.attributes.district = "";
          salesInvoiceForm.data.attributes.isAbroad = false;
          salesInvoiceForm.data.attributes.orderNo = "";
          salesInvoiceForm.data.attributes.orderDate = new Date();
          salesInvoiceForm.data.attributes.shipmentAddres = "";
          salesInvoiceForm.data.attributes.shipmentIncluded = false;
          salesInvoiceForm.data.attributes.cashSale = false;
          salesInvoiceForm.data.attributes.paymentAccountId = ;
          salesInvoiceForm.data.attributes.paymentDate = "";
          salesInvoiceForm.data.attributes.paymentDescription = "";
          salesInvoiceForm.data.relationships = new parasut.CompanyIdsalesInvoicesDataRelationships();
          salesInvoiceForm.data.relationships.details = new parasut.CompanyIdsalesInvoicesDataRelationshipsDetails();
          salesInvoiceForm.data.relationships.details.data = [new parasut.CompanyIdsalesInvoicesDataRelationshipsDetailsData()];
          salesInvoiceForm.data.relationships.details.data[0].id = "";
          salesInvoiceForm.data.relationships.details.data[0].type = "sales_invoice_details";
          salesInvoiceForm.data.relationships.details.data[0].attributes = new parasut.SalesInvoiceDetailAttributes();
          salesInvoiceForm.data.relationships.details.data[0].attributes.quantity = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.unitPrice = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.vatRate = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.discountType = "percentage";
          salesInvoiceForm.data.relationships.details.data[0].attributes.discountValue = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.exciseDutyType = "percentage";
          salesInvoiceForm.data.relationships.details.data[0].attributes.exciseDutyValue = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.communicationsTaxRate = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.description = "";
          salesInvoiceForm.data.relationships.details.data[0].attributes.deliveryMethod = "CFR";
          salesInvoiceForm.data.relationships.details.data[0].attributes.shippingMethod = "Belirtilmedi";
          salesInvoiceForm.data.relationships.details.data[0].relationships = new parasut.CompanyIdpurchaseBillsdetailedDataRelationshipsDetailsRelationships();
          salesInvoiceForm.data.relationships.details.data[0].relationships.product = new parasut.CompanyIdpurchaseBillsdetailedDataRelationshipsDetailsRelationshipsProduct();
          salesInvoiceForm.data.relationships.details.data[0].relationships.product.data = new parasut.CompanyIdpurchaseBillsdetailedDataRelationshipsDetailsRelationshipsProductData();
          salesInvoiceForm.data.relationships.details.data[0].relationships.product.data.id = "";
          salesInvoiceForm.data.relationships.details.data[0].relationships.product.data.type = "products";
          salesInvoiceForm.data.relationships.contact = new parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier();
          salesInvoiceForm.data.relationships.contact.data = new parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData();
          salesInvoiceForm.data.relationships.contact.data.id = "";
          salesInvoiceForm.data.relationships.contact.data.type = "contacts";
          salesInvoiceForm.data.relationships.category = new parasut.CompanyIdbankFeesDataRelationshipsCategory();
          salesInvoiceForm.data.relationships.category.data = new parasut.CompanyIdbankFeesDataRelationshipsCategoryData();
          salesInvoiceForm.data.relationships.category.data.id = "";
          salesInvoiceForm.data.relationships.category.data.type = "item_categories";
          salesInvoiceForm.data.relationships.tags = new parasut.CompanyIdbankFeesDataRelationshipsTags();
          salesInvoiceForm.data.relationships.tags.data = [new parasut.CompanyIdbankFeesDataRelationshipsTagsData()];
          salesInvoiceForm.data.relationships.tags.data[0].id = "";
          salesInvoiceForm.data.relationships.tags.data[0].type = "tags";
          salesInvoiceForm.data.relationships.salesOffer = new parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer();
          salesInvoiceForm.data.relationships.salesOffer.data = new parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData();
          salesInvoiceForm.data.relationships.salesOffer.data.id = "";
          salesInvoiceForm.data.relationships.salesOffer.data.type = "sales_offers";
          var opts = {};
          opts.include = "include_example";

          instance.createSalesInvoice(companyId, salesInvoiceForm, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse20112);
            expect(data.data).to.be.a(parasut.SalesInvoice);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("sales_invoices");
              expect(data.data.attributes).to.be.a(parasut.SalesInvoiceAttributes);
                    expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.invoiceNo).to.be.a('string');
                expect(data.data.attributes.invoiceNo).to.be("");
                expect(data.data.attributes.netTotal).to.be.a('number');
                expect(data.data.attributes.netTotal).to.be();
                expect(data.data.attributes.grossTotal).to.be.a('number');
                expect(data.data.attributes.grossTotal).to.be();
                expect(data.data.attributes.withholding).to.be.a('number');
                expect(data.data.attributes.withholding).to.be();
                expect(data.data.attributes.totalExciseDuty).to.be.a('number');
                expect(data.data.attributes.totalExciseDuty).to.be();
                expect(data.data.attributes.totalCommunicationsTax).to.be.a('number');
                expect(data.data.attributes.totalCommunicationsTax).to.be();
                expect(data.data.attributes.totalVat).to.be.a('number');
                expect(data.data.attributes.totalVat).to.be();
                expect(data.data.attributes.vatWithholding).to.be.a('number');
                expect(data.data.attributes.vatWithholding).to.be();
                expect(data.data.attributes.totalDiscount).to.be.a('number');
                expect(data.data.attributes.totalDiscount).to.be();
                expect(data.data.attributes.totalInvoiceDiscount).to.be.a('number');
                expect(data.data.attributes.totalInvoiceDiscount).to.be();
                expect(data.data.attributes.beforeTaxesTotal).to.be.a('number');
                expect(data.data.attributes.beforeTaxesTotal).to.be();
                expect(data.data.attributes.remaining).to.be.a('number');
                expect(data.data.attributes.remaining).to.be();
                expect(data.data.attributes.remainingInTrl).to.be.a('number');
                expect(data.data.attributes.remainingInTrl).to.be();
                expect(data.data.attributes.paymentStatus).to.be.a('string');
                expect(data.data.attributes.paymentStatus).to.be("paid");
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.itemType).to.be.a('string');
                expect(data.data.attributes.itemType).to.be("invoice");
                expect(data.data.attributes.description).to.be.a('string');
                expect(data.data.attributes.description).to.be("");
                expect(data.data.attributes.issueDate).to.be.a(Date);
                expect(data.data.attributes.issueDate).to.be(new Date());
                expect(data.data.attributes.dueDate).to.be.a(Date);
                expect(data.data.attributes.dueDate).to.be(new Date());
                expect(data.data.attributes.invoiceSeries).to.be.a('string');
                expect(data.data.attributes.invoiceSeries).to.be("");
                expect(data.data.attributes.invoiceId).to.be.a('number');
                expect(data.data.attributes.invoiceId).to.be(0);
                expect(data.data.attributes.currency).to.be.a('string');
                expect(data.data.attributes.currency).to.be("TRL");
                expect(data.data.attributes.exchangeRate).to.be.a('number');
                expect(data.data.attributes.exchangeRate).to.be();
                expect(data.data.attributes.withholdingRate).to.be.a('number');
                expect(data.data.attributes.withholdingRate).to.be();
                expect(data.data.attributes.vatWithholdingRate).to.be.a('number');
                expect(data.data.attributes.vatWithholdingRate).to.be();
                expect(data.data.attributes.invoiceDiscountType).to.be.a('string');
                expect(data.data.attributes.invoiceDiscountType).to.be("percentage");
                expect(data.data.attributes.invoiceDiscount).to.be.a('number');
                expect(data.data.attributes.invoiceDiscount).to.be();
                expect(data.data.attributes.billingAddress).to.be.a('string');
                expect(data.data.attributes.billingAddress).to.be("");
                expect(data.data.attributes.billingPhone).to.be.a('string');
                expect(data.data.attributes.billingPhone).to.be("");
                expect(data.data.attributes.billingFax).to.be.a('string');
                expect(data.data.attributes.billingFax).to.be("");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.orderNo).to.be.a('string');
                expect(data.data.attributes.orderNo).to.be("");
                expect(data.data.attributes.orderDate).to.be.a(Date);
                expect(data.data.attributes.orderDate).to.be(new Date());
                expect(data.data.attributes.shipmentAddres).to.be.a('string');
                expect(data.data.attributes.shipmentAddres).to.be("");
                expect(data.data.attributes.shipmentIncluded).to.be.a('boolean');
                expect(data.data.attributes.shipmentIncluded).to.be(false);
                expect(data.data.attributes.cashSale).to.be.a('boolean');
                expect(data.data.attributes.cashSale).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.SalesInvoiceRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contact).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier);
                      expect(data.data.relationships.contact.data).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData);
                        expect(data.data.relationships.contact.data.id).to.be.a('string');
                    expect(data.data.relationships.contact.data.id).to.be("");
                    expect(data.data.relationships.contact.data.type).to.be.a('string');
                    expect(data.data.relationships.contact.data.type).to.be("contacts");
                expect(data.data.relationships.details).to.be.a(parasut.SalesInvoiceRelationshipsDetails);
                      {
                    let dataCtr = data.data.relationships.details.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsDetailsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sales_invoice_details");
      
                            }
                  }
                expect(data.data.relationships.payments).to.be.a(parasut.PurchaseBillRelationshipsPayments);
                      {
                    let dataCtr = data.data.relationships.payments.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.PurchaseBillRelationshipsPaymentsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("payments");
      
                            }
                  }
                expect(data.data.relationships.tags).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTags);
                      {
                    let dataCtr = data.data.relationships.tags.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTagsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("tags");
      
                            }
                  }
                expect(data.data.relationships.salesOffer).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer);
                      expect(data.data.relationships.salesOffer.data).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData);
                        expect(data.data.relationships.salesOffer.data.id).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.id).to.be("");
                    expect(data.data.relationships.salesOffer.data.type).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.type).to.be("sales_offers");
                expect(data.data.relationships.sharings).to.be.a(parasut.SalesInvoiceRelationshipsSharings);
                      {
                    let dataCtr = data.data.relationships.sharings.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsSharingsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sharings");
      
                            }
                  }
                expect(data.data.relationships.recurrencePlan).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlan);
                      expect(data.data.relationships.recurrencePlan.data).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlanData);
                        expect(data.data.relationships.recurrencePlan.data.id).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.id).to.be("");
                    expect(data.data.relationships.recurrencePlan.data.type).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.type).to.be("recurrence_plans");
                expect(data.data.relationships.activeEDocument).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocument);
                      expect(data.data.relationships.activeEDocument.data).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocumentData);
                        expect(data.data.relationships.activeEDocument.data.id).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.id).to.be("");
                    expect(data.data.relationships.activeEDocument.data.type).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.type).to.be("e_archives");
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse20014Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("item_categories");
                expect(data.attributes).to.be.a(Object);
                expect(data.attributes).to.be();
                expect(data.relationships).to.be.a(Object);
                expect(data.relationships).to.be();

                      }
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('deleteSalesInvoice', function() {
        it('should call deleteSalesInvoice successfully', function(done) {
          // TODO: uncomment, update parameter values for deleteSalesInvoice call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;

          instance.deleteSalesInvoice(companyId, id, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(Object);
            // expect(data).to.be(null);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('listSalesInvoices', function() {
        it('should call listSalesInvoices successfully', function(done) {
          // TODO: uncomment, update parameter values for listSalesInvoices call and complete the assertions
          /*
          var companyId = 56;
          var opts = {};
          opts.filterIssueDate = "filterIssueDate_example";
          opts.filterDueDate = "filterDueDate_example";
          opts.filterContactId = 56;
          opts.filterInvoiceId = 56;
          opts.filterInvoiceSeries = "filterInvoiceSeries_example";
          opts.filterItemType = "filterItemType_example";
          opts.sort = "id";
          opts.pageNumber = 1;
          opts.pageSize = 15;
          opts.include = "include_example";

          instance.listSalesInvoices(companyId, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse20014);
            {
              let dataCtr = data.data;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.SalesInvoice);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("sales_invoices");
                expect(data.attributes).to.be.a(parasut.SalesInvoiceAttributes);
                      expect(data.attributes.archived).to.be.a('boolean');
                  expect(data.attributes.archived).to.be(false);
                  expect(data.attributes.invoiceNo).to.be.a('string');
                  expect(data.attributes.invoiceNo).to.be("");
                  expect(data.attributes.netTotal).to.be.a('number');
                  expect(data.attributes.netTotal).to.be();
                  expect(data.attributes.grossTotal).to.be.a('number');
                  expect(data.attributes.grossTotal).to.be();
                  expect(data.attributes.withholding).to.be.a('number');
                  expect(data.attributes.withholding).to.be();
                  expect(data.attributes.totalExciseDuty).to.be.a('number');
                  expect(data.attributes.totalExciseDuty).to.be();
                  expect(data.attributes.totalCommunicationsTax).to.be.a('number');
                  expect(data.attributes.totalCommunicationsTax).to.be();
                  expect(data.attributes.totalVat).to.be.a('number');
                  expect(data.attributes.totalVat).to.be();
                  expect(data.attributes.vatWithholding).to.be.a('number');
                  expect(data.attributes.vatWithholding).to.be();
                  expect(data.attributes.totalDiscount).to.be.a('number');
                  expect(data.attributes.totalDiscount).to.be();
                  expect(data.attributes.totalInvoiceDiscount).to.be.a('number');
                  expect(data.attributes.totalInvoiceDiscount).to.be();
                  expect(data.attributes.beforeTaxesTotal).to.be.a('number');
                  expect(data.attributes.beforeTaxesTotal).to.be();
                  expect(data.attributes.remaining).to.be.a('number');
                  expect(data.attributes.remaining).to.be();
                  expect(data.attributes.remainingInTrl).to.be.a('number');
                  expect(data.attributes.remainingInTrl).to.be();
                  expect(data.attributes.paymentStatus).to.be.a('string');
                  expect(data.attributes.paymentStatus).to.be("paid");
                  expect(data.attributes.createdAt).to.be.a(Date);
                  expect(data.attributes.createdAt).to.be(new Date());
                  expect(data.attributes.updatedAt).to.be.a(Date);
                  expect(data.attributes.updatedAt).to.be(new Date());
                  expect(data.attributes.itemType).to.be.a('string');
                  expect(data.attributes.itemType).to.be("invoice");
                  expect(data.attributes.description).to.be.a('string');
                  expect(data.attributes.description).to.be("");
                  expect(data.attributes.issueDate).to.be.a(Date);
                  expect(data.attributes.issueDate).to.be(new Date());
                  expect(data.attributes.dueDate).to.be.a(Date);
                  expect(data.attributes.dueDate).to.be(new Date());
                  expect(data.attributes.invoiceSeries).to.be.a('string');
                  expect(data.attributes.invoiceSeries).to.be("");
                  expect(data.attributes.invoiceId).to.be.a('number');
                  expect(data.attributes.invoiceId).to.be(0);
                  expect(data.attributes.currency).to.be.a('string');
                  expect(data.attributes.currency).to.be("TRL");
                  expect(data.attributes.exchangeRate).to.be.a('number');
                  expect(data.attributes.exchangeRate).to.be();
                  expect(data.attributes.withholdingRate).to.be.a('number');
                  expect(data.attributes.withholdingRate).to.be();
                  expect(data.attributes.vatWithholdingRate).to.be.a('number');
                  expect(data.attributes.vatWithholdingRate).to.be();
                  expect(data.attributes.invoiceDiscountType).to.be.a('string');
                  expect(data.attributes.invoiceDiscountType).to.be("percentage");
                  expect(data.attributes.invoiceDiscount).to.be.a('number');
                  expect(data.attributes.invoiceDiscount).to.be();
                  expect(data.attributes.billingAddress).to.be.a('string');
                  expect(data.attributes.billingAddress).to.be("");
                  expect(data.attributes.billingPhone).to.be.a('string');
                  expect(data.attributes.billingPhone).to.be("");
                  expect(data.attributes.billingFax).to.be.a('string');
                  expect(data.attributes.billingFax).to.be("");
                  expect(data.attributes.taxOffice).to.be.a('string');
                  expect(data.attributes.taxOffice).to.be("");
                  expect(data.attributes.taxNumber).to.be.a('string');
                  expect(data.attributes.taxNumber).to.be("");
                  expect(data.attributes.country).to.be.a('string');
                  expect(data.attributes.country).to.be("");
                  expect(data.attributes.city).to.be.a('string');
                  expect(data.attributes.city).to.be("");
                  expect(data.attributes.district).to.be.a('string');
                  expect(data.attributes.district).to.be("");
                  expect(data.attributes.isAbroad).to.be.a('boolean');
                  expect(data.attributes.isAbroad).to.be(false);
                  expect(data.attributes.orderNo).to.be.a('string');
                  expect(data.attributes.orderNo).to.be("");
                  expect(data.attributes.orderDate).to.be.a(Date);
                  expect(data.attributes.orderDate).to.be(new Date());
                  expect(data.attributes.shipmentAddres).to.be.a('string');
                  expect(data.attributes.shipmentAddres).to.be("");
                  expect(data.attributes.shipmentIncluded).to.be.a('boolean');
                  expect(data.attributes.shipmentIncluded).to.be(false);
                  expect(data.attributes.cashSale).to.be.a('boolean');
                  expect(data.attributes.cashSale).to.be(false);
                expect(data.relationships).to.be.a(parasut.SalesInvoiceRelationships);
                      expect(data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                        expect(data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                          expect(data.relationships.category.data.id).to.be.a('string');
                      expect(data.relationships.category.data.id).to.be("");
                      expect(data.relationships.category.data.type).to.be.a('string');
                      expect(data.relationships.category.data.type).to.be("item_categories");
                  expect(data.relationships.contact).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier);
                        expect(data.relationships.contact.data).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData);
                          expect(data.relationships.contact.data.id).to.be.a('string');
                      expect(data.relationships.contact.data.id).to.be("");
                      expect(data.relationships.contact.data.type).to.be.a('string');
                      expect(data.relationships.contact.data.type).to.be("contacts");
                  expect(data.relationships.details).to.be.a(parasut.SalesInvoiceRelationshipsDetails);
                        {
                      let dataCtr = data.relationships.details.data;
                      expect(dataCtr).to.be.an(Array);
                      expect(dataCtr).to.not.be.empty();
                      for (let p in dataCtr) {
                        let data = dataCtr[p];
                        expect(data).to.be.a(parasut.SalesInvoiceRelationshipsDetailsData);
                        expect(data.id).to.be.a('string');
                        expect(data.id).to.be("");
                        expect(data.type).to.be.a('string');
                        expect(data.type).to.be("sales_invoice_details");
        
                              }
                    }
                  expect(data.relationships.payments).to.be.a(parasut.PurchaseBillRelationshipsPayments);
                        {
                      let dataCtr = data.relationships.payments.data;
                      expect(dataCtr).to.be.an(Array);
                      expect(dataCtr).to.not.be.empty();
                      for (let p in dataCtr) {
                        let data = dataCtr[p];
                        expect(data).to.be.a(parasut.PurchaseBillRelationshipsPaymentsData);
                        expect(data.id).to.be.a('string');
                        expect(data.id).to.be("");
                        expect(data.type).to.be.a('string');
                        expect(data.type).to.be("payments");
        
                              }
                    }
                  expect(data.relationships.tags).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTags);
                        {
                      let dataCtr = data.relationships.tags.data;
                      expect(dataCtr).to.be.an(Array);
                      expect(dataCtr).to.not.be.empty();
                      for (let p in dataCtr) {
                        let data = dataCtr[p];
                        expect(data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTagsData);
                        expect(data.id).to.be.a('string');
                        expect(data.id).to.be("");
                        expect(data.type).to.be.a('string');
                        expect(data.type).to.be("tags");
        
                              }
                    }
                  expect(data.relationships.salesOffer).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer);
                        expect(data.relationships.salesOffer.data).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData);
                          expect(data.relationships.salesOffer.data.id).to.be.a('string');
                      expect(data.relationships.salesOffer.data.id).to.be("");
                      expect(data.relationships.salesOffer.data.type).to.be.a('string');
                      expect(data.relationships.salesOffer.data.type).to.be("sales_offers");
                  expect(data.relationships.sharings).to.be.a(parasut.SalesInvoiceRelationshipsSharings);
                        {
                      let dataCtr = data.relationships.sharings.data;
                      expect(dataCtr).to.be.an(Array);
                      expect(dataCtr).to.not.be.empty();
                      for (let p in dataCtr) {
                        let data = dataCtr[p];
                        expect(data).to.be.a(parasut.SalesInvoiceRelationshipsSharingsData);
                        expect(data.id).to.be.a('string');
                        expect(data.id).to.be("");
                        expect(data.type).to.be.a('string');
                        expect(data.type).to.be("sharings");
        
                              }
                    }
                  expect(data.relationships.recurrencePlan).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlan);
                        expect(data.relationships.recurrencePlan.data).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlanData);
                          expect(data.relationships.recurrencePlan.data.id).to.be.a('string');
                      expect(data.relationships.recurrencePlan.data.id).to.be("");
                      expect(data.relationships.recurrencePlan.data.type).to.be.a('string');
                      expect(data.relationships.recurrencePlan.data.type).to.be("recurrence_plans");
                  expect(data.relationships.activeEDocument).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocument);
                        expect(data.relationships.activeEDocument.data).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocumentData);
                          expect(data.relationships.activeEDocument.data.id).to.be.a('string');
                      expect(data.relationships.activeEDocument.data.id).to.be("");
                      expect(data.relationships.activeEDocument.data.type).to.be.a('string');
                      expect(data.relationships.activeEDocument.data.type).to.be("e_archives");

                      }
            }
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse20014Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("item_categories");
                expect(data.attributes).to.be.a(Object);
                expect(data.attributes).to.be();
                expect(data.relationships).to.be.a(Object);
                expect(data.relationships).to.be();

                      }
            }
            expect(data.meta).to.be.a(parasut.ListMeta);
                  expect(data.meta.currentPage).to.be.a('number');
              expect(data.meta.currentPage).to.be(0);
              expect(data.meta.totalPages).to.be.a('number');
              expect(data.meta.totalPages).to.be(0);
              expect(data.meta.totalCount).to.be.a('number');
              expect(data.meta.totalCount).to.be(0);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('paySalesInvoice', function() {
        it('should call paySalesInvoice successfully', function(done) {
          // TODO: uncomment, update parameter values for paySalesInvoice call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var paymentForm = new parasut.PaymentForm3();
          paymentForm.data = new parasut.CompanyIdbankFeesidpaymentsData();
          paymentForm.data.id = "";
          paymentForm.data.type = "payments";
          paymentForm.data.attributes = new parasut.PaymentFormAttributes();
          paymentForm.data.attributes.description = "";
          paymentForm.data.attributes.accountId = 0;
          paymentForm.data.attributes._date = new Date();
          paymentForm.data.attributes.amount = ;
          paymentForm.data.attributes.exchangeRate = ;
          var opts = {};
          opts.include = "include_example";

          instance.paySalesInvoice(companyId, id, paymentForm, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse2013);
            expect(data.data).to.be.a(parasut.Payment);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("payments");
              expect(data.data.attributes).to.be.a(parasut.PaymentAttributes);
                    expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes._date).to.be.a(Date);
                expect(data.data.attributes._date).to.be(new Date());
                expect(data.data.attributes.amount).to.be.a('number');
                expect(data.data.attributes.amount).to.be();
                expect(data.data.attributes.currency).to.be.a('number');
                expect(data.data.attributes.currency).to.be();
                expect(data.data.attributes.notes).to.be.a('string');
                expect(data.data.attributes.notes).to.be("");
              expect(data.data.relationships).to.be.a(parasut.PaymentRelationships);
                    expect(data.data.relationships.payable).to.be.a(parasut.PaymentRelationshipsPayable);
                      expect(data.data.relationships.payable.data).to.be.a(parasut.PaymentRelationshipsPayableData);
                        expect(data.data.relationships.payable.data.id).to.be.a('string');
                    expect(data.data.relationships.payable.data.id).to.be("");
                    expect(data.data.relationships.payable.data.type).to.be.a('string');
                    expect(data.data.relationships.payable.data.type).to.be("sales_invoices");
                expect(data.data.relationships.transaction).to.be.a(parasut.PaymentRelationshipsTransaction);
                      expect(data.data.relationships.transaction.data).to.be.a(parasut.PaymentRelationshipsTransactionData);
                        expect(data.data.relationships.transaction.data.id).to.be.a('string');
                    expect(data.data.relationships.transaction.data.id).to.be("");
                    expect(data.data.relationships.transaction.data.type).to.be.a('string');
                    expect(data.data.relationships.transaction.data.type).to.be("transactions");
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse2013Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("sales_invoices");
                expect(data.attributes).to.be.a(Object);
                expect(data.attributes).to.be();
                expect(data.relationships).to.be.a(Object);
                expect(data.relationships).to.be();

                      }
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('recoverSalesInvoice', function() {
        it('should call recoverSalesInvoice successfully', function(done) {
          // TODO: uncomment, update parameter values for recoverSalesInvoice call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var opts = {};
          opts.include = "include_example";

          instance.recoverSalesInvoice(companyId, id, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse20112);
            expect(data.data).to.be.a(parasut.SalesInvoice);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("sales_invoices");
              expect(data.data.attributes).to.be.a(parasut.SalesInvoiceAttributes);
                    expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.invoiceNo).to.be.a('string');
                expect(data.data.attributes.invoiceNo).to.be("");
                expect(data.data.attributes.netTotal).to.be.a('number');
                expect(data.data.attributes.netTotal).to.be();
                expect(data.data.attributes.grossTotal).to.be.a('number');
                expect(data.data.attributes.grossTotal).to.be();
                expect(data.data.attributes.withholding).to.be.a('number');
                expect(data.data.attributes.withholding).to.be();
                expect(data.data.attributes.totalExciseDuty).to.be.a('number');
                expect(data.data.attributes.totalExciseDuty).to.be();
                expect(data.data.attributes.totalCommunicationsTax).to.be.a('number');
                expect(data.data.attributes.totalCommunicationsTax).to.be();
                expect(data.data.attributes.totalVat).to.be.a('number');
                expect(data.data.attributes.totalVat).to.be();
                expect(data.data.attributes.vatWithholding).to.be.a('number');
                expect(data.data.attributes.vatWithholding).to.be();
                expect(data.data.attributes.totalDiscount).to.be.a('number');
                expect(data.data.attributes.totalDiscount).to.be();
                expect(data.data.attributes.totalInvoiceDiscount).to.be.a('number');
                expect(data.data.attributes.totalInvoiceDiscount).to.be();
                expect(data.data.attributes.beforeTaxesTotal).to.be.a('number');
                expect(data.data.attributes.beforeTaxesTotal).to.be();
                expect(data.data.attributes.remaining).to.be.a('number');
                expect(data.data.attributes.remaining).to.be();
                expect(data.data.attributes.remainingInTrl).to.be.a('number');
                expect(data.data.attributes.remainingInTrl).to.be();
                expect(data.data.attributes.paymentStatus).to.be.a('string');
                expect(data.data.attributes.paymentStatus).to.be("paid");
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.itemType).to.be.a('string');
                expect(data.data.attributes.itemType).to.be("invoice");
                expect(data.data.attributes.description).to.be.a('string');
                expect(data.data.attributes.description).to.be("");
                expect(data.data.attributes.issueDate).to.be.a(Date);
                expect(data.data.attributes.issueDate).to.be(new Date());
                expect(data.data.attributes.dueDate).to.be.a(Date);
                expect(data.data.attributes.dueDate).to.be(new Date());
                expect(data.data.attributes.invoiceSeries).to.be.a('string');
                expect(data.data.attributes.invoiceSeries).to.be("");
                expect(data.data.attributes.invoiceId).to.be.a('number');
                expect(data.data.attributes.invoiceId).to.be(0);
                expect(data.data.attributes.currency).to.be.a('string');
                expect(data.data.attributes.currency).to.be("TRL");
                expect(data.data.attributes.exchangeRate).to.be.a('number');
                expect(data.data.attributes.exchangeRate).to.be();
                expect(data.data.attributes.withholdingRate).to.be.a('number');
                expect(data.data.attributes.withholdingRate).to.be();
                expect(data.data.attributes.vatWithholdingRate).to.be.a('number');
                expect(data.data.attributes.vatWithholdingRate).to.be();
                expect(data.data.attributes.invoiceDiscountType).to.be.a('string');
                expect(data.data.attributes.invoiceDiscountType).to.be("percentage");
                expect(data.data.attributes.invoiceDiscount).to.be.a('number');
                expect(data.data.attributes.invoiceDiscount).to.be();
                expect(data.data.attributes.billingAddress).to.be.a('string');
                expect(data.data.attributes.billingAddress).to.be("");
                expect(data.data.attributes.billingPhone).to.be.a('string');
                expect(data.data.attributes.billingPhone).to.be("");
                expect(data.data.attributes.billingFax).to.be.a('string');
                expect(data.data.attributes.billingFax).to.be("");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.orderNo).to.be.a('string');
                expect(data.data.attributes.orderNo).to.be("");
                expect(data.data.attributes.orderDate).to.be.a(Date);
                expect(data.data.attributes.orderDate).to.be(new Date());
                expect(data.data.attributes.shipmentAddres).to.be.a('string');
                expect(data.data.attributes.shipmentAddres).to.be("");
                expect(data.data.attributes.shipmentIncluded).to.be.a('boolean');
                expect(data.data.attributes.shipmentIncluded).to.be(false);
                expect(data.data.attributes.cashSale).to.be.a('boolean');
                expect(data.data.attributes.cashSale).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.SalesInvoiceRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contact).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier);
                      expect(data.data.relationships.contact.data).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData);
                        expect(data.data.relationships.contact.data.id).to.be.a('string');
                    expect(data.data.relationships.contact.data.id).to.be("");
                    expect(data.data.relationships.contact.data.type).to.be.a('string');
                    expect(data.data.relationships.contact.data.type).to.be("contacts");
                expect(data.data.relationships.details).to.be.a(parasut.SalesInvoiceRelationshipsDetails);
                      {
                    let dataCtr = data.data.relationships.details.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsDetailsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sales_invoice_details");
      
                            }
                  }
                expect(data.data.relationships.payments).to.be.a(parasut.PurchaseBillRelationshipsPayments);
                      {
                    let dataCtr = data.data.relationships.payments.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.PurchaseBillRelationshipsPaymentsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("payments");
      
                            }
                  }
                expect(data.data.relationships.tags).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTags);
                      {
                    let dataCtr = data.data.relationships.tags.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTagsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("tags");
      
                            }
                  }
                expect(data.data.relationships.salesOffer).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer);
                      expect(data.data.relationships.salesOffer.data).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData);
                        expect(data.data.relationships.salesOffer.data.id).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.id).to.be("");
                    expect(data.data.relationships.salesOffer.data.type).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.type).to.be("sales_offers");
                expect(data.data.relationships.sharings).to.be.a(parasut.SalesInvoiceRelationshipsSharings);
                      {
                    let dataCtr = data.data.relationships.sharings.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsSharingsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sharings");
      
                            }
                  }
                expect(data.data.relationships.recurrencePlan).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlan);
                      expect(data.data.relationships.recurrencePlan.data).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlanData);
                        expect(data.data.relationships.recurrencePlan.data.id).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.id).to.be("");
                    expect(data.data.relationships.recurrencePlan.data.type).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.type).to.be("recurrence_plans");
                expect(data.data.relationships.activeEDocument).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocument);
                      expect(data.data.relationships.activeEDocument.data).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocumentData);
                        expect(data.data.relationships.activeEDocument.data.id).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.id).to.be("");
                    expect(data.data.relationships.activeEDocument.data.type).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.type).to.be("e_archives");
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse20014Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("item_categories");
                expect(data.attributes).to.be.a(Object);
                expect(data.attributes).to.be();
                expect(data.relationships).to.be.a(Object);
                expect(data.relationships).to.be();

                      }
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('showSalesInvoice', function() {
        it('should call showSalesInvoice successfully', function(done) {
          // TODO: uncomment, update parameter values for showSalesInvoice call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var opts = {};
          opts.include = "include_example";

          instance.showSalesInvoice(companyId, id, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse20112);
            expect(data.data).to.be.a(parasut.SalesInvoice);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("sales_invoices");
              expect(data.data.attributes).to.be.a(parasut.SalesInvoiceAttributes);
                    expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.invoiceNo).to.be.a('string');
                expect(data.data.attributes.invoiceNo).to.be("");
                expect(data.data.attributes.netTotal).to.be.a('number');
                expect(data.data.attributes.netTotal).to.be();
                expect(data.data.attributes.grossTotal).to.be.a('number');
                expect(data.data.attributes.grossTotal).to.be();
                expect(data.data.attributes.withholding).to.be.a('number');
                expect(data.data.attributes.withholding).to.be();
                expect(data.data.attributes.totalExciseDuty).to.be.a('number');
                expect(data.data.attributes.totalExciseDuty).to.be();
                expect(data.data.attributes.totalCommunicationsTax).to.be.a('number');
                expect(data.data.attributes.totalCommunicationsTax).to.be();
                expect(data.data.attributes.totalVat).to.be.a('number');
                expect(data.data.attributes.totalVat).to.be();
                expect(data.data.attributes.vatWithholding).to.be.a('number');
                expect(data.data.attributes.vatWithholding).to.be();
                expect(data.data.attributes.totalDiscount).to.be.a('number');
                expect(data.data.attributes.totalDiscount).to.be();
                expect(data.data.attributes.totalInvoiceDiscount).to.be.a('number');
                expect(data.data.attributes.totalInvoiceDiscount).to.be();
                expect(data.data.attributes.beforeTaxesTotal).to.be.a('number');
                expect(data.data.attributes.beforeTaxesTotal).to.be();
                expect(data.data.attributes.remaining).to.be.a('number');
                expect(data.data.attributes.remaining).to.be();
                expect(data.data.attributes.remainingInTrl).to.be.a('number');
                expect(data.data.attributes.remainingInTrl).to.be();
                expect(data.data.attributes.paymentStatus).to.be.a('string');
                expect(data.data.attributes.paymentStatus).to.be("paid");
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.itemType).to.be.a('string');
                expect(data.data.attributes.itemType).to.be("invoice");
                expect(data.data.attributes.description).to.be.a('string');
                expect(data.data.attributes.description).to.be("");
                expect(data.data.attributes.issueDate).to.be.a(Date);
                expect(data.data.attributes.issueDate).to.be(new Date());
                expect(data.data.attributes.dueDate).to.be.a(Date);
                expect(data.data.attributes.dueDate).to.be(new Date());
                expect(data.data.attributes.invoiceSeries).to.be.a('string');
                expect(data.data.attributes.invoiceSeries).to.be("");
                expect(data.data.attributes.invoiceId).to.be.a('number');
                expect(data.data.attributes.invoiceId).to.be(0);
                expect(data.data.attributes.currency).to.be.a('string');
                expect(data.data.attributes.currency).to.be("TRL");
                expect(data.data.attributes.exchangeRate).to.be.a('number');
                expect(data.data.attributes.exchangeRate).to.be();
                expect(data.data.attributes.withholdingRate).to.be.a('number');
                expect(data.data.attributes.withholdingRate).to.be();
                expect(data.data.attributes.vatWithholdingRate).to.be.a('number');
                expect(data.data.attributes.vatWithholdingRate).to.be();
                expect(data.data.attributes.invoiceDiscountType).to.be.a('string');
                expect(data.data.attributes.invoiceDiscountType).to.be("percentage");
                expect(data.data.attributes.invoiceDiscount).to.be.a('number');
                expect(data.data.attributes.invoiceDiscount).to.be();
                expect(data.data.attributes.billingAddress).to.be.a('string');
                expect(data.data.attributes.billingAddress).to.be("");
                expect(data.data.attributes.billingPhone).to.be.a('string');
                expect(data.data.attributes.billingPhone).to.be("");
                expect(data.data.attributes.billingFax).to.be.a('string');
                expect(data.data.attributes.billingFax).to.be("");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.orderNo).to.be.a('string');
                expect(data.data.attributes.orderNo).to.be("");
                expect(data.data.attributes.orderDate).to.be.a(Date);
                expect(data.data.attributes.orderDate).to.be(new Date());
                expect(data.data.attributes.shipmentAddres).to.be.a('string');
                expect(data.data.attributes.shipmentAddres).to.be("");
                expect(data.data.attributes.shipmentIncluded).to.be.a('boolean');
                expect(data.data.attributes.shipmentIncluded).to.be(false);
                expect(data.data.attributes.cashSale).to.be.a('boolean');
                expect(data.data.attributes.cashSale).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.SalesInvoiceRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contact).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier);
                      expect(data.data.relationships.contact.data).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData);
                        expect(data.data.relationships.contact.data.id).to.be.a('string');
                    expect(data.data.relationships.contact.data.id).to.be("");
                    expect(data.data.relationships.contact.data.type).to.be.a('string');
                    expect(data.data.relationships.contact.data.type).to.be("contacts");
                expect(data.data.relationships.details).to.be.a(parasut.SalesInvoiceRelationshipsDetails);
                      {
                    let dataCtr = data.data.relationships.details.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsDetailsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sales_invoice_details");
      
                            }
                  }
                expect(data.data.relationships.payments).to.be.a(parasut.PurchaseBillRelationshipsPayments);
                      {
                    let dataCtr = data.data.relationships.payments.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.PurchaseBillRelationshipsPaymentsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("payments");
      
                            }
                  }
                expect(data.data.relationships.tags).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTags);
                      {
                    let dataCtr = data.data.relationships.tags.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTagsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("tags");
      
                            }
                  }
                expect(data.data.relationships.salesOffer).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer);
                      expect(data.data.relationships.salesOffer.data).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData);
                        expect(data.data.relationships.salesOffer.data.id).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.id).to.be("");
                    expect(data.data.relationships.salesOffer.data.type).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.type).to.be("sales_offers");
                expect(data.data.relationships.sharings).to.be.a(parasut.SalesInvoiceRelationshipsSharings);
                      {
                    let dataCtr = data.data.relationships.sharings.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsSharingsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sharings");
      
                            }
                  }
                expect(data.data.relationships.recurrencePlan).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlan);
                      expect(data.data.relationships.recurrencePlan.data).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlanData);
                        expect(data.data.relationships.recurrencePlan.data.id).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.id).to.be("");
                    expect(data.data.relationships.recurrencePlan.data.type).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.type).to.be("recurrence_plans");
                expect(data.data.relationships.activeEDocument).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocument);
                      expect(data.data.relationships.activeEDocument.data).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocumentData);
                        expect(data.data.relationships.activeEDocument.data.id).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.id).to.be("");
                    expect(data.data.relationships.activeEDocument.data.type).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.type).to.be("e_archives");
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse20014Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("item_categories");
                expect(data.attributes).to.be.a(Object);
                expect(data.attributes).to.be();
                expect(data.relationships).to.be.a(Object);
                expect(data.relationships).to.be();

                      }
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('unarchiveSalesInvoice', function() {
        it('should call unarchiveSalesInvoice successfully', function(done) {
          // TODO: uncomment, update parameter values for unarchiveSalesInvoice call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var opts = {};
          opts.include = "include_example";

          instance.unarchiveSalesInvoice(companyId, id, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse20112);
            expect(data.data).to.be.a(parasut.SalesInvoice);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("sales_invoices");
              expect(data.data.attributes).to.be.a(parasut.SalesInvoiceAttributes);
                    expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.invoiceNo).to.be.a('string');
                expect(data.data.attributes.invoiceNo).to.be("");
                expect(data.data.attributes.netTotal).to.be.a('number');
                expect(data.data.attributes.netTotal).to.be();
                expect(data.data.attributes.grossTotal).to.be.a('number');
                expect(data.data.attributes.grossTotal).to.be();
                expect(data.data.attributes.withholding).to.be.a('number');
                expect(data.data.attributes.withholding).to.be();
                expect(data.data.attributes.totalExciseDuty).to.be.a('number');
                expect(data.data.attributes.totalExciseDuty).to.be();
                expect(data.data.attributes.totalCommunicationsTax).to.be.a('number');
                expect(data.data.attributes.totalCommunicationsTax).to.be();
                expect(data.data.attributes.totalVat).to.be.a('number');
                expect(data.data.attributes.totalVat).to.be();
                expect(data.data.attributes.vatWithholding).to.be.a('number');
                expect(data.data.attributes.vatWithholding).to.be();
                expect(data.data.attributes.totalDiscount).to.be.a('number');
                expect(data.data.attributes.totalDiscount).to.be();
                expect(data.data.attributes.totalInvoiceDiscount).to.be.a('number');
                expect(data.data.attributes.totalInvoiceDiscount).to.be();
                expect(data.data.attributes.beforeTaxesTotal).to.be.a('number');
                expect(data.data.attributes.beforeTaxesTotal).to.be();
                expect(data.data.attributes.remaining).to.be.a('number');
                expect(data.data.attributes.remaining).to.be();
                expect(data.data.attributes.remainingInTrl).to.be.a('number');
                expect(data.data.attributes.remainingInTrl).to.be();
                expect(data.data.attributes.paymentStatus).to.be.a('string');
                expect(data.data.attributes.paymentStatus).to.be("paid");
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.itemType).to.be.a('string');
                expect(data.data.attributes.itemType).to.be("invoice");
                expect(data.data.attributes.description).to.be.a('string');
                expect(data.data.attributes.description).to.be("");
                expect(data.data.attributes.issueDate).to.be.a(Date);
                expect(data.data.attributes.issueDate).to.be(new Date());
                expect(data.data.attributes.dueDate).to.be.a(Date);
                expect(data.data.attributes.dueDate).to.be(new Date());
                expect(data.data.attributes.invoiceSeries).to.be.a('string');
                expect(data.data.attributes.invoiceSeries).to.be("");
                expect(data.data.attributes.invoiceId).to.be.a('number');
                expect(data.data.attributes.invoiceId).to.be(0);
                expect(data.data.attributes.currency).to.be.a('string');
                expect(data.data.attributes.currency).to.be("TRL");
                expect(data.data.attributes.exchangeRate).to.be.a('number');
                expect(data.data.attributes.exchangeRate).to.be();
                expect(data.data.attributes.withholdingRate).to.be.a('number');
                expect(data.data.attributes.withholdingRate).to.be();
                expect(data.data.attributes.vatWithholdingRate).to.be.a('number');
                expect(data.data.attributes.vatWithholdingRate).to.be();
                expect(data.data.attributes.invoiceDiscountType).to.be.a('string');
                expect(data.data.attributes.invoiceDiscountType).to.be("percentage");
                expect(data.data.attributes.invoiceDiscount).to.be.a('number');
                expect(data.data.attributes.invoiceDiscount).to.be();
                expect(data.data.attributes.billingAddress).to.be.a('string');
                expect(data.data.attributes.billingAddress).to.be("");
                expect(data.data.attributes.billingPhone).to.be.a('string');
                expect(data.data.attributes.billingPhone).to.be("");
                expect(data.data.attributes.billingFax).to.be.a('string');
                expect(data.data.attributes.billingFax).to.be("");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.orderNo).to.be.a('string');
                expect(data.data.attributes.orderNo).to.be("");
                expect(data.data.attributes.orderDate).to.be.a(Date);
                expect(data.data.attributes.orderDate).to.be(new Date());
                expect(data.data.attributes.shipmentAddres).to.be.a('string');
                expect(data.data.attributes.shipmentAddres).to.be("");
                expect(data.data.attributes.shipmentIncluded).to.be.a('boolean');
                expect(data.data.attributes.shipmentIncluded).to.be(false);
                expect(data.data.attributes.cashSale).to.be.a('boolean');
                expect(data.data.attributes.cashSale).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.SalesInvoiceRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contact).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier);
                      expect(data.data.relationships.contact.data).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData);
                        expect(data.data.relationships.contact.data.id).to.be.a('string');
                    expect(data.data.relationships.contact.data.id).to.be("");
                    expect(data.data.relationships.contact.data.type).to.be.a('string');
                    expect(data.data.relationships.contact.data.type).to.be("contacts");
                expect(data.data.relationships.details).to.be.a(parasut.SalesInvoiceRelationshipsDetails);
                      {
                    let dataCtr = data.data.relationships.details.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsDetailsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sales_invoice_details");
      
                            }
                  }
                expect(data.data.relationships.payments).to.be.a(parasut.PurchaseBillRelationshipsPayments);
                      {
                    let dataCtr = data.data.relationships.payments.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.PurchaseBillRelationshipsPaymentsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("payments");
      
                            }
                  }
                expect(data.data.relationships.tags).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTags);
                      {
                    let dataCtr = data.data.relationships.tags.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTagsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("tags");
      
                            }
                  }
                expect(data.data.relationships.salesOffer).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer);
                      expect(data.data.relationships.salesOffer.data).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData);
                        expect(data.data.relationships.salesOffer.data.id).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.id).to.be("");
                    expect(data.data.relationships.salesOffer.data.type).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.type).to.be("sales_offers");
                expect(data.data.relationships.sharings).to.be.a(parasut.SalesInvoiceRelationshipsSharings);
                      {
                    let dataCtr = data.data.relationships.sharings.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsSharingsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sharings");
      
                            }
                  }
                expect(data.data.relationships.recurrencePlan).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlan);
                      expect(data.data.relationships.recurrencePlan.data).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlanData);
                        expect(data.data.relationships.recurrencePlan.data.id).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.id).to.be("");
                    expect(data.data.relationships.recurrencePlan.data.type).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.type).to.be("recurrence_plans");
                expect(data.data.relationships.activeEDocument).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocument);
                      expect(data.data.relationships.activeEDocument.data).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocumentData);
                        expect(data.data.relationships.activeEDocument.data.id).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.id).to.be("");
                    expect(data.data.relationships.activeEDocument.data.type).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.type).to.be("e_archives");
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse20014Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("item_categories");
                expect(data.attributes).to.be.a(Object);
                expect(data.attributes).to.be();
                expect(data.relationships).to.be.a(Object);
                expect(data.relationships).to.be();

                      }
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('updateSalesInvoice', function() {
        it('should call updateSalesInvoice successfully', function(done) {
          // TODO: uncomment, update parameter values for updateSalesInvoice call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var salesInvoiceForm = new parasut.SalesInvoiceForm1();
          salesInvoiceForm.data = new parasut.CompanyIdsalesInvoicesData();
          salesInvoiceForm.data.id = "";
          salesInvoiceForm.data.type = "sales_invoices";
          salesInvoiceForm.data.attributes = new parasut.SalesInvoiceCreateUpdateAttributes();
          salesInvoiceForm.data.attributes.itemType = "invoice";
          salesInvoiceForm.data.attributes.description = "";
          salesInvoiceForm.data.attributes.issueDate = new Date();
          salesInvoiceForm.data.attributes.dueDate = new Date();
          salesInvoiceForm.data.attributes.invoiceSeries = "";
          salesInvoiceForm.data.attributes.invoiceId = 0;
          salesInvoiceForm.data.attributes.currency = "TRL";
          salesInvoiceForm.data.attributes.exchangeRate = ;
          salesInvoiceForm.data.attributes.withholdingRate = ;
          salesInvoiceForm.data.attributes.vatWithholdingRate = ;
          salesInvoiceForm.data.attributes.invoiceDiscountType = "percentage";
          salesInvoiceForm.data.attributes.invoiceDiscount = ;
          salesInvoiceForm.data.attributes.billingAddress = "";
          salesInvoiceForm.data.attributes.billingPhone = "";
          salesInvoiceForm.data.attributes.billingFax = "";
          salesInvoiceForm.data.attributes.taxOffice = "";
          salesInvoiceForm.data.attributes.taxNumber = "";
          salesInvoiceForm.data.attributes.country = "";
          salesInvoiceForm.data.attributes.city = "";
          salesInvoiceForm.data.attributes.district = "";
          salesInvoiceForm.data.attributes.isAbroad = false;
          salesInvoiceForm.data.attributes.orderNo = "";
          salesInvoiceForm.data.attributes.orderDate = new Date();
          salesInvoiceForm.data.attributes.shipmentAddres = "";
          salesInvoiceForm.data.attributes.shipmentIncluded = false;
          salesInvoiceForm.data.attributes.cashSale = false;
          salesInvoiceForm.data.attributes.paymentAccountId = ;
          salesInvoiceForm.data.attributes.paymentDate = "";
          salesInvoiceForm.data.attributes.paymentDescription = "";
          salesInvoiceForm.data.relationships = new parasut.CompanyIdsalesInvoicesDataRelationships();
          salesInvoiceForm.data.relationships.details = new parasut.CompanyIdsalesInvoicesDataRelationshipsDetails();
          salesInvoiceForm.data.relationships.details.data = [new parasut.CompanyIdsalesInvoicesDataRelationshipsDetailsData()];
          salesInvoiceForm.data.relationships.details.data[0].id = "";
          salesInvoiceForm.data.relationships.details.data[0].type = "sales_invoice_details";
          salesInvoiceForm.data.relationships.details.data[0].attributes = new parasut.SalesInvoiceDetailAttributes();
          salesInvoiceForm.data.relationships.details.data[0].attributes.quantity = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.unitPrice = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.vatRate = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.discountType = "percentage";
          salesInvoiceForm.data.relationships.details.data[0].attributes.discountValue = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.exciseDutyType = "percentage";
          salesInvoiceForm.data.relationships.details.data[0].attributes.exciseDutyValue = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.communicationsTaxRate = ;
          salesInvoiceForm.data.relationships.details.data[0].attributes.description = "";
          salesInvoiceForm.data.relationships.details.data[0].attributes.deliveryMethod = "CFR";
          salesInvoiceForm.data.relationships.details.data[0].attributes.shippingMethod = "Belirtilmedi";
          salesInvoiceForm.data.relationships.details.data[0].relationships = new parasut.CompanyIdpurchaseBillsdetailedDataRelationshipsDetailsRelationships();
          salesInvoiceForm.data.relationships.details.data[0].relationships.product = new parasut.CompanyIdpurchaseBillsdetailedDataRelationshipsDetailsRelationshipsProduct();
          salesInvoiceForm.data.relationships.details.data[0].relationships.product.data = new parasut.CompanyIdpurchaseBillsdetailedDataRelationshipsDetailsRelationshipsProductData();
          salesInvoiceForm.data.relationships.details.data[0].relationships.product.data.id = "";
          salesInvoiceForm.data.relationships.details.data[0].relationships.product.data.type = "products";
          salesInvoiceForm.data.relationships.contact = new parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier();
          salesInvoiceForm.data.relationships.contact.data = new parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData();
          salesInvoiceForm.data.relationships.contact.data.id = "";
          salesInvoiceForm.data.relationships.contact.data.type = "contacts";
          salesInvoiceForm.data.relationships.category = new parasut.CompanyIdbankFeesDataRelationshipsCategory();
          salesInvoiceForm.data.relationships.category.data = new parasut.CompanyIdbankFeesDataRelationshipsCategoryData();
          salesInvoiceForm.data.relationships.category.data.id = "";
          salesInvoiceForm.data.relationships.category.data.type = "item_categories";
          salesInvoiceForm.data.relationships.tags = new parasut.CompanyIdbankFeesDataRelationshipsTags();
          salesInvoiceForm.data.relationships.tags.data = [new parasut.CompanyIdbankFeesDataRelationshipsTagsData()];
          salesInvoiceForm.data.relationships.tags.data[0].id = "";
          salesInvoiceForm.data.relationships.tags.data[0].type = "tags";
          salesInvoiceForm.data.relationships.salesOffer = new parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer();
          salesInvoiceForm.data.relationships.salesOffer.data = new parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData();
          salesInvoiceForm.data.relationships.salesOffer.data.id = "";
          salesInvoiceForm.data.relationships.salesOffer.data.type = "sales_offers";
          var opts = {};
          opts.include = "include_example";

          instance.updateSalesInvoice(companyId, id, salesInvoiceForm, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse20112);
            expect(data.data).to.be.a(parasut.SalesInvoice);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("sales_invoices");
              expect(data.data.attributes).to.be.a(parasut.SalesInvoiceAttributes);
                    expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.invoiceNo).to.be.a('string');
                expect(data.data.attributes.invoiceNo).to.be("");
                expect(data.data.attributes.netTotal).to.be.a('number');
                expect(data.data.attributes.netTotal).to.be();
                expect(data.data.attributes.grossTotal).to.be.a('number');
                expect(data.data.attributes.grossTotal).to.be();
                expect(data.data.attributes.withholding).to.be.a('number');
                expect(data.data.attributes.withholding).to.be();
                expect(data.data.attributes.totalExciseDuty).to.be.a('number');
                expect(data.data.attributes.totalExciseDuty).to.be();
                expect(data.data.attributes.totalCommunicationsTax).to.be.a('number');
                expect(data.data.attributes.totalCommunicationsTax).to.be();
                expect(data.data.attributes.totalVat).to.be.a('number');
                expect(data.data.attributes.totalVat).to.be();
                expect(data.data.attributes.vatWithholding).to.be.a('number');
                expect(data.data.attributes.vatWithholding).to.be();
                expect(data.data.attributes.totalDiscount).to.be.a('number');
                expect(data.data.attributes.totalDiscount).to.be();
                expect(data.data.attributes.totalInvoiceDiscount).to.be.a('number');
                expect(data.data.attributes.totalInvoiceDiscount).to.be();
                expect(data.data.attributes.beforeTaxesTotal).to.be.a('number');
                expect(data.data.attributes.beforeTaxesTotal).to.be();
                expect(data.data.attributes.remaining).to.be.a('number');
                expect(data.data.attributes.remaining).to.be();
                expect(data.data.attributes.remainingInTrl).to.be.a('number');
                expect(data.data.attributes.remainingInTrl).to.be();
                expect(data.data.attributes.paymentStatus).to.be.a('string');
                expect(data.data.attributes.paymentStatus).to.be("paid");
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.itemType).to.be.a('string');
                expect(data.data.attributes.itemType).to.be("invoice");
                expect(data.data.attributes.description).to.be.a('string');
                expect(data.data.attributes.description).to.be("");
                expect(data.data.attributes.issueDate).to.be.a(Date);
                expect(data.data.attributes.issueDate).to.be(new Date());
                expect(data.data.attributes.dueDate).to.be.a(Date);
                expect(data.data.attributes.dueDate).to.be(new Date());
                expect(data.data.attributes.invoiceSeries).to.be.a('string');
                expect(data.data.attributes.invoiceSeries).to.be("");
                expect(data.data.attributes.invoiceId).to.be.a('number');
                expect(data.data.attributes.invoiceId).to.be(0);
                expect(data.data.attributes.currency).to.be.a('string');
                expect(data.data.attributes.currency).to.be("TRL");
                expect(data.data.attributes.exchangeRate).to.be.a('number');
                expect(data.data.attributes.exchangeRate).to.be();
                expect(data.data.attributes.withholdingRate).to.be.a('number');
                expect(data.data.attributes.withholdingRate).to.be();
                expect(data.data.attributes.vatWithholdingRate).to.be.a('number');
                expect(data.data.attributes.vatWithholdingRate).to.be();
                expect(data.data.attributes.invoiceDiscountType).to.be.a('string');
                expect(data.data.attributes.invoiceDiscountType).to.be("percentage");
                expect(data.data.attributes.invoiceDiscount).to.be.a('number');
                expect(data.data.attributes.invoiceDiscount).to.be();
                expect(data.data.attributes.billingAddress).to.be.a('string');
                expect(data.data.attributes.billingAddress).to.be("");
                expect(data.data.attributes.billingPhone).to.be.a('string');
                expect(data.data.attributes.billingPhone).to.be("");
                expect(data.data.attributes.billingFax).to.be.a('string');
                expect(data.data.attributes.billingFax).to.be("");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.orderNo).to.be.a('string');
                expect(data.data.attributes.orderNo).to.be("");
                expect(data.data.attributes.orderDate).to.be.a(Date);
                expect(data.data.attributes.orderDate).to.be(new Date());
                expect(data.data.attributes.shipmentAddres).to.be.a('string');
                expect(data.data.attributes.shipmentAddres).to.be("");
                expect(data.data.attributes.shipmentIncluded).to.be.a('boolean');
                expect(data.data.attributes.shipmentIncluded).to.be(false);
                expect(data.data.attributes.cashSale).to.be.a('boolean');
                expect(data.data.attributes.cashSale).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.SalesInvoiceRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contact).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplier);
                      expect(data.data.relationships.contact.data).to.be.a(parasut.CompanyIdpurchaseBillsbasicDataRelationshipsSupplierData);
                        expect(data.data.relationships.contact.data.id).to.be.a('string');
                    expect(data.data.relationships.contact.data.id).to.be("");
                    expect(data.data.relationships.contact.data.type).to.be.a('string');
                    expect(data.data.relationships.contact.data.type).to.be("contacts");
                expect(data.data.relationships.details).to.be.a(parasut.SalesInvoiceRelationshipsDetails);
                      {
                    let dataCtr = data.data.relationships.details.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsDetailsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sales_invoice_details");
      
                            }
                  }
                expect(data.data.relationships.payments).to.be.a(parasut.PurchaseBillRelationshipsPayments);
                      {
                    let dataCtr = data.data.relationships.payments.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.PurchaseBillRelationshipsPaymentsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("payments");
      
                            }
                  }
                expect(data.data.relationships.tags).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTags);
                      {
                    let dataCtr = data.data.relationships.tags.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsTagsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("tags");
      
                            }
                  }
                expect(data.data.relationships.salesOffer).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOffer);
                      expect(data.data.relationships.salesOffer.data).to.be.a(parasut.CompanyIdsalesInvoicesDataRelationshipsSalesOfferData);
                        expect(data.data.relationships.salesOffer.data.id).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.id).to.be("");
                    expect(data.data.relationships.salesOffer.data.type).to.be.a('string');
                    expect(data.data.relationships.salesOffer.data.type).to.be("sales_offers");
                expect(data.data.relationships.sharings).to.be.a(parasut.SalesInvoiceRelationshipsSharings);
                      {
                    let dataCtr = data.data.relationships.sharings.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.SalesInvoiceRelationshipsSharingsData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("sharings");
      
                            }
                  }
                expect(data.data.relationships.recurrencePlan).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlan);
                      expect(data.data.relationships.recurrencePlan.data).to.be.a(parasut.PurchaseBillRelationshipsRecurrencePlanData);
                        expect(data.data.relationships.recurrencePlan.data.id).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.id).to.be("");
                    expect(data.data.relationships.recurrencePlan.data.type).to.be.a('string');
                    expect(data.data.relationships.recurrencePlan.data.type).to.be("recurrence_plans");
                expect(data.data.relationships.activeEDocument).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocument);
                      expect(data.data.relationships.activeEDocument.data).to.be.a(parasut.SalesInvoiceRelationshipsActiveEDocumentData);
                        expect(data.data.relationships.activeEDocument.data.id).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.id).to.be("");
                    expect(data.data.relationships.activeEDocument.data.type).to.be.a('string');
                    expect(data.data.relationships.activeEDocument.data.type).to.be("e_archives");
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse20014Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("item_categories");
                expect(data.attributes).to.be.a(Object);
                expect(data.attributes).to.be();
                expect(data.relationships).to.be.a(Object);
                expect(data.relationships).to.be();

                      }
            }

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
    });
  });

}));
