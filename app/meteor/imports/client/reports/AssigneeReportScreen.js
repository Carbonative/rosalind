import React from 'react'
import FlipMove from 'react-flip-move'
import moment from 'moment-timezone'
import { Button } from 'react-bootstrap'
import { TAPi18n } from 'meteor/tap:i18n'
import { weekOfYear } from '../../util/time/format'
import { dayToDate } from '../../util/time/day'
import { Icon } from '../components/Icon'
import { DateRangeNavigation } from '../components/DateRangeNavigation'
import { Box } from '../components/Box'
import { Report } from './Report'
import { Preview } from './Preview'
import { FooterContainer } from '../layout/FooterContainer'
import { UserPickerContainer } from '../users/UserPickerContainer'

const formatRange = ({ start, end }) =>
  ([
    moment(start).format(TAPi18n.__('time.dateFormatShortNoYear')),
    '-',
    moment(end).format(TAPi18n.__('time.dateFormatShort'))
  ].join(' '))

export class AssigneeReportScreen extends React.Component {
  constructor (props) {
    super(props)
    this.handlePrint = this.handlePrint.bind(this)
    this.handleToggleRevenue = this.handleToggleRevenue.bind(this)

    this.state = {
      showRevenue: false
    }
  }

  handlePrint () {
    if (window.native) {
      console.log('[Client] Printing: native')
      const title = moment(dayToDate(this.props.day))
        .format("YYYY-MM-DD-[#{TAPi18n.__('reports.thisDaySingular')}]")
      window.native.print({ title })
    } else {
      console.log('[Client] Printing: default')
      window.print()
    }
  }

  handleToggleRevenue () {
    this.setState({
      ...this.state,
      showRevenue: !this.state.showRevenue
    })
  }

  render () {
    const formattedRange = formatRange({
      start: this.props.from,
      end: this.props.to
    })

    return (
      <div>
        <div className='content-header show-print'>
          <h1 className='show-print hide-screen'>
            {this.props.user && this.props.user.fullNameWithTitle()}

            <small>{formattedRange}</small>
          </h1>

          <h1 className='hide-print'>
            {TAPi18n.__('reports.assigneesReport')}
          </h1>

          <DateRangeNavigation
            start={this.props.from}
            end={this.props.to}
            onRangeChange={this.props.handleRangeChange}
            calendarText={formattedRange}
            pullRight>
            <Button onClick={this.handlePrint} title={TAPi18n.__('ui.print')}><Icon name='print' /></Button>
            {
              this.props.canShowRevenue &&
                <Button onClick={this.handleToggleRevenue} title={TAPi18n.__('reports.toggleRevenue')}><Icon name='euro' /></Button>
            }
          </DateRangeNavigation>
        </div>
        <div className='content'>
          <div className='hide-print' style={{ paddingBottom: 15 }}>
            <UserPickerContainer
                autofocus
                onChange={this.props.handleChangeAssignee} />
          </div>
          <div className='display-none show-print' style={{ width: '100%', height: 5 }} />
          <FlipMove duration={230}>
            {
              this.props.report && this.props.report.assignees.length > 0
              ? <div key='reportTable'>
                <Report
                  report={this.props.report}
                  showRevenue={this.state.showRevenue}
                  mapUserIdToName={this.props.mapUserIdToName}
                  assigneeReport
                  __={this.props.__}
                />
              </div>
              : <div key='noReports'>
                <Box type='warning' title={TAPi18n.__('ui.notice')}>
                  <p>{TAPi18n.__('reports.empty')}</p>
                </Box>
              </div>
            }
          </FlipMove>
        </div>
      </div>
    )
  }
}
