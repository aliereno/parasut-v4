# parasut.PurchaseBillDetailedFormAttributes

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**itemType** | **String** |  | 
**description** | **String** |  | [optional] 
**issueDate** | **Date** |  | 
**dueDate** | **Date** |  | 
**invoiceNo** | **String** |  | [optional] 
**currency** | **String** |  | 
**exchangeRate** | **Number** |  | [optional] 
**withholdingRate** | **Number** |  | [optional] 
**vatWithholdingRate** | **Number** |  | [optional] 
**invoiceDiscount** | **Number** |  | [optional] 
**invoiceDiscountType** | **String** |  | [optional] 


<a name="ItemTypeEnum"></a>
## Enum: ItemTypeEnum


* `purchaseBill` (value: `"purchase_bill"`)

* `refund` (value: `"refund"`)




<a name="CurrencyEnum"></a>
## Enum: CurrencyEnum


* `TRL` (value: `"TRL"`)

* `USD` (value: `"USD"`)

* `EUR` (value: `"EUR"`)

* `GBP` (value: `"GBP"`)




<a name="InvoiceDiscountTypeEnum"></a>
## Enum: InvoiceDiscountTypeEnum


* `percentage` (value: `"percentage"`)

* `amount` (value: `"amount"`)




