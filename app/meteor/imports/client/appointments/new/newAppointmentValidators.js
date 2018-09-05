import unidecode from 'unidecode'

export const validateNameCase = (name) => {
  if (name && name.length >= 4) {
    const withoutDiacritics = unidecode(name)
    return !!(
      withoutDiacritics.match(/^[A-Z][a-z]/) ||
      withoutDiacritics.match(/^[A-Z][a-z]/) ||
      withoutDiacritics.match(/\s/) ||
      withoutDiacritics.match(/[a-z][A-Z][a-z]/)
    )
  } else {
    return true
  }
}

export const validateDay = (day) => {
  return (typeof day === 'object' && day.year && day.month && day.day)
}

export const validate = ({ appointment, patient }) => {
  let errors = {
    patient: {},
    appointment: {}
  }

  const hasNote = appointment && appointment.note
  const hasPatientId = patient && (patient.patientId || patient.insuranceId)

  if (!hasNote && !hasPatientId) {
    errors.appointment.note = 'appointments.addNoteIfNoPatientSelected'
  }

  if (!appointment || (
    (
      !appointment.tags ||
      appointment.tags.length === 0
    ) && !appointment.note)
  ) {
    errors.appointment.tags = 'appointments.selectTagOrNote'
    errors.appointment.note = 'appointments.addNoteIfNoTagsSelected'
  }

  if (patient && (patient.patientId || patient.lastName || patient.firstName)) {
    if (!patient.lastName) {
      errors.patient.lastName = 'patients.lastNameRequired'
    }

    if (!patient.firstName) {
      errors.patient.firstName = 'patients.firstNameRequired'
    }

    if (!patient.birthday || patient.birthday && !validateDay(patient.birthday)) {
      errors.patient.birthday = 'patients.birthdayRequired'
    }
  }

  if (Object.keys(errors.appointment).length === 0) {
    delete errors.appointment
  }

  if (Object.keys(errors.patient).length === 0) {
    delete errors.patient
  }

  return errors
}
