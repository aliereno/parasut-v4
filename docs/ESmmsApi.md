# parasut.ESmmsApi

All URIs are relative to *https://api.parasut.com/v4*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createESmm**](ESmmsApi.md#createESmm) | **POST** /{company_id}/e_smms | Create
[**showESmm**](ESmmsApi.md#showESmm) | **GET** /{company_id}/e_smms/{id} | Show
[**showESmmPdf**](ESmmsApi.md#showESmmPdf) | **GET** /{company_id}/e_smms/{id}.pdf | Show PDF


<a name="createESmm"></a>
# **createESmm**
> InlineResponse2016 createESmm(companyId, eSmmForm)

Create



### Example
```javascript
var parasut = require('parasut-v4');
var defaultClient = parasut.ApiClient.instance;

// Configure OAuth2 access token for authorization: parasut_auth
var parasut_auth = defaultClient.authentications['parasut_auth'];
parasut_auth.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new parasut.ESmmsApi();

var companyId = 56; // Number | Firma ID

var eSmmForm = new parasut.ESmmForm(); // ESmmForm | 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createESmm(companyId, eSmmForm, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **companyId** | **Number**| Firma ID | 
 **eSmmForm** | [**ESmmForm**](ESmmForm.md)|  | 

### Return type

[**InlineResponse2016**](InlineResponse2016.md)

### Authorization

[parasut_auth](../README.md#parasut_auth)

### HTTP request headers

 - **Content-Type**: application/vnd.api+json
 - **Accept**: application/vnd.api+json

<a name="showESmm"></a>
# **showESmm**
> InlineResponse2008 showESmm(companyId, id, opts)

Show



### Example
```javascript
var parasut = require('parasut-v4');
var defaultClient = parasut.ApiClient.instance;

// Configure OAuth2 access token for authorization: parasut_auth
var parasut_auth = defaultClient.authentications['parasut_auth'];
parasut_auth.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new parasut.ESmmsApi();

var companyId = 56; // Number | Firma ID

var id = 56; // Number | ESmm ID

var opts = { 
  'include': "include_example" // String | Response ile birlikte geri dönmesini istediğiniz ilişkiler - *Available: sales_invoice*
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.showESmm(companyId, id, opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **companyId** | **Number**| Firma ID | 
 **id** | **Number**| ESmm ID | 
 **include** | **String**| Response ile birlikte geri dönmesini istediğiniz ilişkiler - *Available: sales_invoice* | [optional] 

### Return type

[**InlineResponse2008**](InlineResponse2008.md)

### Authorization

[parasut_auth](../README.md#parasut_auth)

### HTTP request headers

 - **Content-Type**: application/vnd.api+json
 - **Accept**: application/vnd.api+json

<a name="showESmmPdf"></a>
# **showESmmPdf**
> InlineResponse2005 showESmmPdf(companyId, id)

Show PDF



### Example
```javascript
var parasut = require('parasut-v4');
var defaultClient = parasut.ApiClient.instance;

// Configure OAuth2 access token for authorization: parasut_auth
var parasut_auth = defaultClient.authentications['parasut_auth'];
parasut_auth.accessToken = 'YOUR ACCESS TOKEN';

var apiInstance = new parasut.ESmmsApi();

var companyId = 56; // Number | Firma ID

var id = 56; // Number | ESmm ID


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.showESmmPdf(companyId, id, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **companyId** | **Number**| Firma ID | 
 **id** | **Number**| ESmm ID | 

### Return type

[**InlineResponse2005**](InlineResponse2005.md)

### Authorization

[parasut_auth](../README.md#parasut_auth)

### HTTP request headers

 - **Content-Type**: application/vnd.api+json
 - **Accept**: application/vnd.api+json

