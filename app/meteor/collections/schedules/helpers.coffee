Meteor.startup ->
  Schedules.helpers
    isValid: (range) -> true


    isWithin: (time = moment()) ->
      weekday = Time.toWeekday(time)
      if day = @getDay(weekday)
        shifts = _.map day.shift, (s) ->
          if s?.start and s?.end
            start = time.clone().hour(s.start.h).minute(s.start.m or 0).second(0)
            end = time.clone().hour(s.end.h).minute(s.end.m or 0).second(0)
            range = moment.range(start, end)

        return _.any shifts, (s) -> s.contains(time)

    totalHoursPerWeek: ->
      _.reduce(@schedule, (total, day) =>
        hours = @totalHoursPerDay(day)
        hours = 0 if not hours
        total += hours
       , 0)

    totalHoursPerDay: (day) ->
      day = @getDay(day) if (typeof day is 'string')
      return unless day?
      shifts = _.map(day.shift, (shift) ->
        if (shift?.end and shift?.start)
          h = shift.end.h - shift.start.h
          h += (shift.end.m / 60) if (shift.end.m)
          h -= (shift.start.m / 60) if (shift.start.m)
          h)
      _.reduce(shifts, ((total, hours) -> total + hours), 0)

    getDay: (weekday) ->
      _.find(@schedule, (day) -> day.day is weekday)

    stringify: (weekday) ->
      return unless shift = @getDay(weekday)?.shift
      shift = shift.map (s) ->
        [
          Time.format('H:mm', s.start)
          '-'
          Time.format('H:mm', s.end)
        ].join('')
      shift.join('\n')

    collection: ->
      Schedules
