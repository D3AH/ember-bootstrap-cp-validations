import { not, notEmpty, and, readOnly } from '@ember/object/computed';
import { defineProperty } from '@ember/object';
import BsFormElement from 'ember-bootstrap/components/bs-form/element';

export default BsFormElement.extend({
  _attrValidations: null,
  notValidating: not('isValidating').readOnly(),
  notDisabled: not('disabled').readOnly(),
  _presenceEnabled: not('_attrValidations.options.presence.disabled'),

  // Overwrite
  hasValidator: notEmpty('_attrValidations').readOnly(),
  hasErrors: and('_attrValidations.isInvalid', 'notValidating').readOnly(),
  isValidating: readOnly('_attrValidations.isValidating'),

  // mark as required only if:
  // - field is not disabled,
  // - presence validator requires presence
  // - presence validator is enabled
  required: and(
    'notDisabled',
    '_attrValidations.options.presence.presence',
    '_presenceEnabled'
  ),

  setupValidations() {
    let pathToProperty = `model.validations.attrs.${this.get('property')}`;

    // nested objects validations
    if (this.get('property').includes('.')) {
      let last = this.get('property').lastIndexOf('.');
      pathToProperty = `model.${this.get('property').slice(
        0,
        last
      )}.validations.attrs${this.get('property').slice(last)}`;
    }

    defineProperty(this, '_attrValidations', readOnly(pathToProperty));
    defineProperty(
      this,
      'warnings',
      readOnly('_attrValidations.warningMessages')
    );
  }
});
