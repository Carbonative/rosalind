/* eslint-env mocha */
import { expect } from 'chai'
import momentTz from 'moment-timezone'
import { extendMoment } from 'moment-range'
import { generate } from './generate'

const moment = extendMoment(momentTz)

const day = {
  day: 12,
  month: 4,
  year: 2017
}

const appointments = [
  { id: '101', assigneeId: '1', tag: 'new' },
  { id: '102', assigneeId: '1', tag: 'surgery' },
  { id: '103', assigneeId: '1', tag: 'surgery' },
  { id: '104', assigneeId: '2', tag: 'new' },
  { id: '105', assigneeId: '2', tag: 'recall' },
  { id: '106', assigneeId: '2', tag: 'surgery' }
]

describe('reports', () => {
  describe('generate', () => {
    it('generates report', () => {
      const generatedReport = generate({ day, appointments })

      const expectedReport = {
        day,
        assignees: [
          {
            assigneeId: '1',
            patients: {
              total: {
                planned: 3
              },
              new: {
                planned: 1
              },
              surgery: {
                planned: 2
              }
            }
          },
          {
            assigneeId: '2',
            patients: {
              total: {
                planned: 3
              },
              new: {
                planned: 1
              },
              recall: {
                planned: 1
              },
              surgery: {
                planned: 1
              }
            }
          }
        ],
        total: {}
      }

      expect(generatedReport).to.eql(expectedReport)
    })
  })
})
