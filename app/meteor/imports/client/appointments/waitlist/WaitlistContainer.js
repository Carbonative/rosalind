import moment from 'moment'
import identity from 'lodash/identity'
import { composeWithTracker } from 'meteor/nicocrm:react-komposer-tracker'
import { Meteor } from 'meteor/meteor'
import { Appointments } from '../../../api/appointments'
import { Patients } from '../../../api/patients'
import { Referrals } from '../../../api/referrals'
import { WaitlistScreen } from './WaitlistScreen'

const composer = (props, onData) => {
  const startOfToday = moment().startOf('day').toDate()
  const endOfToday = moment().endOf('day').toDate()

  Meteor.subscribe('appointments', {
    start: startOfToday,
    end: endOfToday
  })

  const selector = {
    assigneeId: Meteor.userId(),
    admittedAt: { $ne: null },
    treatmentEnd: null,
    start: {
      $gt: startOfToday,
      $lt: endOfToday
    }
  }

  const appointments = Appointments.find(selector, {
    sort: { admittedAt: 1 }
  }).fetch()

  Meteor.subscribe('referrals', {
    patientIds: appointments.map(a => a.patientId).filter(identity)
  })

  const waitlistAppointments = appointments.map(appointment => {
    const patient = Patients.findOne({ _id: appointment.patientId })
    const referrals = patient
      ? Referrals.find({ patientId: patient._id }).fetch()
      : []

    return {
      ...appointment,
      patient,
      referrals
    }
  })

  onData(null, { ...props, appointments: waitlistAppointments })
}

export const WaitlistContainer = composeWithTracker(composer)(WaitlistScreen)
