import idx from 'idx'
import moment from 'moment-timezone'
import memoize from 'lodash/memoize'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import sortBy from 'lodash/fp/sortBy'
import uniq from 'lodash/uniq'
import flatten from 'lodash/flatten'
import union from 'lodash/union'
import { connect } from 'react-redux'
import Alert from 'react-s-alert'
import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { __ } from '../../../i18n'
import { withTracker } from '../../components/withTracker'
import { SubsManager } from 'meteor/meteorhacks:subs-manager'
import { dateToDay } from '../../../util/time/day'
import { Users } from '../../../api/users'
import { Patients } from '../../../api/patients'
import { Calendars } from '../../../api/calendars'
import { Appointments } from '../../../api/appointments'
import { Schedules } from '../../../api/schedules'
import { Loading } from '../../components/Loading'
import { AppointmentsScreen } from './AppointmentsScreen'
import { subscribeManager } from '../../../util/meteor/subscribe'

const mapUncapped = map.convert({ cap: false })
const appointmentsSubsManager = new SubsManager({
  cacheLimit: 30,
  expireIn: 15 // in minutes
})

const parseDay = memoize(d => moment(d))

// If calendar allows unassigned appointments, add null assignee if not already present
const addNullAssignee = a =>
  (a.indexOf(null) === -1)
  ? [...a, null]
  : a

const onNewAppointmentModalOpen = (args) => Appointments.actions.acquireLock.call(args)
const onNewAppointmentModalClose = (args) => Appointments.actions.releaseLock.call(args)
const handleSetAdmitted = (args) => {
  Alert.success(__('appointments.setAdmittedSuccess')) // optimistic for smoother UX
  return Appointments.actions.setAdmitted.callPromise(args)
}

const handleMove = (args) =>
  Appointments.actions.move.callPromise(args).then(() => {
    Alert.success(__('appointments.moveSuccess'))
  })

const composer = (props) => {
  const date = parseDay(idx(props, _ => _.match.params.date))
  const calendarSlug = idx(props, _ => _.match.params.calendar)
  const calendar = Calendars.findOne({ slug: calendarSlug })
  if (!calendar) { return { isLoading: true } }

  const day = dateToDay(date)
  const startOfDay = date.clone().startOf('day').toDate()
  const endOfDay = date.clone().endOf('day').toDate()

  const dateRange = {
    start: startOfDay,
    end: endOfDay
  }

  let subsReady = true
  // Appointments and schedules for future dates are cached as global subscriptions
  if (date.toDate() < moment().startOf('day').toDate()) {
    const schedulesDaySubscriptions = subscribeManager(appointmentsSubsManager, 'schedules', day)
    const schedulesOverrideSubscriptions = subscribeManager(appointmentsSubsManager, 'schedules', dateRange)
    const appointmentsSubscription = subscribeManager(appointmentsSubsManager, 'appointments-legacy', dateRange)
    subsReady = schedulesDaySubscriptions.ready() && schedulesOverrideSubscriptions.ready() && appointmentsSubscription.ready()
  }

  // Skip jarring loading indicator
  if (subsReady || true) {
    const appointmentsSelector = {
      calendarId: calendar._id,
      start: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }

    const assigneeIdsScheduled = uniq(flatten(Schedules.find({
      day,
      calendarId: calendar._id
    }).fetch().map((s) => s.userIds)))

    let assigneeIds = calendar.allowUnassigned
      ? addNullAssignee(assigneeIdsScheduled)
      : assigneeIdsScheduled

    // Now turn the assigneeIds array into an array of assignee objects
    let assignees = flow(
      mapUncapped((assigneeId) => {
        const user = Users.findOne({ _id: assigneeId })
        return {
          fullNameWithTitle: user && Users.methods.fullNameWithTitle(user),
          lastName: user && user.lastName,
          employee: user && user.employee,
          assigneeId: assigneeId || null
        }
      }),
      sortBy('lastName'),

      // Add override schedules to assignee
      mapUncapped((assignee) => {
        const overrides = Schedules.find({
          type: 'override',
          calendarId: calendar._id,
          userId: assignee.assigneeId,
          start: { $gte: startOfDay },
          end: { $lte: endOfDay }
        }).fetch()

        const constraints = Schedules.find({
          type: 'constraint',
          calendarId: calendar._id,
          userId: assignee.assigneeId,
          weekdays: date.clone().locale('en').format('ddd').toLowerCase(),
          start: { $lte: endOfDay },
          end: { $gte: startOfDay }
        }).fetch()

        return {
          ...assignee,
          schedules: overrides,
          constraints
        }
      }),

      // Add appointments to assignee
      mapUncapped((assignee) => {
        const selector = {
          ...appointmentsSelector,
          assigneeId: assignee.assigneeId
        }
        const appointments = Appointments.find(selector).fetch().map((appointment, i, assigneeAppointments) => {
          let patient = Patients.findOne({ _id: appointment.patientId })
          if (patient) {
            patient.prefix = Patients.methods.prefix(patient)
          }

          const notes = [
            appointment.note,
            idx(appointment, _ => _.external.terminiko.note),
            idx(appointment, _ => _.external.eoswin.note)
          ].filter(s => s && s.length >= 1).join('\n')

          const lockedBy = appointment.lockedBy && Users.findOne({ _id: appointment.lockedBy })
          const lockedByFirstName = lockedBy && Users.methods.firstName(lockedBy)

          const isColliding = assigneeAppointments.find(a =>
            a.start.getTime() === appointment.start.getTime() &&
            a._id !== appointment._id
          )

          if (isColliding) {
            console.log('colliding', isColliding, appointment)
          }

          return {
            ...appointment,
            isColliding,
            patient,
            notes,
            lockedByFirstName,
            timeStart: moment(appointment.start).format('[T]HHmm'),
            timeEnd: moment(appointment.end).format('[T]HHmm')
          }
        })

        return {
          ...assignee,
          appointments,
          hasAppointments: (appointments.length > 0)
        }
      })
    )(assigneeIds)

    const canEditSchedules = Roles.userIsInRole(Meteor.userId(), ['admin', 'schedules-edit'])

    const { dispatch, move } = props

    calendar.slotSize = calendar.slotSize || 5

    const daySchedule = Schedules.findOne({
      type: 'day',
      calendarId: calendar._id,
      'day.year': day.year,
      'day.month': day.month,
      'day.day': day.day
    })

    return {
      calendar,
      assignees,
      date,
      daySchedule,
      onNewAppointmentModalOpen,
      onNewAppointmentModalClose,
      handleSetAdmitted,
      handleMove,
      canEditSchedules,
      move,
      dispatch
    }
  }
}

export const AppointmentsContainerComposed = withTracker(composer)(AppointmentsScreen)

const mapStateToProps = (store) => ({
  move: store.appointments.move
})

export const AppointmentsContainer = connect(mapStateToProps)(AppointmentsContainerComposed)
