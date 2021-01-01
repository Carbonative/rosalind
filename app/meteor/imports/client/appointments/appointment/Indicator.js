import React from 'react'
import { __ } from '../../../i18n'
import { Icon } from '../../components/Icon'
import { green, red, warning, primaryActive } from '../../layout/styles'
import { Currency } from '../../components/Currency'

const assumeNoShowAfterMinutes = 90

export const Indicator = (props) => {
  return <div className='pull-right'>
    <InsuranceIndicator {...props} />
    <StateIndicator {...props} />
  </div>
}

const InsuranceIndicator = ({ appointment, calendar }) => {
  if (!appointment || !appointment.patient || (typeof appointment.patient.isPrivateInsurance !== 'boolean')) {
    return null
  }

  if (appointment.patient.isPrivateInsurance) {
    return <span title={'Privat'} className='text-muted f6'>P&nbsp;</span>
  } else {
    return null
  }
}

const StateIndicator = ({ appointment, showRevenue, calendar }) => {
  if (!appointment || !appointment.patientId || appointment.canceled || appointment.removed) {
    return null
  }

  if (appointment.treated /* || (calendar && calendar.admittedIsTreated && appointment.admitted) */) {
    return <Treated />
  }

  if (appointment.treatmentStart) {
    return <Treating />
  }

  if (appointment.admitted) {
    return <Admitted />
  }

  if (appointment.queued) {
    return <Queued />
  }

  if (appointment.noShow) {
    return <NoShow />
  }
  const assumeNoShow = ((new Date() - appointment.end) / 1000 / 60) >= assumeNoShowAfterMinutes
  if (assumeNoShow) {
    return <NoShow />
  }

  return null
}

const Queued = () => <span
  key='queued'
  title={__('appointments.queued')}
  style={queuedStyle}>
  <Icon name='circle' />&nbsp;
</span>

const queuedStyle = {
  // zoom: 0.6,
  display: 'inline-block',
  color: warning
}


const Admitted = () => <span
  key='admitted'
  title={__('appointments.admitted')}
  style={admittedStyle}>
  <Icon name='angle-double-right' />&nbsp;
</span>

const admittedStyle = {
  display: 'inline-block',
  color: green
}

const Treated = () => <span
  key='treated'
  title={__('appointments.treated')}
  style={treatedStyle}>
  <Icon name='check' />&nbsp;
</span>

const treatedStyle = {
  display: 'inline-block',
  color: green
}

const Treating = () => <span
  key='treating'
  title={__('appointments.treating')}
  style={treatingStyle}>
  <Icon name='circle-o-notch' />&nbsp;
</span>

const treatingStyle = {
  display: 'inline-block',
  color: primaryActive
}

const NoShow = () => <span
  key='noShow'
  title={__('appointments.noShow')}
  style={noShowStyle}>
  <Icon name='times' />&nbsp;
</span>

const noShowStyle = {
  display: 'inline-block',
  color: red
}

export const Revenue = ({ appointment }) =>
  <span>
    {
      (appointment.revenue === 0 || appointment.revenue > 0) &&
      <span>
        <Currency value={appointment.revenue} />&nbsp;
        </span>
    }
  </span>
