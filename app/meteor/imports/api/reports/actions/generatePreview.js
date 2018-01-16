import moment from 'moment-timezone'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { dayToDate } from '../../../util/time/day'
import { daysForPreview } from '../methods/daysForPreview'
import { generate as generateReport } from '../methods/generate'

export const generatePreview = ({ Calendars, Reports, Appointments, Schedules, Tags, Messages }) => {
  return new ValidatedMethod({
    name: 'reports/generatePreview',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
      day: { type: Object, blackbox: true }
    }).validator(),

    run ({ day }) {
      try {
        if (this.isSimulation) { return }

        const calendars = Calendars.find({}, { sort: { order: 1 } }).fetch()

        return calendars.map(calendar => {
          const calendarId = calendar._id

          const days = daysForPreview(dayToDate(day)).map(day => {
            const date = moment(dayToDate(day))

            // TODO: Dry up, merge with generate action
            const appointments = Appointments.find({
              calendarId,
              start: {
                $gt: date.startOf('day').toDate(),
                $lt: date.endOf('day').toDate()
              }
            }).fetch()

            console.log('found', appointments.length, 'appts for cal', calendarId)

            const overrideSchedules = Schedules.find({
              calendarId,
              type: 'override',
              start: {
                $gt: date.startOf('day').toDate(),
                $lt: date.endOf('day').toDate()
              }
            }).fetch()

            const appointmentIds = appointments.map(a => a._id)
            const messages = Messages.find({
              'payload.appointmentId': { $in: appointmentIds }
            }).fetch()

            const tagMapping = Tags.methods.getMappingForReports()

            const existingReport = Reports.findOne({ day, calendarId })
            if (existingReport) {
              return existingReport
            } else {
              const generatedPreview = generateReport({ calendar, day, appointments, overrideSchedules, tagMapping, messages })
              return generatedPreview
            }
          })

          return {
            days,
            calendarId
          }
        })
      } catch (e) {
        console.error(e.message, e.stack)
        throw e
      }
    }
  })
}
