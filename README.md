<div align="center">

<img src="https://github.com/Bien-Glitch/fuxcel/blob/release/2.1.0/icon.png?raw=true" height="64" width="64" style="border-radius:50%" alt="Fuxcel Logo"/>

# Fuxcel

**Form Validator & DOM Utility Plugin**

A powerful, lightweight, standalone, zero-dependency JavaScript library for form validation and fluent chainable DOM manipulation.

[![License](https://img.shields.io/github/license/Bien-Glitch/fuxcel?style=flat-square)](https://github.com/Bien-Glitch/fuxcel/blob/main/LICENSE)
[![Latest Release](https://img.shields.io/github/v/release/Bien-Glitch/fuxcel?style=flat-square)](https://github.com/Bien-Glitch/fuxcel/releases/latest)
[![Issues](https://img.shields.io/github/issues/Bien-Glitch/fuxcel?style=flat-square)](https://github.com/Bien-Glitch/fuxcel/issues)

</div>

---

Features

[//]: # (- 🎭 **Multi-step Forms** - Easy wizard-style form management)

- ✅ **Advanced Form Validation** - Built-in validators with real-time feedback
- 🎨 **Zero Dependencies** - Pure JavaScript, no external libraries
- 🎬 **Rich Animations** - Fade, slide, zoom, and blink effects
- 🏗️ **DOM Manipulation** - Chainable DOM manipulation with full Fuxcel-instance awareness
- 🪟 **Modal System** - Beautiful, customizable modals and alerts
- 📡 **HTTP Client** - Modern fetch API wrapper, with SPA-style page navigation and structured responses
- 📱 **Mobile-First** - Touch and device detection built-in
- 🔒 **Type-Safe** - Full TypeScript support

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Utilities](#utilities)
- [Configuration Options](#configuration-options)
- [About](#about)
- [Creator](#creator)
- [Contributors](#contributors)
- [Acknowledgements](#acknowledgements)
- [Feedback](#feedback)
- [Contact](#contact)

---

## Installation

Fuxcel is a standalone plugin — it requires no external libraries, frameworks, or dependencies.

### NPM

```bash
npm install fuxcel
```

Or head over to the [latest release page](https://github.com/Bien-Glitch/fuxcel/releases/latest) to download the latest package.

**Once downloaded:**

- The Fuxcel assets can be found in the `dist` folder.
- Copy the contents of `dist` into your project wherever you prefer.

Assuming you copy them into a `plugins` folder, your project structure should look like this:

```
project-root/
├── {asset_directory}/
│   └── fuxcel/
│       ├── css/
│       └── js/
└── index.html
```

Then link the assets in your HTML document:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>My App</title>
	
	<!-- Fuxcel CSS -->
	<link rel="stylesheet" href="{asset_directory}/fuxcel/css/fuxcel.css">
	
	<!-- Fuxcel JS -->
	<script defer src="{asset_directory}/fuxcel/js/fuxcel.js"></script>
</head>
<body>
	<!-- Your content here -->
</body>
</html>
```

> **Note:** If you are using Bootstrap JS or Font Awesome JS, ensure they are loaded before `fuxcel.js`.

---

## Quick Start

```javascript
// Select element(s) and manipulate them (addind event lsteners)
fx('#myButton').upon('click', function () {
	fx(this).fadein(300);
});

// Form validation made easy
fx('#myForm').formValidator.init({
	config: {
		validateEmail: true,
		validatePassword: true
	}
});

// Create beautiful modals
fx.modal({
	type: 'success',
	content: 'Operation completed successfully!',
	confirmButtonText: 'OK'
});

// Fetch API wrapper
fx.fetch({
	uri: '/api/users',
	method: 'get',
	onSuccess: (response) => {
		console.log(response.responseJSON);
	}
});
```

## Usage

Ensure the stylesheet and script are linked correctly as shown above before proceeding.

### The `fx()` Function

Fuxcel exposes a global `fx(selector, context)` function that returns a `Fuxcel` instance of the selected element(s).

| Parameter  | Type                                                  | Required | Description                     |
|------------|-------------------------------------------------------|----------|---------------------------------|
| `selector` | `string \| NodeList \| HTMLElement \| HTMLCollection` | ✅        | The element(s) to select        |
| `context`  | `string \| NodeList \| HTMLElement \| HTMLCollection` | ❌        | Optional context to select from |

### Selector

Select elements using CSS selectors:

```javascript
fx('#id')              // Select by ID
fx('.class')           // Select by class
fx('div')              // Select by tag
fx('[data-attr]')      // Select by attribute
fx('#parent .child')   // Nested selection
```

### DOM Manipulation

#### Class Management

```javascript
fx('#element').putClass('active', 'highlight') // Add class `active` and `highlight` to the classlist of the selected element.
fx('#element').removeClass('inactive') // Remove class `inactive`from the classlist of the selected element.
fx('#element').toggleClass('visible') // Toggle class `visible` to the classlist of the selected element.
fx('#element').hasClass('active') // returns boolean.
fx('#element').replaceClass('old', 'new') // Replace class `new` with class `old` - 'adds `new` to the classlist if `old` is not found'.
```

#### Attributes & Properties

```javascript
// Attributes
fx('#input').attrib('placeholder', 'Enter text')
fx('#input').attrib('disabled', true)
const value = fx('#input').attrib('value')
fx('#input').removeAttrib('disabled')

// Data attributes
fx('#element').dataAttrib('user-id', '123')
const userId = fx('#element').dataAttrib('user-id')

// Properties
fx('#checkbox').prop('checked', true)
fx('#input').prop({disabled: true, required: true})

// Styles
fx('#box').style('background', 'blue')
fx('#box').style({width: '100px', height: '100px'})
```

#### Content & HTML

```javascript
fx('#element').innerText = 'New text'
fx('#element').insertHTML('<p>New content</p>')
fx('#element').insertHTML('<span>Before</span>', 'prefix')
fx('#container').innerHTML // Get HTML
```

#### Traversal

```javascript
fx('#element').children()                    // Direct children
fx('#element').children('.active')           // Filtered children
fx('#element').descendants()                 // All descendants
fx('#element').parents()                     // Parent elements
fx('#element').siblings()                    // Sibling elements
fx('#element').prevSiblings()               // Previous siblings
```

### Events

#### Event Listeners

```javascript
// Single event
fx('#button').upon('click', function (e) {
	console.log('Clicked!');
});

// Multiple events
fx('#input').upon(['focus', 'blur'], function (e) {
	console.log(e.type);
});

// Event object
fx('#form').upon({
	submit: function (e) {
		e.preventDefault();
	},
	reset: function (e) {
		console.log('Form reset');
	}
});

// Remove events
fx('#button').off('click')
fx('#button').off() // Remove all events
```

#### Trigger Events

```javascript
fx('#button').trigger('click')
fx('#input').trigger('focus', 'mouse')
fx('#form').trigger(new CustomEvent('validate'))
```

### Animations

All animations return Promises and support chainable syntax:

```javascript
// Fade animations
await fx('#element').fadein()
await fx('#element').fadein(500)           // 500ms duration
await fx('#element').fadeout(300, 'block') // Custom display

// Slide animations
await fx('#menu').slideindown()
await fx('#menu').slideoutup(400)
await fx('#panel').slideinleft(300)
await fx('#panel').slideoutright(500)

// Other animations
await fx('#box').zoomin(300)
await fx('#alert').blink(200, 3) // 3 iterations
await fx('#alert').shake(500, 2) // 2 iterations

// Chain animations
fx('#element')
	.fadein(300).then(() => fx('#element')
	.slideoutup(400));
```

You can also use the `fuxcel` alias:

```javascript
fuxcel('#myElement').fadein();
```

### Form Validation

Given the following form:

```html

<form method="post" id="login-form">
	<div class="form-group">
		<label for="title">Title</label>
		<input type="text" id="title" placeholder="Title" class="form-field">
	</div>
	
	<div class="form-group">
		<label for="name">Name</label>
		<input type="text" id="name" placeholder="Name" class="form-field">
	</div>
	
	<div class="form-group">
		<label for="gender">Gender</label>
		<select id="gender" class="form-field">
			<option value="" selected>Select Gender</option>
			<option value="male">Male</option>
			<option value="female">Female</option>
		</select>
	</div>
	
	<div class="form-group">
		<label for="email">Email</label>
		<input type="email" id="email" placeholder="Email" class="form-field">
	</div>
	
	<div class="form-group">
		<label for="password">Password</label>
		<input type="password" id="password" name="password" class="form-field">
	</div>
	
	<div class="form-group">
		<label for="password_confirmation">Confirm Password</label>
		<input type="password" id="password_confirmation" name="password_confirmation" class="form-field">
	</div>
	
	<button type="submit" class="fx-btn fx-btn-primary">Register</button>
</form>
```

Initialize and configure the validator in your JavaScript file:

```javascript
// Get the Fuxcel instance of the form
const _loginForm = fx('#login-form');

// Define config options
const loginFormConfig = {
	config: {
		showIcons: true,
		showPassword: true,
		validateEmail: true,
	}
};

// Initialize the validator with optional config, then attach an event listener
_loginForm.formValidator.init(loginFormConfig).upon('submit', function (e) {
	e.preventDefault();
	
	// Fuxcel can also handle form submission asynchronously, returning a promise:
	_loginForm.handleFormSubmit()
		.then(resolve => console.log(resolve))
		.catch(error => console.log(error));
});
```

#### Extending Validation to New Fields

If you add form fields to a form after the validator has already been initialized (e.g. dynamically inserted inputs), you don't need to re-run `init()` on the whole form. Call `extendValidation()` on the newly added `.form-group` element(s) instead:

```javascript
// Add a new field, then extend validation to include it
fx('#login-form').insertNode(newFormGroup, 'append');
fx(newFormGroup).extendValidation();

// Extend validation across multiple newly added form-groups at once
fx('.form-group.newly-added').extendValidation();
```

For each selected element, `extendValidation()`:

- Skips it (logging a `console.debug` message) if it doesn't have the `.form-group` class.
- Skips it if no parent `<form>` element is found.
- Skips it if the parent `<form>` has no `id` attribute _(required for validator tracking)_.
- Otherwise, forwards it to the validator, tagged with `'extendValidation'` as the source — so if the form-group was already validated, the resulting console warning identifies this method as the caller rather than a generic re-validation.

### Configuration Options

Config is passed as an object to `formValidator.init()`. It is organized into four sub-objects.

---

#### `regExp` — Regular Expression Overrides

Override the default regex patterns used to validate specific field types.

| Key          | Default                                                                             | Description                                                  |
|--------------|-------------------------------------------------------------------------------------|--------------------------------------------------------------|
| `name`       | `/^([a-zA-Z]{2,255})(\s[a-zA-Z]{2,255}){1,2}$/gi`                                   | Validates a name field when `validateName` is `true`         |
| `username`   | `/^(?=.{2,255}$)[a-zA-Z][a-zA-Z0-9]*(_[a-zA-Z0-9]+)*[a-zA-Z0-9]?$/gi`               | Validates a username field when `validateUsername` is `true` |
| `email`      | `/^[a-zA-Z][a-zA-Z0-9._%+\-]{0,63}@[a-zA-Z][a-zA-Z0-9.\-]{0,253}\.[a-zA-Z]{2,}$/gi` | Validates an email field when `validateEmail` is `true`      |
| `phone`      | `/^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/g`                | Validates a phone field when `validatePhone` is `true`       |
| `cardCVV`    | `/^\d{3,4}$/gi`                                                                     | Validates a CVV field when `validateCard` is `true`          |
| `cardNumber` | `/^(?=.{12,19}$)\d{12,19}$/gi`                                                      | Validates a card number field when `validateCard` is `true`  |
| `password`   | `/^(?=.*[a-z]).{8,32}$/gi`                                                          | Validates a password field when `validatePassword` is `true` |

```javascript
config = {
	regExp: {
		name: /your-custom-regex/,
		email: /your-custom-regex/,
		password: /your-custom-regex/,
	}
}
```

---

#### `stepForm` — Step Form Wizard Options

| Key      | Type      | Default | Description                                      |
|----------|-----------|---------|--------------------------------------------------|
| `use`    | `boolean` | `true`  | Toggle step form validator initialization        |
| `plugin` | `boolean` | `false` | Use the xsteps form wizard plugin (if available) |

```javascript
config = {
	stepForm: {
		use: true,
		plugin: false,
		config: {
			step: '.fx-step',
			slides: false,
			switch: '[data-step]',
		}
	}
}
```

---

#### `texts` — Validation Display Texts

Override the default text strings shown during validation.

| Key              | Type     | Default                                        | Description                  |
|------------------|----------|------------------------------------------------|------------------------------|
| `capslock`       | `string` | `'⚠ Caps Lock is on'`                          | Shown when Caps Lock is on   |
| `emailFormat`    | `string` | `null`                                         | Example email format hint    |
| `nameFormat`     | `string` | `null`                                         | Example name format hint     |
| `passwordFormat` | `string` | `'Password requires between 8-32 characters.'` | Example password format hint |
| `phoneFormat`    | `string` | `null`                                         | Example phone format hint    |
| `usernameFormat` | `string` | `null`                                         | Example username format hint |

```javascript
config = {
	texts: {
		capslock: '⚠ Caps Lock is on',
		emailFormat: 'e.g. johndoe@gmail.com',
	}
}
```

---

#### `config` — Field Validation Toggles

| Key                    | Type      | Default                   | Description                                                                                                                                                               |
|------------------------|-----------|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `capslockAlert`        | `boolean` | `true`                    | Show Caps Lock alert on password fields                                                                                                                                   |
| `showIcons`            | `boolean` | `true`                    | Show validation icons on fields                                                                                                                                           |
| `showPassword`         | `boolean` | `true`                    | Show password visibility toggle icon                                                                                                                                      |
| `validateCard`         | `boolean` | `false`                   | Enable card number and CVV validation                                                                                                                                     |
| `validateName`         | `boolean` | `false`                   | Enable name field validation                                                                                                                                              |
| `validateEmail`        | `boolean` | `true`                    | Enable email field validation                                                                                                                                             |
| `validatePhone`        | `boolean` | `false`                   | Enable phone number validation                                                                                                                                            |
| `validatePassword`     | `boolean` | `true`                    | Enable password validation (recommended when a confirmation field is present)                                                                                             |
| `validateUsername`     | `boolean` | `false`                   | Enable username field validation                                                                                                                                          |
| `nativeValidation`     | `boolean` | `false`                   | Enable native HTML5 form validation                                                                                                                                       |
| `useDefaultStyling`    | `boolean` | `false`                   | Use Fuxcel's default field styling. Set to `false` if it conflicts with your own styles                                                                                   |
| `showPasswordStrength` | `boolean` | `false`                   | Enable Password Strength Calculator. It returns `score: number`, `label: Strength`, `color: string`, `failed: string[]`, `passed: string[]`, and `rules: ExtractedRule[]` |
| `passwordId`           | `string`  | `'password'`              | The `id` of your password field                                                                                                                                           |
| `passwordConfirmId`    | `string`  | `'password_confirmation'` | The `id` of your confirm password field                                                                                                                                   |
| `initWrapper`          | `string`  | `'.form-group'`           | CSS class of the wrapper element containing each `label` and `input` pair                                                                                                 |

```javascript
config = {
	config: {
		showIcons: true,
		showPassword: true,
		validateEmail: true,
		validatePassword: true,
		useDefaultStyling: true,
		passwordConfirmId: 'confirm_password',
	}


}
```

---

---

## Utilities

Fuxcel provides a set of utility functions and methods for DOM manipulation, event handling, AJAX requests, and other common web tasks.

### Global Utility Functions

---

#### `fx(selector, context)`

Instantiates a new Fuxcel object with the selected element(s).

**Parameters:**

- `selector {string | Iterable | any}` *(required)* — Selectable string or iterable.
- `context {string | Iterable | any}` *(optional)* — Context to select from.

**Returns:** A new `Fuxcel` instance.

```javascript
console.log(fx('body'));
```

---

#### `isBool(value)`

Checks if the given value is of type `boolean`.

**Parameters:**

- `value {any}` *(required)* — Value to check.

**Returns:** `true` if the value is a boolean; `false` otherwise.

```javascript
const check = true;
console.log(isBool(check)); // true
```

---

#### `isDefined(value)`

Checks if the given value is defined — not `null`, `undefined`, or an empty string.

**Parameters:**

- `value {any}` *(required)* — Value to check.

**Returns:** `true` if defined; `false` otherwise.

```javascript
const check = '';
console.log(isDefined(check)); // false
```

---

#### `isFunction(value)`

Checks if the given value is of type `function`.

**Parameters:**

- `value {any}` *(required)* — Value to check.

**Returns:** `true` if the value is a function; `false` otherwise.

```javascript
const myFunc = () => console.log('My Function');
console.log(isFunction(myFunc)); // true
```

---

#### `isObject(value)`

Checks if the given value is of type `object`.

**Parameters:**

- `value {any}` *(required)* — Value to check.

**Returns:** `true` if the value is an object; `false` otherwise.

```javascript
const user = {name: 'John Doe', email: 'johndoe@gmail.com'};
console.log(isObject(user)); // true
```

---

#### `isString(value)`

Checks if the given value is of type `string`.

**Parameters:**

- `value {any}` *(required)* — Value to check.

**Returns:** `true` if the value is a string; `false` otherwise.

```javascript
const name = 'John Doe';
console.log(isString(name)); // true
```

---

#### `parseBool(value)`

Parses the given value and returns its boolean equivalent.

**Parameters:**

- `value {any}` *(required)* — Value to parse.

**Returns:** `true` or `false`.

Only returns `true` for: `1`, `'1'`, `'yes'`, `'true'`, `true`.

```javascript
const bool = parseBool('yes');
console.log(bool); // true
```

---

### `Fx` Interface Methods

These methods are called directly on the `fx` interface.

---

#### `fx.onDocumentLoad(listener)`

Registers a callback on the `DOMContentLoaded` event.

**Parameters:**

- `listener` *(required)* — Callback function to execute on `DOMContentLoaded`.

```javascript
fx.onDocumentLoad((e) => {
	console.log(e, 'Document Loaded!');
});
```

---

#### `fx.passLuhnAlgo(input)`

Checks if the given input passes the [Luhn Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) — used for card number validation.

**Parameters:**

- `input` *(required)* — The card number string to validate.

**Returns:** `true` if valid; `false` otherwise.

```javascript
const cardNumber = '4526193832182346';
const isValid = fx.passLuhnAlgo(cardNumber);
console.log(isValid); // true or false
```

---

#### `fx.fetch(config)`

Performs a fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with a convenient options interface.

**Config properties:**

| Property     | Description                                                                                     | Default  |
|--------------|-------------------------------------------------------------------------------------------------|----------|
| `uri`        | Request URL                                                                                     | `''`     |
| `method`     | HTTP method                                                                                     | `'get'`  |
| `data`       | Request payload                                                                                 | `null`   |
| `dataType`   | Expected response type                                                                          | `'json'` |
| `beforeSend` | Called before the request is sent                                                               | —        |
| `onSuccess`  | Called on status `200–299`                                                                      | —        |
| `onError`    | Called on error status codes *(Other HTTP codes outside `onSuccess` and `onComplete`)*          | —        |
| `onComplete` | Called on completion (`200–299`, `308`, `401`, `402`, `422`, `423`, `426`, `451`, `500`, `511`) | —        |

**Callback arguments:**

- `onSuccess(responseData, status, statusText)`
- `onComplete(responseData, status, statusText)`
- `onError(error, status, statusText)`

```javascript
const apiKey = '{your_api_key}';
const city = 'Port Harcourt';

fx.fetch({
	uri: `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`,
	beforeSend: () => console.log(`Fetching weather for ${city}...`),
	onSuccess: (data, status, statusText) => console.log(data, status, statusText),
});
```

---

#### `fx.fetchPage(url, dataType, beforeSend)`

Fetches page content via AJAX for SPA-style navigation. Resolves with a structured result object rather than a raw string.

**Parameters:**

- `url {string}` *(required)* — The URL to request.
- `dataType {'json' | 'text'}` *(required)* — Expected response type.
- `beforeSend {(() => void) | null}` *(optional)* — Called immediately before the request is sent.

**Returns:** `Promise<{ data, status, statusText }>`

```javascript
fx.fetchPage('/about.html', 'text')
	.then(({data, status, statusText}) => {
		console.log(data, status, statusText);
	});
```

---

#### `fx.pageNavigate(options)`

SPA-style navigation helper — fetches page content, updates browser history, and injects the result into a target container. Falls back to a hard navigation (`window.location.href`) if the fetch fails.

**Options:**

| Property   | Description                                           | Default   |
|------------|-------------------------------------------------------|-----------|
| `url`      | URL to navigate to                                    | —         |
| `selector` | CSS selector of the container to inject content into  | `'#root'` |
| `dataType` | Expected response type (`'json'` \| `'text'`)         | `'json'`  |
| `replace`  | Use `history.replaceState()` instead of `pushState()` | `false`   |

**Returns:** `Promise<{ html, status, statusText }>`

```javascript
fx.pageNavigate({url: '/dashboard', selector: '#app', dataType: 'text'})
	.then(({html, status, statusText}) => console.log('Navigated', status));
```

Listen for the `fxPageNavigateReady` event on `document` to re-initialize components after new content is injected:

```javascript
document.addEventListener('fxPageNavigateReady', () => {
	// re-bind listeners, run scripts, etc.
});
```

---

#### `fx.formatNumber(value, fractionDigits)`

Formats a number (or numeric string) as a locale-aware string with grouped thousands separators.

**Parameters:**

- `value {number | string}` *(required)* — The number or numeric string to format.
- `fractionDigits {number}` *(optional)* — Decimal places to show. Defaults to `2`.

**Returns:** `string`

```javascript
fx.formatNumber(1234.5);      // '1,234.50'
fx.formatNumber('1234', 0);   // '1,234'
```

---

#### `fx.modal(config)`

Creates a quick, simple modal dialog with callback support.

**Config properties:**

| Property            | Description                                       | Default           |
|---------------------|---------------------------------------------------|-------------------|
| `title`             | Modal title                                       | `null`            |
| `type`              | Modal type (`success`, `warning`, `error`, etc.)  | `'success'`       |
| `content`           | Body content                                      | `'Alert Content'` |
| `confirmButtonText` | Confirm button label                              | —                 |
| `cancelButtonText`  | Cancel button label                               | —                 |
| `html`              | Render content as HTML?                           | `true`            |
| `isStatic`          | Render as a static Modal?                         | `false`           |
| `closeOnConfirm`    | Hide the modal on confirm button click?           | `false`           |
| `onConfirm`         | Called after confirm button click                 | —                 |
| `onCancel`          | Called after cancel button click                  | —                 |
| `onEsc`             | Called on Escape key (only when no cancel button) | —                 |

**Callback arguments:**

- `onConfirm(e, modal)`, `onCancel(e, modal)`, `onEsc(e, modal)`
	- `e` — The modal hide event.
	- `modal` — The `FuxcelModal` instance.

```javascript
fx.modal({
	type: 'warning',
	content: '<h1>Are you sure?</h1>',
	confirmButtonText: 'Yes',
	cancelButtonText: 'No',
	onConfirm: (e, modal) => console.log('Confirmed', modal),
	onEsc: (e, modal) => console.log('Dismissed with Escape', modal),
});
```

---

## About

Fuxcel is an easy-to-use JavaScript plugin for front-end form validation and DOM utilities — designed to require little to no deep JavaScript knowledge to get started.

It provides an abstraction layer over standard JavaScript APIs, making it straightforward to handle form validation, DOM manipulation, event handling, and AJAX requests. By incorporating Fuxcel into your project, you simplify and streamline your development workflow without pulling in any extra dependencies.

---

## Creator

<a href="https://github.com/Bien-Glitch" title="Bien Nwinate">
  <img alt="Bien Nwinate" src="https://avatars.githubusercontent.com/u/51288549?s=96&v=4" height="48" width="48" style="border-radius:50%">
</a>

---

## Contributors

<a href="https://github.com/Ben-Chanan008" title="Great Ben">
  <img alt="Great Ben" src="https://avatars.githubusercontent.com/u/119743454?v=4" height="48" width="48" style="border-radius:50%">
</a>

---

## Acknowledgements

Thanks be to GOD Almighty for making this project possible, and a huge thanks to everyone who contributed support along the way:

<a href="https://github.com/Xcella-ng" title="Xcella">
  <img alt="Xcella" src="https://avatars.githubusercontent.com/u/136995993?s=200&v=4" height="48" width="48" style="border-radius:50%">
</a>

<a href="https://github.com/scaletfoxltd" title="ScaletFox Ltd">
  <img alt="ScaletFox Fox" src="https://avatars.githubusercontent.com/u/101061395?s=200&v=4" height="48" width="48" style="border-radius:50%">
</a>

<a href="https://github.com/mrokojaja" title="David Jaja">
  <img alt="David Jaja" src="https://avatars.githubusercontent.com/u/92247356?v=4" height="48" width="48" style="border-radius:50%">
</a>

<a href="https://github.com/Ben-Chanan008" title="Great Ben">
  <img alt="Great Ben" src="https://avatars.githubusercontent.com/u/119743454?v=4" height="48" width="48" style="border-radius:50%">
</a>

<a href="https://github.com/echovick" title="Victor Eze">
  <img alt="Victor Eze" src="https://avatars.githubusercontent.com/u/38302798?v=4" height="48" width="48" style="border-radius:50%">
</a>

<a href="https://github.com/omotayosam" title="Omotayo Ayomide">
  <img alt="Omotayo Ayomide" src="https://avatars.githubusercontent.com/u/37814830?v=4" height="48" width="48" style="border-radius:50%">
</a>

---

## Feedback

Found a bug, vulnerability, or have a suggestion? Please [open an issue on GitHub](https://github.com/Bien-Glitch/fuxcel/issues) or reach out via email. All issues are promptly addressed.

---

## Contact

- **Email:** [fusionboltinc@gmail.com](mailto:fusionboltinc@gmail.com)
- **WhatsApp:** +234 815 744 9189
