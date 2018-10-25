import fromPairs from 'lodash/fromPairs'
import some from 'lodash/fp/some'

export default ({ Tags }) => {
  // Maps Tag ids to reporting categories, eg.:
  //   { 'fe2r9qedo': 'surgery' }
  const getMappingForReports = () => {
    const tags = Tags.find().fetch()

    return fromPairs(tags.map((tag) => {
      return [ tag._id, tag.reportAs || null ]
    }))
  }

  const expand = (tags = []) =>
    tags.map(t => t.tag ? t : Tags.findOne({ _id: t }))

  const isPrivate = tags =>
    some('privateAppointment')(expand(tags))

  return { getMappingForReports, expand, isPrivate }
}
