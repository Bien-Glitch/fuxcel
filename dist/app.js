const form = fx('#test-form').formValidator;

console.log(form)
form.init({
	config: {
		showPassword: false
	}
}).upon('submit', function (e) {
	if (form.errorCount) {
		e.preventDefault();
		form.renderValidationErrors(form.errorBag, null, () => {
			console.log(true, 'boss');
		})
	}
});
/*.upon('submit', function (e) {
e.preventDefault();
	
if (form.getErrors.count)
	form.renderValidationErrors(form.getErrors.errors);
});*/

/*const testStep = fx('form');
const stepValidator = testStep.formValidator.initSteps();
	
	
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
			console.log(stepErrors);
			if (!stepErrors.count) {
				steps.style({display: 'none'});
				fx(`.fx-step[data-fx-step="${assumedNextStep}"]`, stepForm).style({display: 'block'});
				localStorage.setItem(`fx-current-step-${stepForm.id}`, `${assumedNextStep}`);
				btnPrev.prop({disabled: false});
				
				if (assumedNextStep + 1 > stepsArray.length)
					fx(this).prop({disabled: true})
			} else
				console.log(stepErrors.errors);
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
});*/
