/*const form = fx('#test-step-1').formValidator;

console.log(form)
form.initSteps({
	config: {
		showPassword: true
	}
}).upon('submit', function (e) {
	e.preventDefault();
	if (form.errorCount) {
		form.renderValidationErrors(form.errorBag, () => {
			console.log(true, 'boss');
		})
	} else
		form.handleFormSubmit({
			dataType: 'json'
		}).then(response => console.log(response)).catch(error => console.log(error))
});*/

document.addEventListener('DOMContentLoaded', () => {
	// const modal = new FuxcelModal(document.querySelector('#test-modal'));
	// modal.show()
})
/*.upon('submit', function (e) {
e.preventDefault();
	
if (form.getErrors.count)
	form.renderValidationErrors(form.getErrors.errors);
});*/

fx.modal();

const testStep = fx('form');
const stepValidator = testStep.formValidator.initSteps();

// testStep.fadeout(5000).then(element => element.fadein(2000).then(element => element.slideoutup(3000)));


testStep.toArray.forEach(stepForm => {
	const stepsArray = [];
	const steps = fx('.fx-step', stepForm);
	
	const btnNext = fx('button[data-action="next"]', stepForm);
	const btnPrev = fx('button[data-action="prev"]', stepForm);
	
	steps.toArray.forEach(step => {
		fx(step).style({display: 'none'});
		stepsArray.push(step.dataset.fxStep);
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
			const stepErrors = stepValidator.stepErrors(currentStep);
			console.log(currentStep, stepErrors);
			if (!stepErrors.count) {
				steps.style({display: 'none'});
				fx(`.fx-step[data-fx-step="${assumedNextStep}"]`, stepForm).style({display: 'block'});
				localStorage.setItem(`fx-current-step-${stepForm.id}`, `${assumedNextStep}`);
				btnPrev.prop({disabled: false});
				
				if (assumedNextStep + 1 > stepsArray.length)
					fx(this).prop({disabled: true})
			} else
				stepValidator.renderValidationErrors(stepErrors.errors);
		}
	});
	
	btnPrev.off().upon('click', function (e) {
		e.preventDefault();
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
