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

## Features

- ✅ **Advanced Form Validation** - Built-in validators with real-time feedback
- 🎭 **Multi-step Forms** - Easy wizard-style form management
- 🎨 **Zero Dependencies** - Pure JavaScript, no external libraries
- 🎬 **Rich Animations** - Fade, slide, zoom, shake, and blink effects
- 🏗️ **DOM Manipulation** - Chainable DOM manipulation with full Fuxcel-instance awareness
- 🪟 **Modal System** - Beautiful, customizable modals and alerts
- 📡 **HTTP Client** - Modern fetch API wrapper with page navigation support
- 📱 **Mobile-First** - Touch and device detection built-in
- 🔒 **Type-Safe** - Full TypeScript support

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
	- [The `fx()` Function](#the-fx-function)
	- [Selector](#selector)
	- [DOM Manipulation](#dom-manipulation)
		- [Class Management](#class-management)
		- [Attributes & Properties](#attributes--properties)
		- [Content & HTML](#content--html)
		- [Node Insertion](#node-insertion)
		- [Removal & Detach](#removal--detach)
		- [Element Selection & Traversal](#element-selection--traversal)
		- [Element Queries](#element-queries)
		- [Value](#value)
		- [Disable / Enable](#disable--enable)
	- [Events](#events)
		- [Event Listeners](#event-listeners)
		- [Trigger Events](#trigger-events)
	- [Animations](#animations)
	- [Form Validation](#form-validation)
		- [Configuration Options](#configuration-options)
		- [Validation Methods](#validation-methods)
		- [Error Rendering](#error-rendering)
		- [Password Strength](#password-strength)
		- [Multi-step Forms](#multi-step-forms)
	- [Modals](#modals)
		- [FuxcelModal Class](#fuxcelmodal-class)
	- [HTTP & Navigation](#http--navigation)
		- [Form Submission](#form-submission)
		- [Button Load States](#button-load-states)
		- [Page Navigation](#page-navigation)
		- [Page Loader](#page-loader)
- [Utilities](#utilities)
	- [Global Utility Functions](#global-utility-functions)
	- [`Fx` Interface Methods](#fx-interface-methods)
- [Configuration Options](#configuration-options-1)
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
// Select element(s) and add event listeners
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

---

## Usage

Ensure the stylesheet and script are linked correctly as shown above before proceeding.

### The `fx()` Function

Fuxcel exposes a global `fx(selector, context)` function that returns a `Fuxcel` instance of the selected element(s). The alias `fuxcel()` is identical in every way.

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

---

### DOM Manipulation

#### Class Management

```javascript
fx('#element').putClass('active', 'highlight')  // Add one or more classes
fx('#element').removeClass('inactive')           // Remove one or more classes
fx('#element').toggleClass('visible')            // Toggle a class
fx('#element').hasClass('active')                // Returns boolean
fx('#element').replaceClass('old', 'new')        // Replace a class (adds 'new' if 'old' not found)
fx('#element').classes                           // Returns the element's DOMTokenList
```

#### Attributes & Properties

```javascript
// Attributes
fx('#input').attrib('placeholder', 'Enter text')   // Set attribute
fx('#input').attrib('disabled', true)               // Set boolean attribute
const value = fx('#input').attrib('value')          // Get attribute
fx('#input').attrib({id: 'myInput', name: 'input'}) // Set multiple attributes
fx('#input').removeAttrib('disabled')               // Remove attribute
fx('#input').listAttrib()                           // Get all attributes as object

// Data attributes
fx('#element').dataAttrib('user-id', '123')         // Set [data-user-id]
const userId = fx('#element').dataAttrib('user-id') // Get [data-user-id]
fx('#element').removeDataAttrib('user-id')          // Remove [data-user-id]

// Properties
fx('#checkbox').prop('checked', true)               // Set property
fx('#input').prop({disabled: true, required: true}) // Set multiple properties
fx('#input').prop('value')                          // Get property
fx('#input').removeProp('required')                 // Remove property
fx('#input').listProp()                             // Get all properties as object

// Styles
fx('#box').style('background', 'blue')              // Set a style
fx('#box').style({width: '100px', height: '100px'}) // Set multiple styles
fx('#box').style('width')                           // Get a style value
```

#### Content & HTML

```javascript
fx('#element').innerText = 'New text'               // Set inner text
fx('#element').outerText = 'Replaced text'          // Set outer text
fx('#element').innerText                            // Get inner text
fx('#element').outerText                            // Get outer text
fx('#element').innerHTML                            // Get inner HTML
fx('#element').outerHTML                            // Get outer HTML

// Replace inner HTML entirely
fx('#container').insertHTML('<p>New content</p>')

// Insert relative to element (positions: 'before' | 'prepend' | 'append' | 'after')
fx('#container').insertHTML('<hr>', 'before')        // Before the element itself
fx('#container').insertHTML('<p>First</p>', 'prepend') // As first child
fx('#container').insertHTML('<p>Last</p>', 'append')  // As last child
fx('#container').insertHTML('<hr>', 'after')         // After the element itself
```

> **Migration note (v1 → v2):** The position values `'affix'`, `'prefix'`, `'suffix'`, and `'postfix'` have been renamed to `'before'`, `'prepend'`, `'append'`, and `'after'` respectively.

#### Node Insertion

`insertNode` accepts a single node or an array of nodes. Each node can be a raw `HTMLElement`, a plain HTML string, or a `Fuxcel` instance.

```javascript
// Append a node (default)
fx('#container').insertNode('<p>Hello</p>')
fx('#container').insertNode(document.createElement('hr'), 'append')

// Prepend as first child
fx('#container').insertNode(fx('#header'), 'prepend')

// Insert before or after the element itself
fx('#container').insertNode(document.createElement('hr'), 'before')
fx('#container').insertNode('<p>Footer</p>', 'after')

// Multiple nodes as an array
fx('#container').insertNode([fx('#header'), '<hr>', document.createElement('p')], 'prepend')

// Chainable
fx('#container').insertNode('<p>Hello</p>', 'prepend').putClass('loaded').fadein(300)
```

#### Removal & Detach

```javascript
// Remove element completely
fx('#banner').remove()
fx('#banner').remove(false)

// Detach — preserves event listeners so it can be reinserted later
const header = fx('#header').remove(true)
fx('#new-container').insertNode(header, 'prepend')
```

#### Element Selection & Traversal

```javascript
// Index-based access (supports negative indices)
fx('#list li').at()      // First item (index 0)
fx('#list li').at(2)     // Third item
fx('#list li').at(-1)    // Last item
fx('#list li').at(-2)    // Second to last

// Traversal getters (operate on first selected element)
fx('#el').parent         // Direct parent
fx('#el').next           // Next sibling
fx('#el').previous       // Previous sibling
fx('#el').first          // First element in selection
fx('#el').last           // Last element in selection

// Traversal methods (operate across all selected elements)
fx('#element').children()                  // Direct children
fx('#element').children('.active')         // Filtered direct children
fx('#element').descendants()              // All descendants
fx('#element').descendants('span')        // Filtered descendants
fx('#element').parents()                  // All ancestor elements
fx('#element').parents('.wrapper')        // Filtered ancestors
fx('#element').siblings()                 // All siblings
fx('#element').siblings('.item')          // Filtered siblings
fx('#element').prevSiblings()             // All previous siblings
fx('#element').prevSiblings('.item')      // Filtered previous siblings

// Iteration
fx('li').each((element, index, elements) => {
	console.log(index, element.innerHTML);
});

// Filter (returns a shallow copy)
fx('li').filter((element, index) => index % 2 === 0);
```

#### Element Queries

```javascript
fx('#input').isElement('input')          // true if tag name matches
fx('#input').matchSelector('#myInput')   // true if selector matches element
fx('#list').hasScrollBar()               // true if any scrollbar
fx('#list').hasScrollBar('vertical')     // true if vertical scrollbar
fx('#input').isDisabled                  // true if element is disabled
fx('#form').isFormElement                // true if element is a form
fx('#input').hasFocus                    // Promise<boolean>
fx('#input').fieldAttributes             // { id, fxName, type, fxId, fxRole, formId }
```

#### Value

```javascript
fx('#input').value()            // Get value (returns string | string[] | null)
fx('#input').value('hello')     // Set value
fx('#select').value()           // Returns array of selected values for multi-selects
```

#### Disable / Enable

```javascript
fx('#button').disable()         // Disable element
fx('#button').disable(true)     // Disable element
fx('#button').disable(false)    // Enable element
```

---

### Events

#### Event Listeners

```javascript
// Single event
fx('#button').upon('click', function (e) {
	console.log('Clicked!');
});

// Multiple events as an array
fx('#input').upon(['focus', 'blur'], function (e) {
	console.log(e.type);
});

// Events as a key-value object
fx('#form').upon({
	submit: function (e) {
		e.preventDefault();
	},
	reset: function (e) {
		console.log('Form reset');
	}
});

// With capture phase
fx('#button').upon('click', handler, true)

// Remove specific event(s)
fx('#button').off('click')
fx('#button').off('focus', 'blur')

// Remove all events
fx('#button').off()
```

#### Trigger Events

```javascript
fx('#button').trigger('click')
fx('#input').trigger('focus', 'mouse')          // mouse | keyboard | custom
fx('#form').trigger(new CustomEvent('validate'))
```

---

### Animations

All animation methods accept optional `timeout` (ms), `iteration` (count), and `display` (CSS display value) parameters and return `Promise<Fuxcel>` for chaining.

```javascript
// Fade
await fx('#element').fadein()
await fx('#element').fadein(500)              // 500ms
await fx('#element').fadein(500, 2)           // 500ms, 2 iterations
await fx('#element').fadein(500, 2, 'flex')   // 500ms, 2 iterations, display: flex
await fx('#element').fadeout(300)

// Slide
await fx('#menu').slideindown()
await fx('#menu').slideinup(400)
await fx('#menu').slideoutdown(300)
await fx('#menu').slideoutup(400)
await fx('#panel').slideinleft(300)
await fx('#panel').slideinright(300)
await fx('#panel').slideoutleft(500)
await fx('#panel').slideoutright(500)

// Other
await fx('#box').zoomin(300)
await fx('#alert').blink(200, 3)              // 200ms, 3 iterations
await fx('#alert').shake(500, 2)              // 500ms, 2 iterations

// Chaining
fx('#element').fadein(300).then(() => fx('#element').slideoutup(400));
```

You can also use the `fuxcel` alias:

```javascript
fuxcel('#myElement').fadein();
```

---

### Form Validation

Given the following form:

```html

<form method="post" id="login-form">
	<div class="form-group">
		<label for="name">Name</label>
		<input type="text" id="name" placeholder="Name" class="form-field">
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

Initialize and configure the validator:

```javascript
const _loginForm = fx('#login-form');

const loginFormConfig = {
	config: {
		showIcons: true,
		showPassword: true,
		validateEmail: true,
		validatePassword: true,
	}
};

_loginForm.formValidator.init(loginFormConfig).upon('submit', function (e) {
	e.preventDefault();
	
	_loginForm.handleFormSubmit()
		.then(resolve => console.log(resolve))
		.catch(error => console.log(error));
});
```

#### Configuration Options

Config is passed as an object to `formValidator.init()`. It is organized into four sub-objects.

---

##### `regExp` — Regular Expression Overrides

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

##### `stepForm` — Step Form Wizard Options

| Key             | Type      | Default         | Description                                       |
|-----------------|-----------|-----------------|---------------------------------------------------|
| `use`           | `boolean` | `true`          | Toggle step form validator initialization         |
| `plugin`        | `boolean` | `false`         | Use the xsteps form wizard plugin (if available)  |
| `config.step`   | `string`  | `'.fx-step'`    | CSS selector for each step container              |
| `config.slides` | `boolean` | `false`         | Enable slide-style step transitions               |
| `config.switch` | `string`  | `'[data-step]'` | CSS selector for step navigation trigger elements |

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

##### `texts` — Validation Display Texts

Override the default text strings shown during validation.

| Key              | Type     | Default                                        | Description                  |
|------------------|----------|------------------------------------------------|------------------------------|
| `capslockFormat` | `string` | `'⚠ Caps Lock is on'`                          | Shown when Caps Lock is on   |
| `emailFormat`    | `string` | `null`                                         | Example email format hint    |
| `nameFormat`     | `string` | `null`                                         | Example name format hint     |
| `passwordFormat` | `string` | `'Password requires between 8-32 characters.'` | Example password format hint |
| `phoneFormat`    | `string` | `null`                                         | Example phone format hint    |
| `usernameFormat` | `string` | `null`                                         | Example username format hint |

```javascript
config = {
	texts: {
		capslockFormat: '⚠ Caps Lock is on',
		emailFormat: 'e.g. johndoe@gmail.com',
	}
}
```

---

##### `config` — Field Validation Toggles

| Key                    | Type      | Default                   | Description                                                                                             |
|------------------------|-----------|---------------------------|---------------------------------------------------------------------------------------------------------|
| `capslockAlert`        | `boolean` | `true`                    | Show Caps Lock alert on password fields                                                                 |
| `showIcons`            | `boolean` | `true`                    | Show validation icons on fields                                                                         |
| `showPassword`         | `boolean` | `true`                    | Show password visibility toggle icon                                                                    |
| `validateCard`         | `boolean` | `false`                   | Enable card number and CVV validation                                                                   |
| `validateName`         | `boolean` | `false`                   | Enable name field validation                                                                            |
| `validateEmail`        | `boolean` | `true`                    | Enable email field validation                                                                           |
| `validatePhone`        | `boolean` | `false`                   | Enable phone number validation                                                                          |
| `validatePassword`     | `boolean` | `true`                    | Enable password validation (recommended when a confirmation field is present)                           |
| `validateUsername`     | `boolean` | `false`                   | Enable username field validation                                                                        |
| `nativeValidation`     | `boolean` | `false`                   | Enable native HTML5 form validation                                                                     |
| `useDefaultStyling`    | `boolean` | `false`                   | Use Fuxcel's default field styling. Set to `false` if it conflicts with your own styles                 |
| `showPasswordStrength` | `boolean` | `false`                   | Enable Password Strength Calculator. Returns `score`, `label`, `color`, `failed`, `passed`, and `rules` |
| `passwordId`           | `string`  | `'password'`              | The `id` of your password field                                                                         |
| `passwordConfirmId`    | `string`  | `'password_confirmation'` | The `id` of your confirm password field                                                                 |
| `initWrapper`          | `string`  | `'.form-group'`           | CSS selector of the wrapper element containing each `label` and `input` pair                            |

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

#### Validation Methods

Once the validator is initialized, you can call validation methods directly on field elements:

```javascript
const field = fx('#email').formValidator;

// Validate based on field type (auto-detects email, password, name, phone, username)
field.validateField()               // Validate, auto-generate error message on failure
field.validateField(true)           // Validate, force error message
field.validateField('Looks good!')  // Validate with a custom success message
field.validateField(null, true)     // Validate, display error if invalid

// Validate with a specific regex
field.validateEmail(/your-regex/)
field.validateEmail(/your-regex/, 'e.g. user@example.com')

field.validatePassword(/your-regex/)
field.validateName(/your-regex/)
field.validatePhone(/your-regex/)
field.validateUsername(/your-regex/)
field.validateCardNumber(/your-regex/)
field.validateCardCVV(/your-regex/)

// Validate with a custom regex or callback function
field.validateRegex(/[A-Z]+/, 'Must contain uppercase')
field.validateRegex((value) => value.length > 5)

// Show / hide validation state manually
field.showError()
field.showError('This field is required')
field.showSuccess()
field.showSuccess('All good!')

// Toggle or clear validation
field.toggleValidation()
field.undoValidation()         // Clear validation UI
field.undoValidation(true)     // Clear UI and remove from error bag

// Field type checks
field.isEmailField
field.isPasswordField
field.isNameField
field.isPhoneField
field.isUsernameField
field.canBeValidated
```

#### Error Rendering

```javascript
const form = fx('#my-form').formValidator;

// Get error state
form.errorBag           // { fieldId: 'error message', ... } or null
form.errorCount         // Number of errors
form.getErrors          // Object with errorBag and errorCount

// Render a global message on the form
form.renderMessage()                        // Reset / clear message
form.renderMessage('Submission failed')     // Show a plain message
form.renderMessage('Saved!', 'success')     // Show a typed message

// Render server-side validation errors (keys = field IDs)
form.renderValidationErrors({email: 'Already taken', name: 'Required'})

// Render errors with a global message
form.renderValidationErrors(
	{email: 'Already taken'},
	'Please fix the errors below'
)

// Render errors with a callback on the dismiss/confirm button
form.renderValidati + onErrors(
	{email: 'Already taken'},
	'Fix errors below',
	(fx, e) => console.log('dismissed', e)
)

// Render only a message (no field errors)
form.renderValidationErrors(null, 'Something went wrong')
form.renderValidationErrors(null, (fx, e) => console.log('dismissed'))
```

#### Password Strength

When `showPasswordStrength: true` is set in config, the `passwordStrength` getter returns a `StrengthResult`:

```javascript
const result = fx('#password').formValidator.passwordStrength;
// {
//   score: number,
//   label: 'weak' | 'fair' | 'good' | 'strong',
//   color: string,
//   passed: string[],
//   failed: string[],
//   rules: { name: string, regex: RegExp, weight: number }[]
// }
```

#### Multi-step Forms

When a form uses the step form feature (detected automatically or via `stepForm.use: true`), `formValidator.init()` returns a `FuxcelSteps` instance:

```javascript
const steps = fx('#wizard-form').formValidator.init({stepForm: {use: true}});

// Get all step identifiers for the form
steps.formSteps          // (number | string)[]

// Get errors for all steps
steps.stepErrors()

// Get errors for a specific step
steps.stepErrors(1)
steps.stepErrors('personal-info')

// Step-level error bag and count (also available on FuxcelValidator)
steps.stepErrorBag(1)    // { fieldId: 'error', ... } | null
steps.stepErrorCount(1)  // number
```

---

### Modals

#### `fx.modal(config)` / `fxModal(config)`

Creates a quick alert or confirm modal.

```javascript
fx.modal({
	type: 'warning',
	content: '<h1>Are you sure?</h1>',
	confirmButtonText: 'Yes',
	cancelButtonText: 'No',
	onConfirm: (e, modal) => console.log('Confirmed', modal),
	onCancel: (e, modal) => console.log('Cancelled', modal),
	onEsc: (e, modal) => console.log('Dismissed with Escape', modal),
});
```

**Config properties:**

| Property            | Type                                           | Default           | Description                                  |
|---------------------|------------------------------------------------|-------------------|----------------------------------------------|
| `title`             | `string \| null`                               | `null`            | Modal title                                  |
| `type`              | `'success' \| 'warning' \| 'error' \| null`    | `'success'`       | Visual style of the modal                    |
| `content`           | `string \| null`                               | `'Alert Content'` | Body content                                 |
| `confirmButtonText` | `string \| null`                               | —                 | Confirm button label                         |
| `cancelButtonText`  | `string \| null`                               | —                 | Cancel button label                          |
| `html`              | `boolean`                                      | `true`            | Render content as HTML                       |
| `isStatic`          | `boolean`                                      | `false`           | Prevent closing on outside click             |
| `closeOnConfirm`    | `boolean`                                      | `false`           | Auto-hide the modal on confirm click         |
| `onConfirm`         | `(e: CustomEvent, modal: FuxcelModal) => void` | —                 | Called when confirm is clicked               |
| `onCancel`          | `(e: CustomEvent, modal: FuxcelModal) => void` | —                 | Called when cancel is clicked                |
| `onEsc`             | `(e: CustomEvent, modal: FuxcelModal) => void` | —                 | Called on Escape key (when no cancel button) |

#### FuxcelModal Class

For more control, use the `FuxcelModal` class or the `.modal` getter on any `Fuxcel` instance:

```javascript
// Via the getter
const modal = fx('#my-modal').modal;
modal.show()          // Open (allow Escape key to close)
modal.show(false)     // Open (disable Escape key)
modal.hide()          // Hide
modal.hide(true)      // Hide and remove from DOM
modal.toggle()        // Toggle open/closed
modal.destroy()       // Remove from DOM entirely

// Build a modal DOM structure programmatically
const el = FuxcelModal.init({
	id: 'confirm-dialog',
	title: 'Confirm Action',
	content: 'Are you sure?',
	html: false,
	isStatic: true,
	hasFooter: true,
});
document.body.appendChild(el);

// Static properties
FuxcelModal.currentModal      // The most recently opened modal, or null
FuxcelModal.hasOpenModals     // true if any modals are open
FuxcelModal.modalTriggers     // All elements with [data-fx-target="modal"]
```

---

### HTTP & Navigation

#### Form Submission

`handleFormSubmit` is a convenient wrapper that automatically serializes form data and submits it via the Fetch API:

```javascript
fx('#my-form').handleFormSubmit({
	uri: '/api/register',
	method: 'post',
	dataType: 'json',
	handleError: true,       // Auto-render 422 validation errors
	beforeSend: () => console.log('Sending…'),
}).then(({JSON, text, status, form}) => {
	console.log(status, JSON);
}).catch(error => console.error(error));
```

**Options (`FXFormSubmitType`):**

| Property      | Type                                              | Default  | Description                       |
|---------------|---------------------------------------------------|----------|-----------------------------------|
| `uri`         | `string \| null`                                  | `''`     | Submission URL                    |
| `method`      | `'get' \| 'post' \| 'put' \| 'patch' \| 'delete'` | `'get'`  | HTTP method                       |
| `data`        | `object \| null`                                  | `null`   | Additional form data to merge     |
| `dataType`    | `'html' \| 'json' \| 'text' \| ...`               | `'json'` | Expected response type            |
| `headers`     | `Object \| Headers \| null`                       | —        | Additional request headers        |
| `beforeSend`  | `Function \| null`                                | —        | Called before the request is sent |
| `timeout`     | `number`                                          | `10`     | Timeout in milliseconds           |
| `handleError` | `boolean`                                         | `false`  | Auto-handle 422 validation errors |

**Response (`FXFormResponse`):**

| Property | Type              | Description                             |
|----------|-------------------|-----------------------------------------|
| `JSON`   | `any`             | Parsed JSON response (if applicable)    |
| `text`   | `string`          | Raw text response                       |
| `status` | `number`          | HTTP response status code               |
| `form`   | `FuxcelValidator` | The submitted form's validator instance |

#### Button Load States

```javascript
// Toggle a button's disabled state during async operations
await fx('#submit-btn').toggleButtonLoadState(true)   // Enable loading state
await fx('#submit-btn').toggleButtonLoadState(false)  // Restore state

// Toggle the submit button of a selected form
await fx('#my-form').toggleFormSubmitButtonState(true)
await fx('#my-form').toggleFormSubmitButtonState(false)
```

#### Page Navigation

`fx.pageNavigate` enables SPA-style navigation by fetching page content via AJAX, updating browser history, and injecting content into a target container. On failure it falls back to a hard navigation.

```javascript
// Minimal — navigates to /about, injects into #root
fx.pageNavigate({url: '/about'})
	.then(html => console.log('Done'))
	.catch(err => console.error(err));

// With custom container and response type
fx.pageNavigate({
	url: '/dashboard',
	selector: '#app',
	dataType: 'text',
	replace: false,         // true = replaceState, false = pushState (default)
}).then(html => {
	window.scrollTo(0, 0);
});

// Listen for navigation ready to re-initialize components
document.addEventListener('fxPageNavigateReady', () => {
	initComponents();
	window.scrollTo(0, 0);
});
```

**Options (`FXPageNavigateOptions`):**

| Property   | Type               | Default   | Description                                          |
|------------|--------------------|-----------|------------------------------------------------------|
| `url`      | `string \| null`   | —         | URL to navigate to                                   |
| `selector` | `string \| null`   | `'#root'` | CSS selector of the container to inject content into |
| `dataType` | `'json' \| 'text'` | `'json'`  | Expected response type                               |
| `replace`  | `boolean`          | `false`   | Use `replaceState` instead of `pushState`            |

`fx.fetchPage` is also available directly for lower-level use:

```javascript
// Returns Promise<string> — JSON is returned as an unparsed string
fx.fetchPage('/page.html', 'text', () => console.log('Fetching…'))
	.then(html => document.querySelector('#root').innerHTML = html);

fx.fetchPage('/api/data.json', 'json')
	.then(jsonString => JSON.parse(jsonString));
```

#### Page Loader

`fx.pageLoader` provides a YouTube-style thin progress bar at the top of the viewport:

```javascript
fx.pageLoader.start()    // Show and animate the progress bar (0% → ~90%)
fx.pageLoader.finish()   // Jump to 100%, fade out, then reset

// Typical usage with async operations
fx.pageLoader.start();
fetch('/api/data')
	.then(res => res.json())
	.then(data => console.log(data))
	.finally(() => fx.pageLoader.finish());
```

---

## Utilities

Fuxcel provides a set of global utility functions available directly on the `window` object.

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

- `input {string | number}` *(required)* — The card number to validate.

**Returns:** `true` if valid; `false` otherwise.

```javascript
const cardNumber = '4526193832182346';
const isValid = fx.passLuhnAlgo(cardNumber);
console.log(isValid); // true or false
```

---

#### `fx.fetch(config)`

Performs a fetch request using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with a convenient options interface.

**Config properties (`FXRequestType`):**

| Property     | Description                                                                                     | Default  |
|--------------|-------------------------------------------------------------------------------------------------|----------|
| `uri`        | Request URL                                                                                     | `''`     |
| `method`     | HTTP method (`get`, `post`, `put`, `patch`, `delete`)                                           | `'get'`  |
| `data`       | Request payload                                                                                 | `null`   |
| `dataType`   | Expected response type (`json`, `html`, `text`, `xml`, `script`, `jsonp`)                       | `'json'` |
| `headers`    | Additional request headers                                                                      | —        |
| `beforeSend` | Called before the request is sent                                                               | —        |
| `timeout`    | Timeout in seconds                                                                              | `10`     |
| `onSuccess`  | Called on status `200–299`                                                                      | —        |
| `onError`    | Called on error status codes *(HTTP codes outside `onSuccess` and `onComplete`)*                | —        |
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

#### `fx.modal(config)`

Creates a quick, simple modal dialog with callback support. See [Modals](#modals) for the full config reference.

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
