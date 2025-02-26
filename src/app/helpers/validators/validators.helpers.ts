import { ValidatorFn } from "@angular/forms";

// Validator function to not allow only spaces in the search query
export function searchQueryValidator(): ValidatorFn {
    return (control) => {
      if(control.value.trim() === '') {
        return { 'invalidSearchQuery': true };
      }
      return null;
    }
  }