# Fuxcel
Fuxcel Form Validator &amp; DOM Utility Plugin

> #### Form Validation plugin and fluent chainable DOM manipulation utility methods.

---

<br>

## Content

- [Installation - Getting started](#installation)
- [Installation - Note](#note)
- [Usage](#usage)
- [Utilities](#utilities)
- [Configuration Options](#available-config-options)
- [About](#about)
- [Creator](#creator)
- [Contributors](#contributors)
- [Acknowledgement](#acknowledgement)
- [Feedback](#feedback)
- [Contact](#contact)

<br>

## Installation

Fuxcel is standalone utility plugin. It does not require any extra plugin, library, or framework to function.<br>
Simply head over to the [latest release page](https://github.com/Bien-Glitch/fuxcel/releases/latest) to download the latest package assets and stay up to date.

> ### Once Fuxcel has been downloaded:
>
> - The ***Fuxcel Utility*** can be found in the `dist` folder.
> - Copy the files / folders in the `dist` folder to wherever you like in the root of your Web-Project.


Assuming you copied them into plugins folder; the structure in your project should be somewhat like this:

```
.\Project-root
+-- \plugins*
|   +-- \fuxcel*
|   |   +-- \css
|   |   +-- \images
|   |   +-- \js
|   |...
+-- index.html
|...
```

Now all that is left is to add them into your document as so:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Fuxcel Utility</title>
	
	<!-- [Stylesheets] -->
	<!-- Fuxcel CSS -->
	<link rel="stylesheet" href="%location to plugins folder%/fuxcel/css/fuxcel.css">
	
	<!--[ Scripts ]-->
	<!-- FB-FValidatorUtil JS -->
	<script defer src="%location to plugins folder%/fuxcel/js/fuxcel.js"></script>
</head>

<body>
	<!-- Your content goes here -->
</body>
</html>
```

> ### Note:
>
> #### To avoid errors:
>
> - The same goes for `bootstrap js` and `fontawesome js (if available)`; They should come before the `fusion.form.util.js`.

## Usage

*Firstly, ensure the stylesheets and scripts are linked correctly as in the above example. If you have problems getting it correctly, just copy the code in the example above and edit.*

- To initialize, you need a <Fuxcel> instance of the element to be manipulated.
- To initialize and configure the validator on a form, you need a `<Fuxcel>` instance of the form.<br>

#### *A utility function is available for getting the `<Fuxcel>` instance of elements.*

Built-in function `fx(selector, context)` is used to select or fetch the element(s) as a `<Fuxcel>` instance.

- The `selector` parameter selects the element(s) and it accepts either jQuery element Object, NodeList, HTML Element, HTML Collection, the elements tag name, or a CSS selector `e.g. '#login-form'`; as an argument.
- The `context` parameter is an optional element context from which to select the element(s), jQuery element Object, NodeList, HTML Element, HTML Collection, the elements tag name, or a CSS selector as an argument.

### Initializing:

Initializing the `<Fuxcel>` instance of an element is a breeze. An example is given below

```javascript
// Initializes <Fuxcel> instance on `div` element(s) with class `wrapper` 
fx('div.wrapper')

// initializes <Fuxcel> instance on element(s) with class `auth-form`
fx('.auth-form')

// initializes <Fuxcel> instance on element(s) with id `auth-form`
fx('#auth-form')

// initializes <Fuxcel> instance on element(s) with tagname `form`
fx('form')
```

#### Instantiating and initializing the validator (in your JS file):
Instantiating and initializing the validator is a breeze with fluent chainable methods.<br>
Using the plugin, You can add event-listeners like 'onsubmit' while instantiating validation. An illustration is given below:

Assuming you have a form:

```html
<form method="post" id="#login-form">
	<div class="form-group">
		<label for="title">title</label>
		<input type="text" minlength="" id="title" placeholder="title" class="form-field">
	</div>
	
	<div class="form-group">
		<label for="name">name</label>
		<input type="text" id="name" placeholder="name" class="form-field">
	</div>
	
	<div class="form-group">
		<select id="gender" class="form-field">
			<option value="" selected>Select Gender</option>
			<option value="male">Male</option>
			<option value="female">Female</option>
		</select>
		<label for="gender">gender</label>
	</div>
	
	<div class="form-group">
		<input type="email" id="email" placeholder="email" class="form-field">
		<label for="email">email</label>
	</div>
	
	<div class="form-group">
		<input type="password" id="password" name="password" class="form-field"/>
		<label for="password">password</label>
	</div>
	
	<div class="form-group">
		<input type="password" id="password_confirmation" name="password_confirmation" class="form-field"/>
		<label for="password_confirmation">confirm password</label>
	</div>
	
	<button type="submit" class="fx-btn fx-btn-primary">Register</button>
</form>
```

```javascript
// Instantiate the form:
const _loginForm = fx('#login-form');

// Set config Options
// N.B. Config options can be passed by reference via variables, or can be passed directly as an anonymous object.
const loginFormConfig = {
	config: {
		showIcons: true,
		showPassword: true,
		validateEmail: true,
	}
};

// Inintialize the validator on the form with optional config options.
_loginForm.formValidator.init(loginFormConfig).upon('submit', function (e) {
	e.preventDefault();
	/** Your On-Submission Logic goes here **/
	// Fuxcel Util can also manage your form submission Asynchronously, returning a promise. e.g:
	_loginForm.handleFormSubmit().then(resolve => console.log(resolve)).catch(error => console.log(error));
});
```

## Utilities

Fuxcel also provides you with Utilities (Functions & Methods) for manipulating DOM elements, handling events, AJAX requests, and other common web development tasks, thereby simplifying and streamlining your development process.
<p>Each of these functions and methods have specific functionalities and are outlined in this section of the documentation.</p>

> ### Utility Functions:
  > - #### `fx(selector, context)`:
  >   Instantiates new Fuxcel Object with selected element..<br>
  >   It takes two parameters:
  >   - `selector {string|Iterable<any>|any} (required)`: Selectable string or iterable.
  >   - `context {string|Iterable<any>|any} (optional)`: Context to select from.
  >
  >   <br> 
  >    
  >   Returns New Fuxcel Object.
  >
  >   ```javascript
  >    // Usage example:
  >    console.log(fx('body'));
  >   ```   
  >
  >   <br>
  >
  >
  > - #### `isBool(value)`:
  >   Checks if the given value is of type boolean.<br>
  >   It takes one parameter:
  >   - `value {any} (required)`: Value to check.
  >
  >   <br>
  >   
  >   Returns true if the given value is of type boolean; false otherwise.
  >
  >   ```javascript
  >    // Usage example:
  >    const check = true;
  >
  >    console.log(isBool(check)); // Logs `true` to the console
  >   ```
  >
  >   <br>
  >   
  >   
  > - #### `isDefined(value)`:
  >   Checks if the given value is defined (not null && not undefined && not an empty string).<br>
  >   It takes one parameter:
  >   - `value {any} (required)`: Value to check.
  >
  >   <br>
  >   
  >   Returns true if the given value is defined; false otherwise.
  >
  >   ```javascript
  >    // Usage example:
  >    const check = '';
  >
  >    console.log(isDefined(check)); // Logs `true` to the console
  >   ```
  >   
  >   <br>
  > 
  > 
  > - #### `isFunction(value)`:
  >   Checks if the given value is of type function.<br>
  >   It takes one parameter:
  >   - `value {any} (required)`: Value to check.
  >
  >   <br> 
  >    
  >   Returns true if the given value is of type function; false otherwise.
  >
  >   ```javascript
  >    // Usage example:
  >    const myFunc = () => console.log('My Function');
  >   
  >    console.log(isFunction(myFunc)); // Logs `true` to the console
  >   ```
  >
  >   <br>
  >  
  >  
  > - #### `isObject(value)`:
  >   Checks if the given value is of type object.<br>
  >   It takes one parameter:
  >   - `value {any} (required)`: Value to check.
  >
  >   <br> 
  >    
  >   Returns true if the given value is of type string; false otherwise.
  >
  >   ```javascript
  >    // Usage example:
  >    const user_details = {
  >        name: 'John Doe',
  >        email: 'johndoe@gmail.com',
  >        phone: '+234 805 000 0000'
  >    };
  >   
  >    console.log(isObject(user_details)); // Logs `true` to the console
  >   ```
  >   
  >   <br>
  >
  >
  > - #### `isString(value)`:
  >   Checks if the given value is of type string.<br>
  >   It takes one parameter:
  >   - `value {any} (required)`: Value to check.
  >
  >   <br> 
  >  
  >   Returns true if the given value is of type string; false otherwise.
  > 
  >   ```javascript
  >    // Usage example:
  >    const name = 'John Doe';
  >   
  >    console.log(isString(name)); // Logs `true` to the console
  >   ```
  >
  >   <br>
  >
  >
  > - #### `parseBool(value)`:
  >   Parse the given value and get its boolean value.<br>
  >   It takes one parameter:
  >   - `value {any} (required)`: Value to check.
  >
  >   <br>
  >
  >   Returns the boolean value of the given value (`true` or `false`).
  >
  >   ```javascript
  >    // Usage example:
  >    const bool = parseBool('yes');
  >   
  >    console.log(bool); // Logs `true` to the console
  >    /** 
  >     * Only returns true if the value is any of the following:
  >     * 1
  >     * '1'
  >     * 'yes'
  >     * 'true'
  >     * true
  >     */
  >   ```
  >
  >
  >   ### Fx Interface utility methods:
  >   The Fx interface also has some utility methods. They are used by calling the `fx` interface followed by the method.
  >   <br>
  >   
  >
  > - #### `fx.onDocumentLoad(listener)`:
  >   On document DOMContentLoaded event listener callback.<br>
  >   It takes one parameter:
  >   - `listener (required)`: Callback function to execute on DOMContentLoaded.
  >
  >   <br> 
  >    
  >   Perform given actions on DOMContentLoaded.
  >
  >   ```javascript
  >    // Usage example:
  >    fx.onDocumentLoad((e) => {
  >        console.log(e, 'Document Loaded!!!');
  >    });
  >   ```
  >
  >   <br>
  >
  >
  > - #### `fx.passLuhnAlgo(input)`:
  >   Check if given input passes the Luhn Algorithm Test.<br>
  >   It takes one parameter:
  >   - `input (required)`: Input string to be checked using the Luhn algorithm.
  >
  >   <br> 
  >    
  >   Returns true if the given input passes the Luhn Algorithm validation; false otherwise.
  >
  >   ```javascript
  >    // Usage example:
  >    const cardNumber = '452619383218234';
  >    const cardNumberIsValid = fx.passLuhnAlgo(cardNumber);
  >   
  >    console.log(cardNumberIsValid); // Logs `true` to the console if the input is valid; otherwise it logs `false`
  >   ```
  >
  >   <br>
  >
  >
  > - #### `fx.fetch(config)`:
  >   Perform a fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). It provides a convenient way to make fetch requests with various options and callbacks.<br>
  >   It supports different HTTP methods, request data, response data types, and allows for the execution of custom functions before sending the request, after completion, on success, and on error.<br>
  >   It takes an Object as its parameter, which contains the following properties:
  >   - `uri`: It represents the URI (Uniform Resource Identifier) or URL (Uniform Resource Locator) of the request.
  >   - `method`: It specifies the HTTP method to be used for the request. The default value is `'get'`.
  >   - `data`: It represents the data to be sent with the request. The default value is `null`.
  >   - `dataType`: It specifies the type of data expected in the response. The default value is `'json'`.
  >   - `beforeSend`: It is an optional function that is executed before sending the request; if available.
  >   - `onSuccess`: It is an optional function that is executed when the request is successful; if available.
  >   - `onError`: It is an optional function that is executed when the request encounters an error; if available.
  >   - `onComplete`: It is an optional function that is executed when the request is completed; if available.
  >
  >    <br>
  >
  >    - The `beforeSend` function is executed before the request is sent.
  >    - The `onSuccess` function is executed if the response status code falls within the range `200-299`, and the function is provided.
  >    - The `onError` function is executed if the response status code falls outside the status codes specified in the `onSuccess` && `onComplete` functions, and the function is provided.
  >    - The `onComplete` function is executed once the request is completed; if the response status code falls within the range `200-299`, or `308, 401, 402, 422, 423, 426, 451, 500, 511`, and the function is provided.
  >
  >    <br>
  >
  >    **N.B:**
  >    `onSuccess()`, `onError()`, and `onComplete()` has three arguments.<br>
  >    `onSuccess()` and `onComplete()` has :- `responseData`, `status`, and `statusText`, while;<br>
  >    `onError()` has :- `error`, `status`, and `statusText`.
  >
  >    <br>
  >
  >    - The `responseData` argument returns the servers' `respond data` in whatever format is giving while sending the request.
  >    - The `error` argument returns the `err` data if the server returns an error.
  >    - The `status` argument returns the `HTTP status code` of the servers' response.
  >    - The `statusText` argument returns the `HTTP status text` of the servers' response.
  >
  >   ```javascript
  >    // Usage example:
  >    const openWeatherAPIKey = '{put_your_api_key_here}', city = 'Port Harcourt';
  >    // Signup on https://openweathermap.org to get you API Key
  >   
  >    fx.fetch({
  >        uri: `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${openWeatherAPIKey}`,
  >        beforeSend: () => console.log(`Fetching Weather Report for ${city} city.`),
  >        onSuccess: (xhr, status, statusText) => console.log(xhr, status, statusText) // Logs the weather report response data, status and status text
  >    });
  >   ```
  > 
  >   <br>
  >
  >
  > - #### `fx.modal(config)`:
  >   Create quick simple modal with callbacks.<br>
  >   It takes an Object as its parameter, which contains the following properties:
  >   - `title`: Modal Title. The default value is `null`.
  >   - `type`: Modal Type. The default value is `'success'`.
  >   - `content`: Body Content of the Modal. The default value is `'Alert Content'`.
  >   - `confirmButtonText`: Text for Confirm Button.
  >   - `cancelButtonText`: Text for Cancel Button.
  >   - `html`: Use HTML content? else use Text content.
  >   - `onConfirm`: It is an optional function that is executed on confirm button click; if available.
  >   - `onCancel`: It is an optional function that is executed on cancel button click; if available.
  >   - `onEsc`: It is an optional function that is executed on Escape key use. Only works when cancel button is not available. [i.e. cancelButtonText is null]; if available.
  >
  >    <br>
  >
  >    - The `onConfirm` function is executed after the modal is hidden; if the confirm button is clicked.
  >    - The `onCancel` function is executed after the modal is hidden; if the cancel button is clicked.
  >    - The `onEsc` function is executed after the modal is hidden; if the Escape key on the keyboard is used.
  >
  >    <br>
  >
  >    **N.B:**
  >    `onConfirm()`, `onCancel()`, and `onEsc()` has two arguments.<br>
  >    `onConfirm()`, `onCancel()`, and `onEsc()` has :- `e`, and `modal`, while;<br>
  >
  >    <br>
  >
  >    - The `e` argument returns the modal hide event information.
  >    - The `modal` argument returns the `FuxcelModal` object of the modal.
  >
  >   ```javascript
  >    // Usage example:
  >    fx.modal({
  >        type: 'warning',
  >        content: '<h1>Test Alert</h1>',
  >        onEsc: (e, modal) => console.log('Modal closed using escape key.', e, modal),
  >    });
  >   ```

> ### Available Config Options:
>
> #### Regular Expressions `regExp` config options; For validating associated form fields using given Regular Expression.
>
>
> | Key          | Configurable Values | Default Value                                                | Description                                                                                            |
> | ------------ | ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
> | _name_       | **_RegExp string_** | `/^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi`            | RegExp string used to validate a `name` field <br> if `validateName` option is set to `true`           |
> | _username_   | **_RegExp string_** | `/^[a-zA-Z]+([_]?[a-zA-Z]){2,255}$/gi`                       | RegExp string used to validate a `username` field <br> if `validateUsername` option is set to `true`   |
> | _email_      | **_RegExp string_** | `/^\w+([.-]?\w+)*@\w+([.-]?\w{2,3})*(\.\w{2,3})$/gi`         | RegExp string used to validate an `email` field <br> if `validateEmail` option is set to `true`        |
> | _phone_      | **_RegExp string_** | `/^(\+\d{1,3}?\s)(\(\d{3}\)\s)?(\d+\s)*(\d{2,3}-?\d+)+$/g`   | RegExp string used to validate a `phone` field <br> if `validatePhone` option is set to `true`         |
> | _cardCVV_    | **_RegExp string_** | `/[0-9]{3,4}$/gi`                                            | RegExp string used to validate a `card cvv` field <br> if `validateCard` option is set to `true`       |
> | _cardNumber_ | **_RegExp string_** | `/^[0-9]+$/gi`                                               | RegExp string used to validate a `card number` field <br> if `validateCard` option is set to `true`    |
> | _password_   | **_RegExp string_** | `/[0-9A-Za-z]{8,32}/gi`                                      | RegExp string used to validate a `password` field <br> if `validatePassword` option is set to `true`   |
>
> These configuration options are accessible via the `regExp` sub Object and can be configured as follows:
>
> ```javascript
> config = {
>   regExp: {
>       name: value,
>       email: value,
>       phone: value,
>   }
> }
> ```
>
> <br>
>
> #### Step Form Wizard Config `stepForm` config options; Config options for the StepForm Validator.
>
>
> | Key              | Configurable Values                  | Default Value       | Description                                                  |
> | ---------------- | ------------------------------------ | ------------------- | ------------------------------------------------------------ |
> | _use_            | **_boolean <br> `true` or `false`_** | `true`              | boolean to toggle initializing form validator for step-form. |
> | _plugin_         | **_boolean <br> `true` or `false`_** | `false`             | Use the xsteps form wizard plugin (if available).            |
>
> These configuration options are accessible via the `stepForm` sub Object and can be configured as follows:
>
> <br>
>
> ```javascript
> config = {
>   stepForm: {
>       use: value,
>       plugin: value,
>       config: {
>           step: '.fx-step',
>           slides: false,
>           switch: '[data-step]'
>       }
>   }
> }
> ```
> 
> <br>
>
>  #### Validation Texts `texts` config options; Displayed misc validation texts.
>
>
> | Key                   | Configurable Values | Default Value       | Description                                         |
> | --------------------- | ------------------- | ------------------- | --------------------------------------------------- |
> | _capslock_            | **_string_**        | `'Capslock active'` | String to be displayed when CapsLock state is true. |
> | _emailFormat_         | **_string_**        | `null`              | String to be displayed as Email format example.     |
> | _nameFormat_          | **_string_**        | `null`              | String to be displayed as Name format example.      |
> | _passwordFormat_      | **_string_**        | `null`              | String to be displayed as Password format example.  |
> | _phoneFormat_         | **_string_**        | `null`              | String to be displayed as Phone format example.     |
> | _usernameFormat_      | **_string_**        | `null`              | String to be displayed as Username format example.  |
>
> These configuration options are accessible via the `texts` sub Object and can be configured as follows:
>
> ```javascript
> config = {
>   texts: {
>       capslock: 'value (e.g. Capslock)',
>       email: 'value (e.g. johndoe@gmail.com, exmail@mail.com)',
>   }
> }
> ```
>
> <br>
>
> #### Field Validation and validator `config` config options; For toggling validation state of form field elements and Base state of Validator.
>
>
> | Key                 | Configurable Values                  | Default Value             | Description                                                                                                                   |
> | ------------------- | ------------------------------------ |-------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
> | _capslockAlert_     | **_boolean <br> `true` or `false`_** | `true`                    | boolean to toggle showing the capslock Alert.                                                                                 |
> | _showIcons_         | **_boolean <br> `true` or `false`_** | `true`                    | boolean to toggle showing the validation icons on the field elements.                                                         |
> | _showPassword_      | **_boolean <br> `true` or `false`_** | `true`                    | boolean to toggle showing the password type toggler icon.                                                                     |
> | _validateCard_      | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Card Number and CVV field validation.                                                                       |
> | _validateName_      | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Name field validation.                                                                                      |
> | _validateEmail_     | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Email field validation.                                                                                     |
> | _validatePhone_     | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Phone Number field validation.                                                                              |
> | _validatePassword_  | **_boolean <br> `true` or `false`_** | `true`                    | boolean to toggle Password field validation<br> (***Mostly used if there is a password confirmation field***).                |
> | _validateUsername_  | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Username field validation.                                                                                  |
> | _nativeValidation_  | **_boolean <br> `true` or `false`_** | `false`                   | boolean to toggle Native HTML Validation on the form.                                                                         |
> | _useDefaultStyling_ | **_boolean <br> `true` or `false`_** | `true`                    | boolean to toggle using the validators default styling for the fields. _Set to false if it interfares with your set styling._ |
> | _passwordId_        | **_string_**                         | `'password'`              | String that matches the`id` of the `password field`.                                                                          |
> | _passwordConfirmId_ | **_string_**                         | `'password_confirmation'` | String that matches the`id` of the `confirm password field`.                                                                  |
> | _initWrapper_       | **_string_**                         | `'.form-group'`           | String that matches the class for the wrapper element parent of each `label` and `input`.                                     |
>
> These configuration options are accessible via the `config` sub Object and can be configured as follows:
>
> ```javascript
> config = {
>   config: {
>       showPassword: 'value (e.g true)',
>       validateName: value,
>       validateEmail: value,
>       validatePassword: value,
>       useDefaultStyling: value,
>       passwordConfirmId: 'value (e.g. confirm_password)'
>   }
> }
> ```

## About

Fuxcel Form Validator &amp; DOM Utitlity Plugin is an easy-to-use JS plugin for front-end form validation and miscellaneous utilities which requires little or no knowledge of JavaScript.<br>
The Fusion Utility & Form Validator is focused on providing utility functions for form validation, manipulating DOM elements, handling events, AJAX requests, and other common web development tasks.<br>
By incorporating this plugin into your projects, you simplify and streamline your development process; It offers an abstraction layer over standard JavaScript APIs, making it easier to perform common operations and tasks.
Read through this documentation on how to set it up, and you're ready to go. It's fun to use and hassle-free.

## Creator

<a href="https://github.com/Bien-Glitch" title="Bien Nwinate">
	<img alt="Bien Nwinate" title="Bien Nwinate" src="https://avatars.githubusercontent.com/u/51288549?s=96&v=4mask=circle" style="border-radius: 50%;height: 45px;width: 45px;object-fit: cover">
</a>

- [Twitter](https://twitter.com/nwinate)
- [Linkedin](https://www.linkedin.com/in/nwinate-bien-609ab9175/)
- [Facebook](https://www.facebook.com/moses.bien)
- Team member:
   - [Guereella Innovations](https://github.com/Ginn-ng)
	- [ScaletFox ltd](https://github.com/scaletfoxltd)
	- [Loop DevOps LLC](https://github.com/officialLoopDevOps)
	- [Vorldline Team](https://github.com/Vorldline)

## Contributors

<div style="display: flex;flex-wrap: wrap">
<div style="display: flex;flex-direction: column;padding: 5px">
	<a href="https://github.com/Ben-Chanan008" title="Great Ben">
		<img alt="Ben-Chanan" title="Great Ben" src="https://avatars.githubusercontent.com/u/119743454?v=4&mask=circle" style="border-radius: 50%;height: 45px;width: 45px;object-fit: cover">
	</a>
	<div style="display: flex;flex-direction: column">Team member:
		<ul>
			<li><a href="https://github.com/scaletfoxltd">ScaletFox ltd</a></li>
		</ul>
	</div>
</div>
</div>

## Acknowledgement

Thanks to God Almighty for making this project a possible. Also, a huge thanks to:

[//]: # (- [Guereella Innovations]&#40;https://github.com/Ginn-ng&#41;)
- [Xcella](https://github.com/xcella)
- [ScaletFox ltd](https://github.com/scaletfoxltd)
- [David Jaja](https://github.com/mrokojaja)
- [Great Ben](https://github.com/Ben-Chanan008)
- [Victor](https://github.com/echovick)
- [Omotayo](https://github.com/omotayosam)
- [Jacob](https://github.com/BojakePoleman)
- [Daniel](https://github.com/chigaemezu)
- And many others for their huge support

## Feedback

If you discover a vulnerability or bug within the plugin, or have an improvement,
Please [open an issue on the GitHub page](https://github.com/Bien-Glitch/fusion.form.validator/issues) or send an e-mail to Bien Nwinate via [fusionboltinc@gmail.com](mailto:fusionboltinc@gmail.com).
All issues will be promptly addressed.

## Contact

- E-Mail: [fusionboltinc@gmail.com](mailto:fusionboltinc@gmail.com)
- Whatsapp DM: +234 815 744 9189

