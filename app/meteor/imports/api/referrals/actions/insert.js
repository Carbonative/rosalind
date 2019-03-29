import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { Events } from '../../events'

export const insert = ({ Referrals, Referrables }) => {
  return new ValidatedMethod({
    name: 'referrals/insert',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
      patientId: { type: SimpleSchema.RegEx.Id },
      appointmentId: { type: SimpleSchema.RegEx.Id },
      referredTo: { type: SimpleSchema.RegEx.Id },
      referrableId: { type: SimpleSchema.RegEx.Id }
    }).validator(),

    run ({ patientId, appointmentId, referredTo, referrableId }) {
      if (!this.userId) {
        throw new Meteor.Error(403, 'Not authorized')
      }

      if (!Referrables.findOne({ _id: referrableId })) {
        throw new Error(`[Referrals] Unknown referrableId: ${referrableId}`)
      }

      if (Referrals.findOne({ patientId, referredTo })) {
        console.warn(`[Referrals] insert: Patient ${patientId} has already been referred to ${referredTo}`)
        return
      }

      const referralId = Referrals.insert({
        patientId,
        appointmentId,
        referredTo,
        referrableId,
        referredBy: this.userId,
        referringAppointmentId: appointmentId,
        createdAt: new Date()
      })

      Events.post('referrals/insert', { referralId })

      return appointmentId
    }
  })
}
