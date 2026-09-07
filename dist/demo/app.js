// 1. Import your library (resolves using the '.' -> 'types' and 'import' block)
import {fuxcel} from '../js/fuxcel.esm.js';

// 2. Import your CSS explicitly (resolves using the './css' block)
// import '../css/fuxcel.css';

// Initialize a DOM node using Fuxcel's fluent, chainable manipulation API
const app = fx('#app');
// const fx = Fuxcel;
console.log(app, fuxcel);
// app.html('<strong>Success!</strong> Fuxcel bundle loaded completely.').addClass('fuxcel-alert');

fx.onDocumentLoad((e) => {
	/*console.log(e);
	const form = fx('form').formValidator;
	
	form.init()*/
	const testStep = fx('#test-step-1');
	const stepValidator = testStep.formValidator.init({config: {useDefaultStyling: true}, stepForm: {use: true, plugin: false}});
	fx('#test-form').formValidator.init({config: {useDefaultStyling: true}, stepForm: {use: false}});
	
	testStep.toArray.forEach(stepForm => {
		const stepsArray = [];
		const steps = fx('.fx-step', stepForm);
		
		const btnNext = fx('button[data-action="next"]', stepForm);
		const btnPrev = fx('button[data-action="prev"]', stepForm);
		
		steps.each(step => {
			step.style({display: 'none'});
			stepsArray.push(step.dataAttrib('fx-step'));
		});
		
		stepsArray.sort();
		const minStep = stepsArray[0];
		localStorage.setItem(`fx-current-step-${stepForm.id}`, minStep);
		fx(`.fx-step[data-fx-step="${minStep}"]`).style({display: 'block'});
		btnPrev.prop({disabled: true});
		
		btnNext.off().upon('click', function (e) {
			e.preventDefault();
			let currentStepStorage = localStorage.getItem(`fx-current-step-${stepForm.id}`),
				currentStep = parseInt(currentStepStorage),
				assumedNextStep = currentStep + 1;
			
			if (assumedNextStep <= stepsArray.length) {
				console.log(stepValidator.validatorConfig.config)
				const stepErrors = stepValidator.stepErrors(currentStep);
				if (!stepErrors.count) {
					steps.style({display: 'none'});
					fx(`.fx-step[data-fx-step="${assumedNextStep}"]`, stepForm).style({display: 'block'});
					localStorage.setItem(`fx-current-step-${stepForm.id}`, `${assumedNextStep}`);
					btnPrev.prop({disabled: false});
					
					if (assumedNextStep + 1 > stepsArray.length)
						fx(this).prop({disabled: true})
				} else
					stepValidator.renderValidationErrors(stepErrors.errors, 'Hello World!', (target, e) => {
						console.log(target, e);
					});
			}
		}).trigger('click', 'keyboard');
		
		btnPrev.off().upon('click', function (e) {
			e.preventDefault();
			console.log(this);
			let currentStepStorage = localStorage.getItem(`fx-current-step-${stepForm.id}`),
				currentStep = parseInt(currentStepStorage),
				assumedPrevStep = currentStep - 1;
			
			if (assumedPrevStep > 0) {
				console.log(stepValidator.stepErrors(), stepValidator.formSteps);
				// console.log(stepValidator.stepErrors(currentStep));
				steps.style({display: 'none'});
				fx(`.fx-step[data-fx-step="${assumedPrevStep}"]`, stepForm).style({display: 'block'});
				localStorage.setItem(`fx-current-step-${stepForm.id}`, `${assumedPrevStep}`);
				btnNext.prop({disabled: false});
				
				if (assumedPrevStep - 1 === 0)
					fx(this).prop({disabled: true});
			}
		});
	});
	
	fx.modal({
		title: 'Test Modal',
		type: 'success',
		content: '<h4>Welcome to the test Modal</h4>',
		confirmButtonText: 'Ok',
		// cancelButtonText: 'Cancel',
		onConfirm: (e, modal) => {
			console.log(e, 'Confirmed');
			modal.hide()
		},
		onEsc: (e, modal) => {
			alert('Escaped');
			console.log(e, modal);
		}
	});
	
	function onOpenComponent(callbackObject) {
		const body = fx('body');
		
		fx('.open-component').off('click').upon('click', function (event) {
			event.preventDefault();
			const target = fx(this);
			const componentID = target.dataAttrib('component-id');
			const componentURL = target.dataAttrib('component-url');
			const componentSelector = `.component#${componentID}`;
			
			Object.keys(callbackObject).forEach(key => {
				if (componentID?.toCamelCase() === key) {
					fx.fetchPage(componentURL, 'text').then(function (response) {
						if (!body.children(componentSelector).length)
							body.insertNode(response.data);
						
						const component = fx(componentSelector);
						const modal = component.modal;
						modal.show();
						modal.upon({
							'fx.modal.hide': () => console.log('Modal dismissing', modal),
							'fx.modal.hidden': () => modal.destroy()
						});
						(callbackObject[key](target, modal));
					}).catch(error => console.error(error));
				}
			});
		});
	}
	
	onOpenComponent({
		modalTest: (e, modal) => {
			console.log('Open modal0', e, modal);
		}
	});
});
