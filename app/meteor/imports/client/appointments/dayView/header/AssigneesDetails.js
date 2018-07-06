import React from 'react'
import { Icon } from '../../../components/Icon'
import { TagsList } from '../../../tags/TagsList'
import { background } from '../../../css/global'
import { InlineEdit } from '../../../components/form'

const barStyle = {
  position: 'fixed',
  pointerEvents: 'none',
  minHeight: 40,
  marginTop: 43,
  top: 44,
  right: 15,
  left: 60,
  zIndex: 40,
  paddingLeft: 60,
  display: 'flex'
}

const cellStyle = {
  flex: 1,
  borderRadius: 4,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingLeft: 4,
  paddingRight: 4,
  paddingTop: 5,
  paddingBottom: 12
}

const relevantCellStyle = {
  background,
  borderBottom: '1px solid #d2d6de',
  pointerEvents: 'auto'
}

const leftAlign = {
  textAlign: 'left'
}

const Constraint = ({ constraint }) => (
  <div>
    {
      constraint.duration
      ? <span>
        <Icon name='clock-o' /> {constraint.duration} min {constraint.note && <span>&middot; {constraint.note}</span>}
      </span>
      : <span>
        {constraint.note}
      </span>
    }
    {
      constraint.tags && <div style={leftAlign}><TagsList tiny tags={constraint.tags} /></div>
    }
  </div>
)

const highlightStyle = {
  backgroundColor: '#FFF9C4'
}

const BreakLines = ({ children, placeholder }) =>
  children
  ? children.split('\n').map((t, i) => (
    <span key={i} style={highlightStyle}>{t}<br /></span>
  ))
  : placeholder

const Cell = ({ calendar, daySchedule, canEditSchedules, assignee, expanded, onChangeNote, isLast }) => {
  const isRelevant = (assignee.constraints && assignee.constraints.length > 0)
  const isDayNoteColumn = (!assignee.assigneeId || (!calendar.allowUnassigned && isLast))
  const hasDayNote = (daySchedule && (daySchedule.note || daySchedule.noteDetails))
  const style = (isRelevant || (isDayNoteColumn && (canEditSchedules || hasDayNote)))
    ? { ...relevantCellStyle, ...cellStyle }
    : cellStyle

  // Day note
  const dayNote = (isDayNoteColumn && (hasDayNote || canEditSchedules))
    ? <div>
      {
        expanded && canEditSchedules && <div>
          <InlineEdit
            value={daySchedule && daySchedule.note || ''}
            placeholder='Info'
            rows={3}
            rowsMax={10}
            submitOnBlur
            submitOnMouseLeave
            onChange={note => onChangeNote({ note })}
          ><BreakLines placeholder='Info'>{daySchedule.note}</BreakLines></InlineEdit>

          <br />
          <br />

          <InlineEdit
            value={daySchedule && daySchedule.noteDetails || ''}
            placeholder='Details'
            rows={3}
            rowsMax={10}
            submitOnBlur
            submitOnMouseLeave
            onChange={noteDetails => onChangeNote({ noteDetails })}
          ><BreakLines placeholder='Details'>{daySchedule.noteDetails}</BreakLines></InlineEdit>
        </div>
      }
      {
        expanded && !canEditSchedules && hasDayNote && <div>
          <BreakLines>{daySchedule.note}</BreakLines>
          {daySchedule.noteDetails &&
            <p><BreakLines>{daySchedule.noteDetails}</BreakLines></p>
          }
        </div>
      }
      {
        !expanded && hasDayNote && <div>
          <BreakLines>{daySchedule.note}</BreakLines>
        </div>
      }
      {
        !expanded && canEditSchedules && !hasDayNote && <div>
          <Icon name='pencil' style={{ opacity: 0.2 }} />
        </div>
      }
    </div>
  : null

  return <div style={style}>
    { dayNote }
    {
      expanded && isRelevant && assignee.constraints.map((constraint) => (
        <div key={constraint._id}>
          <Icon name='info-circle' />
          <Constraint constraint={constraint} />
        </div>
      ))
    }
    {
      !expanded && isRelevant && <div>
        <Icon name='info-circle' />
      </div>
    }
  </div>
}

export const AssigneesDetails = ({ calendar, daySchedule, assignees, expanded, canEditSchedules, onChangeNote }) => (
  <div style={barStyle}>
    {
      assignees.map((assignee, i) =>
        <Cell
          key={assignee.assigneeId}
          calendar={calendar}
          canEditSchedules={canEditSchedules}
          onChangeNote={onChangeNote}
          assignee={assignee}
          expanded={expanded}
          isLast={i === (assignees.length - 1)}
          daySchedule={daySchedule} />
      )
    }
  </div>
)
