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
    instance = new parasut.ContactsApi();
  });

  describe('(package)', function() {
    describe('ContactsApi', function() {
      describe('collectFromContact', function() {
        it('should call collectFromContact successfully', function(done) {
          // TODO: uncomment, update parameter values for collectFromContact call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var transactionForm = new parasut.TransactionForm2();
          transactionForm.data = new parasut.CompanyIdcontactsidcontactDebitTransactionsData();
          transactionForm.data.id = "";
          transactionForm.data.type = "transactions";
          transactionForm.data.attributes = new parasut.ContactCollectionFormAttributes();
          transactionForm.data.attributes.description = "";
          transactionForm.data.attributes.accountId = 0;
          transactionForm.data.attributes._date = new Date();
          transactionForm.data.attributes.amount = ;
          transactionForm.data.attributes.exchangeRate = ;
          transactionForm.data.attributes.payableIds = [0];
          var opts = {};
          opts.include = "include_example";

          instance.collectFromContact(companyId, id, transactionForm, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse2011);
            expect(data.data).to.be.a(parasut.Transaction);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("transactions");
              expect(data.data.attributes).to.be.a(parasut.TransactionAttributes);
                    expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.description).to.be.a('string');
                expect(data.data.attributes.description).to.be("");
                expect(data.data.attributes.transactionType).to.be.a('string');
                expect(data.data.attributes.transactionType).to.be("");
                expect(data.data.attributes._date).to.be.a(Date);
                expect(data.data.attributes._date).to.be(new Date());
                expect(data.data.attributes.amountInTrl).to.be.a('number');
                expect(data.data.attributes.amountInTrl).to.be();
                expect(data.data.attributes.debitAmount).to.be.a('number');
                expect(data.data.attributes.debitAmount).to.be();
                expect(data.data.attributes.debitCurrency).to.be.a('string');
                expect(data.data.attributes.debitCurrency).to.be("TRL");
                expect(data.data.attributes.creditAmount).to.be.a('number');
                expect(data.data.attributes.creditAmount).to.be();
                expect(data.data.attributes.creditCurrency).to.be.a('string');
                expect(data.data.attributes.creditCurrency).to.be("TRL");
              expect(data.data.relationships).to.be.a(parasut.TransactionRelationships);
                    expect(data.data.relationships.debitAccount).to.be.a(parasut.TransactionRelationshipsDebitAccount);
                      expect(data.data.relationships.debitAccount.data).to.be.a(parasut.TransactionRelationshipsDebitAccountData);
                        expect(data.data.relationships.debitAccount.data.id).to.be.a('string');
                    expect(data.data.relationships.debitAccount.data.id).to.be("");
                    expect(data.data.relationships.debitAccount.data.type).to.be.a('string');
                    expect(data.data.relationships.debitAccount.data.type).to.be("accounts");
                expect(data.data.relationships.creditAccount).to.be.a(parasut.TransactionRelationshipsDebitAccount);
                      expect(data.data.relationships.creditAccount.data).to.be.a(parasut.TransactionRelationshipsDebitAccountData);
                        expect(data.data.relationships.creditAccount.data.id).to.be.a('string');
                    expect(data.data.relationships.creditAccount.data.id).to.be("");
                    expect(data.data.relationships.creditAccount.data.type).to.be.a('string');
                    expect(data.data.relationships.creditAccount.data.type).to.be("accounts");
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
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse2001Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("accounts");
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
      describe('createContact', function() {
        it('should call createContact successfully', function(done) {
          // TODO: uncomment, update parameter values for createContact call and complete the assertions
          /*
          var companyId = 56;
          var contactForm = new parasut.ContactForm();
          contactForm.data = new parasut.CompanyIdcontactsData();
          contactForm.data.id = "";
          contactForm.data.type = "contacts";
          contactForm.data.attributes = new parasut.ContactAttributes();
          contactForm.data.attributes.email = "";
          contactForm.data.attributes.name = "";
          contactForm.data.attributes.shortName = "";
          contactForm.data.attributes.contactType = "person";
          contactForm.data.attributes.taxOffice = "";
          contactForm.data.attributes.taxNumber = "";
          contactForm.data.attributes.district = "";
          contactForm.data.attributes.city = "";
          contactForm.data.attributes.country = "";
          contactForm.data.attributes.address = "";
          contactForm.data.attributes.phone = "";
          contactForm.data.attributes.fax = "";
          contactForm.data.attributes.isAbroad = false;
          contactForm.data.attributes.archived = false;
          contactForm.data.attributes.iban = "";
          contactForm.data.attributes.accountType = "customer";
          contactForm.data.attributes.untrackable = false;
          contactForm.data.relationships = new parasut.CompanyIdcontactsDataRelationships();
          contactForm.data.relationships.category = new parasut.CompanyIdbankFeesDataRelationshipsCategory();
          contactForm.data.relationships.category.data = new parasut.CompanyIdbankFeesDataRelationshipsCategoryData();
          contactForm.data.relationships.category.data.id = "";
          contactForm.data.relationships.category.data.type = "item_categories";
          contactForm.data.relationships.contactPeople = new parasut.CompanyIdcontactsDataRelationshipsContactPeople();
          contactForm.data.relationships.contactPeople.data = [new parasut.CompanyIdcontactsDataRelationshipsContactPeopleData()];
          contactForm.data.relationships.contactPeople.data[0].id = "";
          contactForm.data.relationships.contactPeople.data[0].type = "contact_people";
          contactForm.data.relationships.contactPeople.data[0].attributes = new parasut.ContactPersonAttributes();
          contactForm.data.relationships.contactPeople.data[0].attributes.name = "";
          contactForm.data.relationships.contactPeople.data[0].attributes.email = "";
          contactForm.data.relationships.contactPeople.data[0].attributes.phone = "";
          contactForm.data.relationships.contactPeople.data[0].attributes.notes = "";
          var opts = {};
          opts.include = "include_example";

          instance.createContact(companyId, contactForm, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse2014);
            expect(data.data).to.be.a(parasut.Contact);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("contacts");
              expect(data.data.attributes).to.be.a(parasut.ContactAttributes);
                    expect(data.data.attributes.balance).to.be.a('number');
                expect(data.data.attributes.balance).to.be();
                expect(data.data.attributes.trlBalance).to.be.a('number');
                expect(data.data.attributes.trlBalance).to.be();
                expect(data.data.attributes.usdBalance).to.be.a('number');
                expect(data.data.attributes.usdBalance).to.be();
                expect(data.data.attributes.eurBalance).to.be.a('number');
                expect(data.data.attributes.eurBalance).to.be();
                expect(data.data.attributes.gbpBalance).to.be.a('number');
                expect(data.data.attributes.gbpBalance).to.be();
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.email).to.be.a('string');
                expect(data.data.attributes.email).to.be("");
                expect(data.data.attributes.name).to.be.a('string');
                expect(data.data.attributes.name).to.be("");
                expect(data.data.attributes.shortName).to.be.a('string');
                expect(data.data.attributes.shortName).to.be("");
                expect(data.data.attributes.contactType).to.be.a('string');
                expect(data.data.attributes.contactType).to.be("person");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.address).to.be.a('string');
                expect(data.data.attributes.address).to.be("");
                expect(data.data.attributes.phone).to.be.a('string');
                expect(data.data.attributes.phone).to.be("");
                expect(data.data.attributes.fax).to.be.a('string');
                expect(data.data.attributes.fax).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.iban).to.be.a('string');
                expect(data.data.attributes.iban).to.be("");
                expect(data.data.attributes.accountType).to.be.a('string');
                expect(data.data.attributes.accountType).to.be("customer");
                expect(data.data.attributes.untrackable).to.be.a('boolean');
                expect(data.data.attributes.untrackable).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.ContactRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contactPortal).to.be.a(parasut.ContactRelationshipsContactPortal);
                      expect(data.data.relationships.contactPortal.data).to.be.a(parasut.ContactRelationshipsContactPortalData);
                        expect(data.data.relationships.contactPortal.data.id).to.be.a('string');
                    expect(data.data.relationships.contactPortal.data.id).to.be("");
                    expect(data.data.relationships.contactPortal.data.type).to.be.a('string');
                    expect(data.data.relationships.contactPortal.data.type).to.be("contact_portals");
                expect(data.data.relationships.contactPeople).to.be.a(parasut.ContactRelationshipsContactPeople);
                      {
                    let dataCtr = data.data.relationships.contactPeople.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.ContactRelationshipsContactPeopleData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("contact_people");
      
                            }
                  }
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse2003Included);
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
      describe('deleteContact', function() {
        it('should call deleteContact successfully', function(done) {
          // TODO: uncomment, update parameter values for deleteContact call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;

          instance.deleteContact(companyId, id, function(error, data, response) {
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
      describe('listContacts', function() {
        it('should call listContacts successfully', function(done) {
          // TODO: uncomment, update parameter values for listContacts call and complete the assertions
          /*
          var companyId = 56;
          var opts = {};
          opts.filterName = "filterName_example";
          opts.filterEmail = "filterEmail_example";
          opts.filterTaxNumber = "filterTaxNumber_example";
          opts.filterTaxOffice = "filterTaxOffice_example";
          opts.filterCity = "filterCity_example";
          opts.sort = "-balance";
          opts.pageNumber = 1;
          opts.pageSize = 15;
          opts.include = "include_example";

          instance.listContacts(companyId, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse2003);
            {
              let dataCtr = data.data;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.Contact);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("contacts");
                expect(data.attributes).to.be.a(parasut.ContactAttributes);
                      expect(data.attributes.balance).to.be.a('number');
                  expect(data.attributes.balance).to.be();
                  expect(data.attributes.trlBalance).to.be.a('number');
                  expect(data.attributes.trlBalance).to.be();
                  expect(data.attributes.usdBalance).to.be.a('number');
                  expect(data.attributes.usdBalance).to.be();
                  expect(data.attributes.eurBalance).to.be.a('number');
                  expect(data.attributes.eurBalance).to.be();
                  expect(data.attributes.gbpBalance).to.be.a('number');
                  expect(data.attributes.gbpBalance).to.be();
                  expect(data.attributes.createdAt).to.be.a(Date);
                  expect(data.attributes.createdAt).to.be(new Date());
                  expect(data.attributes.updatedAt).to.be.a(Date);
                  expect(data.attributes.updatedAt).to.be(new Date());
                  expect(data.attributes.email).to.be.a('string');
                  expect(data.attributes.email).to.be("");
                  expect(data.attributes.name).to.be.a('string');
                  expect(data.attributes.name).to.be("");
                  expect(data.attributes.shortName).to.be.a('string');
                  expect(data.attributes.shortName).to.be("");
                  expect(data.attributes.contactType).to.be.a('string');
                  expect(data.attributes.contactType).to.be("person");
                  expect(data.attributes.taxOffice).to.be.a('string');
                  expect(data.attributes.taxOffice).to.be("");
                  expect(data.attributes.taxNumber).to.be.a('string');
                  expect(data.attributes.taxNumber).to.be("");
                  expect(data.attributes.district).to.be.a('string');
                  expect(data.attributes.district).to.be("");
                  expect(data.attributes.city).to.be.a('string');
                  expect(data.attributes.city).to.be("");
                  expect(data.attributes.country).to.be.a('string');
                  expect(data.attributes.country).to.be("");
                  expect(data.attributes.address).to.be.a('string');
                  expect(data.attributes.address).to.be("");
                  expect(data.attributes.phone).to.be.a('string');
                  expect(data.attributes.phone).to.be("");
                  expect(data.attributes.fax).to.be.a('string');
                  expect(data.attributes.fax).to.be("");
                  expect(data.attributes.isAbroad).to.be.a('boolean');
                  expect(data.attributes.isAbroad).to.be(false);
                  expect(data.attributes.archived).to.be.a('boolean');
                  expect(data.attributes.archived).to.be(false);
                  expect(data.attributes.iban).to.be.a('string');
                  expect(data.attributes.iban).to.be("");
                  expect(data.attributes.accountType).to.be.a('string');
                  expect(data.attributes.accountType).to.be("customer");
                  expect(data.attributes.untrackable).to.be.a('boolean');
                  expect(data.attributes.untrackable).to.be(false);
                expect(data.relationships).to.be.a(parasut.ContactRelationships);
                      expect(data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                        expect(data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                          expect(data.relationships.category.data.id).to.be.a('string');
                      expect(data.relationships.category.data.id).to.be("");
                      expect(data.relationships.category.data.type).to.be.a('string');
                      expect(data.relationships.category.data.type).to.be("item_categories");
                  expect(data.relationships.contactPortal).to.be.a(parasut.ContactRelationshipsContactPortal);
                        expect(data.relationships.contactPortal.data).to.be.a(parasut.ContactRelationshipsContactPortalData);
                          expect(data.relationships.contactPortal.data.id).to.be.a('string');
                      expect(data.relationships.contactPortal.data.id).to.be("");
                      expect(data.relationships.contactPortal.data.type).to.be.a('string');
                      expect(data.relationships.contactPortal.data.type).to.be("contact_portals");
                  expect(data.relationships.contactPeople).to.be.a(parasut.ContactRelationshipsContactPeople);
                        {
                      let dataCtr = data.relationships.contactPeople.data;
                      expect(dataCtr).to.be.an(Array);
                      expect(dataCtr).to.not.be.empty();
                      for (let p in dataCtr) {
                        let data = dataCtr[p];
                        expect(data).to.be.a(parasut.ContactRelationshipsContactPeopleData);
                        expect(data.id).to.be.a('string');
                        expect(data.id).to.be("");
                        expect(data.type).to.be.a('string');
                        expect(data.type).to.be("contact_people");
        
                              }
                    }

                      }
            }
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse2003Included);
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
      describe('payToContact', function() {
        it('should call payToContact successfully', function(done) {
          // TODO: uncomment, update parameter values for payToContact call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var transactionForm = new parasut.TransactionForm3();
          transactionForm.data = new parasut.CompanyIdcontactsidcontactCreditTransactionsData();
          transactionForm.data.id = "";
          transactionForm.data.type = "transactions";
          transactionForm.data.attributes = new parasut.ContactPaymentFormAttributes();
          transactionForm.data.attributes.description = "";
          transactionForm.data.attributes.accountId = 0;
          transactionForm.data.attributes._date = new Date();
          transactionForm.data.attributes.amount = ;
          transactionForm.data.attributes.exchangeRate = ;
          transactionForm.data.attributes.payableIds = [0];
          var opts = {};
          opts.include = "include_example";

          instance.payToContact(companyId, id, transactionForm, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse2011);
            expect(data.data).to.be.a(parasut.Transaction);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("transactions");
              expect(data.data.attributes).to.be.a(parasut.TransactionAttributes);
                    expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.description).to.be.a('string');
                expect(data.data.attributes.description).to.be("");
                expect(data.data.attributes.transactionType).to.be.a('string');
                expect(data.data.attributes.transactionType).to.be("");
                expect(data.data.attributes._date).to.be.a(Date);
                expect(data.data.attributes._date).to.be(new Date());
                expect(data.data.attributes.amountInTrl).to.be.a('number');
                expect(data.data.attributes.amountInTrl).to.be();
                expect(data.data.attributes.debitAmount).to.be.a('number');
                expect(data.data.attributes.debitAmount).to.be();
                expect(data.data.attributes.debitCurrency).to.be.a('string');
                expect(data.data.attributes.debitCurrency).to.be("TRL");
                expect(data.data.attributes.creditAmount).to.be.a('number');
                expect(data.data.attributes.creditAmount).to.be();
                expect(data.data.attributes.creditCurrency).to.be.a('string');
                expect(data.data.attributes.creditCurrency).to.be("TRL");
              expect(data.data.relationships).to.be.a(parasut.TransactionRelationships);
                    expect(data.data.relationships.debitAccount).to.be.a(parasut.TransactionRelationshipsDebitAccount);
                      expect(data.data.relationships.debitAccount.data).to.be.a(parasut.TransactionRelationshipsDebitAccountData);
                        expect(data.data.relationships.debitAccount.data.id).to.be.a('string');
                    expect(data.data.relationships.debitAccount.data.id).to.be("");
                    expect(data.data.relationships.debitAccount.data.type).to.be.a('string');
                    expect(data.data.relationships.debitAccount.data.type).to.be("accounts");
                expect(data.data.relationships.creditAccount).to.be.a(parasut.TransactionRelationshipsDebitAccount);
                      expect(data.data.relationships.creditAccount.data).to.be.a(parasut.TransactionRelationshipsDebitAccountData);
                        expect(data.data.relationships.creditAccount.data.id).to.be.a('string');
                    expect(data.data.relationships.creditAccount.data.id).to.be("");
                    expect(data.data.relationships.creditAccount.data.type).to.be.a('string');
                    expect(data.data.relationships.creditAccount.data.type).to.be("accounts");
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
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse2001Included);
                expect(data.id).to.be.a('string');
                expect(data.id).to.be("");
                expect(data.type).to.be.a('string');
                expect(data.type).to.be("accounts");
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
      describe('showContact', function() {
        it('should call showContact successfully', function(done) {
          // TODO: uncomment, update parameter values for showContact call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var opts = {};
          opts.include = "include_example";

          instance.showContact(companyId, id, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse2014);
            expect(data.data).to.be.a(parasut.Contact);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("contacts");
              expect(data.data.attributes).to.be.a(parasut.ContactAttributes);
                    expect(data.data.attributes.balance).to.be.a('number');
                expect(data.data.attributes.balance).to.be();
                expect(data.data.attributes.trlBalance).to.be.a('number');
                expect(data.data.attributes.trlBalance).to.be();
                expect(data.data.attributes.usdBalance).to.be.a('number');
                expect(data.data.attributes.usdBalance).to.be();
                expect(data.data.attributes.eurBalance).to.be.a('number');
                expect(data.data.attributes.eurBalance).to.be();
                expect(data.data.attributes.gbpBalance).to.be.a('number');
                expect(data.data.attributes.gbpBalance).to.be();
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.email).to.be.a('string');
                expect(data.data.attributes.email).to.be("");
                expect(data.data.attributes.name).to.be.a('string');
                expect(data.data.attributes.name).to.be("");
                expect(data.data.attributes.shortName).to.be.a('string');
                expect(data.data.attributes.shortName).to.be("");
                expect(data.data.attributes.contactType).to.be.a('string');
                expect(data.data.attributes.contactType).to.be("person");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.address).to.be.a('string');
                expect(data.data.attributes.address).to.be("");
                expect(data.data.attributes.phone).to.be.a('string');
                expect(data.data.attributes.phone).to.be("");
                expect(data.data.attributes.fax).to.be.a('string');
                expect(data.data.attributes.fax).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.iban).to.be.a('string');
                expect(data.data.attributes.iban).to.be("");
                expect(data.data.attributes.accountType).to.be.a('string');
                expect(data.data.attributes.accountType).to.be("customer");
                expect(data.data.attributes.untrackable).to.be.a('boolean');
                expect(data.data.attributes.untrackable).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.ContactRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contactPortal).to.be.a(parasut.ContactRelationshipsContactPortal);
                      expect(data.data.relationships.contactPortal.data).to.be.a(parasut.ContactRelationshipsContactPortalData);
                        expect(data.data.relationships.contactPortal.data.id).to.be.a('string');
                    expect(data.data.relationships.contactPortal.data.id).to.be("");
                    expect(data.data.relationships.contactPortal.data.type).to.be.a('string');
                    expect(data.data.relationships.contactPortal.data.type).to.be("contact_portals");
                expect(data.data.relationships.contactPeople).to.be.a(parasut.ContactRelationshipsContactPeople);
                      {
                    let dataCtr = data.data.relationships.contactPeople.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.ContactRelationshipsContactPeopleData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("contact_people");
      
                            }
                  }
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse2003Included);
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
      describe('updateContact', function() {
        it('should call updateContact successfully', function(done) {
          // TODO: uncomment, update parameter values for updateContact call and complete the assertions
          /*
          var companyId = 56;
          var id = 56;
          var contactForm = new parasut.ContactForm1();
          contactForm.data = new parasut.CompanyIdcontactsData();
          contactForm.data.id = "";
          contactForm.data.type = "contacts";
          contactForm.data.attributes = new parasut.ContactAttributes();
          contactForm.data.attributes.email = "";
          contactForm.data.attributes.name = "";
          contactForm.data.attributes.shortName = "";
          contactForm.data.attributes.contactType = "person";
          contactForm.data.attributes.taxOffice = "";
          contactForm.data.attributes.taxNumber = "";
          contactForm.data.attributes.district = "";
          contactForm.data.attributes.city = "";
          contactForm.data.attributes.country = "";
          contactForm.data.attributes.address = "";
          contactForm.data.attributes.phone = "";
          contactForm.data.attributes.fax = "";
          contactForm.data.attributes.isAbroad = false;
          contactForm.data.attributes.archived = false;
          contactForm.data.attributes.iban = "";
          contactForm.data.attributes.accountType = "customer";
          contactForm.data.attributes.untrackable = false;
          contactForm.data.relationships = new parasut.CompanyIdcontactsDataRelationships();
          contactForm.data.relationships.category = new parasut.CompanyIdbankFeesDataRelationshipsCategory();
          contactForm.data.relationships.category.data = new parasut.CompanyIdbankFeesDataRelationshipsCategoryData();
          contactForm.data.relationships.category.data.id = "";
          contactForm.data.relationships.category.data.type = "item_categories";
          contactForm.data.relationships.contactPeople = new parasut.CompanyIdcontactsDataRelationshipsContactPeople();
          contactForm.data.relationships.contactPeople.data = [new parasut.CompanyIdcontactsDataRelationshipsContactPeopleData()];
          contactForm.data.relationships.contactPeople.data[0].id = "";
          contactForm.data.relationships.contactPeople.data[0].type = "contact_people";
          contactForm.data.relationships.contactPeople.data[0].attributes = new parasut.ContactPersonAttributes();
          contactForm.data.relationships.contactPeople.data[0].attributes.name = "";
          contactForm.data.relationships.contactPeople.data[0].attributes.email = "";
          contactForm.data.relationships.contactPeople.data[0].attributes.phone = "";
          contactForm.data.relationships.contactPeople.data[0].attributes.notes = "";
          var opts = {};
          opts.include = "include_example";

          instance.updateContact(companyId, id, contactForm, opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(parasut.InlineResponse2014);
            expect(data.data).to.be.a(parasut.Contact);
                  expect(data.data.id).to.be.a('string');
              expect(data.data.id).to.be("");
              expect(data.data.type).to.be.a('string');
              expect(data.data.type).to.be("contacts");
              expect(data.data.attributes).to.be.a(parasut.ContactAttributes);
                    expect(data.data.attributes.balance).to.be.a('number');
                expect(data.data.attributes.balance).to.be();
                expect(data.data.attributes.trlBalance).to.be.a('number');
                expect(data.data.attributes.trlBalance).to.be();
                expect(data.data.attributes.usdBalance).to.be.a('number');
                expect(data.data.attributes.usdBalance).to.be();
                expect(data.data.attributes.eurBalance).to.be.a('number');
                expect(data.data.attributes.eurBalance).to.be();
                expect(data.data.attributes.gbpBalance).to.be.a('number');
                expect(data.data.attributes.gbpBalance).to.be();
                expect(data.data.attributes.createdAt).to.be.a(Date);
                expect(data.data.attributes.createdAt).to.be(new Date());
                expect(data.data.attributes.updatedAt).to.be.a(Date);
                expect(data.data.attributes.updatedAt).to.be(new Date());
                expect(data.data.attributes.email).to.be.a('string');
                expect(data.data.attributes.email).to.be("");
                expect(data.data.attributes.name).to.be.a('string');
                expect(data.data.attributes.name).to.be("");
                expect(data.data.attributes.shortName).to.be.a('string');
                expect(data.data.attributes.shortName).to.be("");
                expect(data.data.attributes.contactType).to.be.a('string');
                expect(data.data.attributes.contactType).to.be("person");
                expect(data.data.attributes.taxOffice).to.be.a('string');
                expect(data.data.attributes.taxOffice).to.be("");
                expect(data.data.attributes.taxNumber).to.be.a('string');
                expect(data.data.attributes.taxNumber).to.be("");
                expect(data.data.attributes.district).to.be.a('string');
                expect(data.data.attributes.district).to.be("");
                expect(data.data.attributes.city).to.be.a('string');
                expect(data.data.attributes.city).to.be("");
                expect(data.data.attributes.country).to.be.a('string');
                expect(data.data.attributes.country).to.be("");
                expect(data.data.attributes.address).to.be.a('string');
                expect(data.data.attributes.address).to.be("");
                expect(data.data.attributes.phone).to.be.a('string');
                expect(data.data.attributes.phone).to.be("");
                expect(data.data.attributes.fax).to.be.a('string');
                expect(data.data.attributes.fax).to.be("");
                expect(data.data.attributes.isAbroad).to.be.a('boolean');
                expect(data.data.attributes.isAbroad).to.be(false);
                expect(data.data.attributes.archived).to.be.a('boolean');
                expect(data.data.attributes.archived).to.be(false);
                expect(data.data.attributes.iban).to.be.a('string');
                expect(data.data.attributes.iban).to.be("");
                expect(data.data.attributes.accountType).to.be.a('string');
                expect(data.data.attributes.accountType).to.be("customer");
                expect(data.data.attributes.untrackable).to.be.a('boolean');
                expect(data.data.attributes.untrackable).to.be(false);
              expect(data.data.relationships).to.be.a(parasut.ContactRelationships);
                    expect(data.data.relationships.category).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategory);
                      expect(data.data.relationships.category.data).to.be.a(parasut.CompanyIdbankFeesDataRelationshipsCategoryData);
                        expect(data.data.relationships.category.data.id).to.be.a('string');
                    expect(data.data.relationships.category.data.id).to.be("");
                    expect(data.data.relationships.category.data.type).to.be.a('string');
                    expect(data.data.relationships.category.data.type).to.be("item_categories");
                expect(data.data.relationships.contactPortal).to.be.a(parasut.ContactRelationshipsContactPortal);
                      expect(data.data.relationships.contactPortal.data).to.be.a(parasut.ContactRelationshipsContactPortalData);
                        expect(data.data.relationships.contactPortal.data.id).to.be.a('string');
                    expect(data.data.relationships.contactPortal.data.id).to.be("");
                    expect(data.data.relationships.contactPortal.data.type).to.be.a('string');
                    expect(data.data.relationships.contactPortal.data.type).to.be("contact_portals");
                expect(data.data.relationships.contactPeople).to.be.a(parasut.ContactRelationshipsContactPeople);
                      {
                    let dataCtr = data.data.relationships.contactPeople.data;
                    expect(dataCtr).to.be.an(Array);
                    expect(dataCtr).to.not.be.empty();
                    for (let p in dataCtr) {
                      let data = dataCtr[p];
                      expect(data).to.be.a(parasut.ContactRelationshipsContactPeopleData);
                      expect(data.id).to.be.a('string');
                      expect(data.id).to.be("");
                      expect(data.type).to.be.a('string');
                      expect(data.type).to.be("contact_people");
      
                            }
                  }
            {
              let dataCtr = data.included;
              expect(dataCtr).to.be.an(Array);
              expect(dataCtr).to.not.be.empty();
              for (let p in dataCtr) {
                let data = dataCtr[p];
                expect(data).to.be.a(parasut.InlineResponse2003Included);
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
