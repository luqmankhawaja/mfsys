import { AbstractControl, Form, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


export const passwordMatchValidator:ValidatorFn=(form: AbstractControl):ValidationErrors|null=>

{

   let passwordValue=form.get('Password')?.value;
    let confirmPasswordValue=form.get('confirmPassword')?.value;
    if(passwordValue != confirmPasswordValue)
    {
        return {passwordMatchError:true}
    }
  return null;

}

