import React from 'react'
import { reduxForm, Field, Fields } from 'redux-form'
import Button from 'material-ui/Button'
import Radio from 'material-ui/Radio'
import { TextField, RadioGroup } from 'redux-form-material-ui'
import { TAPi18n } from 'meteor/tap:i18n'
import { DateRangePicker } from '../../components/form/DateRangePicker'

class NewRequestFormComponent extends React.Component {
  render () {
    const { pristine, submitting, handleSubmit, onSubmit } = this.props
    return (
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='mui'>
        <h5>Zeitraum</h5>
        <Fields names={['start', 'end']} component={DateRangePicker} />

        <div className='row'>
          <div className='col-md-6'>
            <h5>Ansuchen auf</h5>
            <Field name='reason' component={RadioGroup}>
              <Radio value='vacation' label={TAPi18n.__('schedules.requests.vacation')} />
              <Radio value='compensatory' label={TAPi18n.__('schedules.requests.compensatory')} />
              <Radio value='sick' label={TAPi18n.__('schedules.requests.sick')} />
            </Field>
          </div>
          <div className='col-md-6'>
            <Field name='note'
              component={TextField}
              multiline rows={1} fullWidth
              label={TAPi18n.__('schedules.note')} />
          </div>
        </div>

        <Button variant='raised' type='submit'
          onClick={handleSubmit}
          fullWidth
          primary={!submitting && !pristine}
          disabled={pristine || submitting}>
          {TAPi18n.__('schedules.postRequest')}
        </Button>
      </form>
    )
  }
}

export const NewRequestForm = reduxForm({
  form: 'newSchedulesRequest',
  fields: ['start', 'end', 'note', 'reason'],
  initialValues: {
    start: new Date(),
    end: new Date()
  },
  validate: (values) => {
    let errors = {}
    if (!values.reason) { errors.reason = 'Erforderlich' }
    return errors
  }
})(NewRequestFormComponent)
