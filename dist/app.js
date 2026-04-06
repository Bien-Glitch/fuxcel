fx.onDocumentLoad((e) => {
	/*console.log(e);
	const form = fx('form').formValidator;
	
	form.init()*/
	const testStep = fx('#test-step-1');
	const stepValidator = testStep.formValidator.init({config: {useDefaultStyling: true}, stepForm: {use: true, plugin: false}});
	fx('#test-form').formValidator.init({config: {useDefaultStyling: true}, stepForm: {use: false}});

	console.log(fx('input'));
	// testStep.fadeout(5000).then(element => element.fadein(2000).then(element => element.slideoutup(3000)));
	/*testStep.fadeout(5000).then(element => element.fadein(2000).then(element => element.slideoutup(3000)));
	testStep.off().upon()*/

	// testStep.formValidator.init({stepForm: {use: true, plugin: false}});
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
		// title: 'Test Modal',
		type: 'success',
		content: 'Welcome to the test Modal',
		confirmButtonText: 'Ok',
		onConfirm: (e) => {
			console.log(e, 'Confirmed');
		},
		onEsc: (e, modal) => {
			alert('Escaped');
			console.log(e, modal);
		}
	});
});
