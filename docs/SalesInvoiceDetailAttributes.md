# parasut.SalesInvoiceDetailAttributes

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**netTotal** | **Number** | Ürün/hizmet net tutarı | [optional] 
**createdAt** | **Date** | Kayıt tarihi | [optional] 
**updatedAt** | **Date** | Son güncelleme tarihi | [optional] 
**quantity** | **Number** | Miktar | 
**unitPrice** | **Number** | Birim fiyatı | 
**vatRate** | **Number** | KDV oranı | 
**discountType** | **String** | İndirim türü | [optional] 
**discountValue** | **Number** |  | [optional] 
**exciseDutyType** | **String** | ÖTV tipi | [optional] 
**exciseDutyValue** | **Number** |  | [optional] 
**communicationsTaxRate** | **Number** | ÖİV oranı | [optional] 
**description** | **String** | Açıklama | [optional] 
**deliveryMethod** | **String** | Teslim Şartı | [optional] 
**shippingMethod** | **String** | Gönderim Şekli | [optional] 


<a name="DiscountTypeEnum"></a>
## Enum: DiscountTypeEnum


* `percentage` (value: `"percentage"`)

* `amount` (value: `"amount"`)




<a name="ExciseDutyTypeEnum"></a>
## Enum: ExciseDutyTypeEnum


* `percentage` (value: `"percentage"`)

* `amount` (value: `"amount"`)




<a name="DeliveryMethodEnum"></a>
## Enum: DeliveryMethodEnum


* `CFR` (value: `"CFR"`)

* `CIF` (value: `"CIF"`)

* `CIP` (value: `"CIP"`)

* `CPT` (value: `"CPT"`)

* `DAF` (value: `"DAF"`)

* `DDP` (value: `"DDP"`)

* `DDU` (value: `"DDU"`)

* `DEQ` (value: `"DEQ"`)

* `DES` (value: `"DES"`)

* `EXW` (value: `"EXW"`)

* `FAS` (value: `"FAS"`)

* `FCA` (value: `"FCA"`)

* `FOB` (value: `"FOB"`)

* `DAP` (value: `"DAP"`)

* `DAT` (value: `"DAT"`)




<a name="ShippingMethodEnum"></a>
## Enum: ShippingMethodEnum


* `belirtilmedi` (value: `"Belirtilmedi"`)

* `denizyolu` (value: `"Denizyolu"`)

* `demiryolu` (value: `"Demiryolu"`)

* `karayolu` (value: `"Karayolu"`)

* `havayolu` (value: `"Havayolu"`)

* `posta` (value: `"Posta"`)

* `okAral` (value: `"Çok araçlı"`)

* `sabitTamaTesisleri` (value: `"Sabit taşıma tesisleri"`)

* `suTamacl` (value: `"İç su taşımacılığı"`)




