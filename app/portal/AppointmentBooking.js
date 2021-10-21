import { useState, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { ErrorBoundary, Radio, Section, Select } from './components'
import { apiBaseUrl } from './apiBaseUrl'

const RequestSameAssignee = () => {
  return <div>
    <label htmlFor='requestSameAssignee'>
      <span>Wer soll Sie behandeln?</span>
    </label>
    <Radio
      name='requestSameAssignee'
      value='dontcare'
      label='Egal, die Person mit dem nächsten freien Termin'
      required
    />
    <Radio
      name='requestSameAssignee'
      value='true'
      label='Die selbe Person wie letztes Mal'
      required
    />
    <Radio
      name='requestSameAssignee'
      value='false'
      label='Eine andere Person als letztes Mal'
      required
    />
  </div>
}

const buttonStyle = {
  width: 34,
  height: 31,
  fontSize: '12pt',
  padding: '4px 0px 0px 0px'
}

const Button = ({ children, style = {}, ...props }) =>
  <button
    className={`button ${props.disabled && 'disabled'}`}
    style={{...buttonStyle, ...style}}
    {...props}>
    {children}
  </button>

const slotPickerStyle = {
  display: 'flex'
}

const dayStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 15,
  marginRight: 15
}

const timeLabelStyle = {
  padding: 10,
  borderRadius: 4,
  marginBottom: 4,
  cursor: 'pointer',
  background: 'rgba(128,128,128,0.05)',
  borderBottom: '2px solid rgba(128,128,128,0.1)'
}

const timeLabelHoverStyle = {
  ...timeLabelStyle,
  background: 'rgba(128,128,128,0.1)',
  borderBottom: '2px solid rgba(128,128,128,0.4)'
}

const timeLabelStyleChecked = {
  ...timeLabelStyle,
  color: 'white',
  background: 'rgba(29, 97, 167, 1)',
  borderBottom: '2px solid rgba(29, 70, 135, 1)'
}

const timeLabelInnerStyle = {
  paddingLeft: 4,
  paddingRight: 10
}

const Time = ({ _id, day, time, isReserve }) => {
  const [hover, setHover] = useState(false)
  const label = isReserve
    ? time + ' ⚠️'
    : time
  const title = isReserve
    ? [day, time].join(' um ') + ' Uhr - Reservetermin mit langen Wartezeiten'
    : [day, time].join(' um ') + ' Uhr'
  return <div
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    title={title}
    >
    <Radio
      name='bookableId'
      value={_id}
      label={label}
      required
      labelStyle={hover ? timeLabelHoverStyle : timeLabelStyle}
      checkedLabelStyle={timeLabelStyleChecked}
      labelInnerStyle={timeLabelInnerStyle}
    />
  </div>
}

const dayHeaderStyle = {
  textAlign: 'center',
  fontWeight: 'bold',
  cursor: 'pointer',
  userSelect: 'none',
  marginBottom: 8
}

const Day = ({ day, times, onClick }) => {
  return <div style={dayStyle}>
    <div style={dayHeaderStyle} onClick={onClick}>
      {day}
    </div>
    {times.map(t =>
      <Time
        key={t._id}
        {...t}
        day={day}
      />
    )}
  </div>
}

const arrowButtonStyle = {
  width: 33
}

const SlotPicker = (props) => {
  const { setFieldValue, values } = useFormikContext()
  const [pages, setPages] = useState(null)
  const [page, setPage] = useState(0)
  const [canRefresh, setCanRefresh] = useState(false)
  const [pending, setPending] = useState(true)

  const refresh = async () => {
    setCanRefresh(false)
    setPending(true)
    const res = await fetch((apiBaseUrl || '') + '/portal/appointments')
    const ps = await res.json()
    setPages(ps)
    const refreshable = setTimeout(() => setCanRefresh(true), 3000)
    setPending(false)
    return () => clearTimeout(refreshable)
  }

  const selectedBookable = values.bookableId && pages && (() => {
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      if (page) {
        for (let j = 0; j < page.times.length; j++) {
          const time = page.times[j]
          if (time && time._id === values.bookableId) {
            return { ...time, day: page.day }
          }
        }
      }
    }
  })()

  useEffect(refresh, [page]) // TODO: refresh on form values change, post as params

  // responsive hack: show one day on mobile only
  const pageSize = (typeof document !== 'undefined' && document.body.clientWidth < 500) ? 1 : 3
  const next = pages && page < (Math.floor(pages.length / pageSize) - 1) && (() => setPage(page+1))
  const prev = pages && page > 0 && (() => setPage(page-1))

  if (!pages) {
    return <b>Einen Moment bitte, verfügbare Termine werden gesucht...</b>
  }

  const days = pages.slice(page * pageSize, page * pageSize + pageSize)

  if (!days || days.length === 0) {
    return <b>Entschuldigung, momentan sind leider keine Termine online verfügbar. Bitte kontaktieren Sie uns telefonisch.</b>
  }

  return <Section>
    <p>
      Wählen Sie Ihren Wunschtermin
      &emsp;
      {canRefresh &&
        <a
          href='#'
          style={{ opacity: 0.8, display: 'inline-block', paddingLeft: 20 }}
          onClick={(e) => { e.preventDefault(); refresh(); }}
        >
          Neu laden
        </a>
      }
    </p>

    {/* {pending && <p><i>Verfügbare Termine werden gesucht...</i></p>} */}

    <div style={slotPickerStyle}>
      <Button
        title={prev
            ? 'Frühere Termine'
            : 'Keine früheren Termine verfügbar'}
        disabled={!prev}
        style={arrowButtonStyle}
        onClick={(e) => { e.preventDefault(); prev() }}
      >
        &lt;
      </Button>

      {days.map(d =>
        <Day
          key={d.day}
          {...d}
          onClick={() => {
            setFieldValue('bookableId', d.times[0]._id)
          }} />
      )}

      <Button
        title={next
            ? 'Spätere Termine'
            : 'Keine späteren Termine verfügbar'}
        disabled={!next}
        style={arrowButtonStyle}
        onClick={(e) => { e.preventDefault(); next() }}
      >
        &gt;
      </Button>
    </div>
    <Section>
      {
        selectedBookable &&
         <span>
           <b>
           Ihr Termin:
           &nbsp;
           {selectedBookable.day} um {selectedBookable.time} Uhr
           </b>
           {selectedBookable.isReserve &&
             <p><b>
               ⚠️ &emsp; Reservetermin bzw. Einschub: Bei diesem Termin kann es zu sehr langen Wartezeiten kommen.
              </b></p>}
          </span>
      }
    </Section>
  </Section>
}

export const AppointmentBooking = ({ show, tags = [], requestAssignee = null, apiBaseUrl }) => {
  return show && <div>
    {
      tags.length > 1 &&
        <Section>
          <Select label='Was benötigen Sie?' name='tag'>
            <option disabled value={''}>-</option>
            <option value='tag1'>Erstordination (Kasse)</option>
            <option value='tag1'>Muttermalkontrolle (Kasse)</option>
            <option value='tag2'>Ästhetik (Privat)</option>
          </Select>
        </Section>
    }
    {
      requestAssignee &&
        <Section>
          <RequestSameAssignee />
        </Section>
    }
    <Section>
      <ErrorBoundary>
        <SlotPicker />
      </ErrorBoundary>
    </Section>
  </div>
}
