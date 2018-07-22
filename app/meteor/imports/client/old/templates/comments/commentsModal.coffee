import './commentsModal.tpl.jade'
import inflector from 'inflected'
import { __ } from '../../../../i18n'
import * as inboundCalls from '../../../inboundCalls'

ReactComponents = { inboundCalls }

Template.commentsModal.helpers
  modalTitle: ->
    __(@collection()._name + '.thisSingular')

  blazeTemplate: ->
    template = inflector.singularize(@collection()._name)
    template = template.charAt(0).toLowerCase() + template.slice(1)
    return template if Template[template]

  reactComponent: ->
    api = @collection()._name
    component = inflector.singularize(@collection()._name)
    component = inflector.singularize(@collection()._name)
    component = component.charAt(0).toUpperCase() + component.slice(1)
    component = component + 'Container'

    console.log('[Client] commentsModal rendering react component', component)

    ReactComponents[api][component]
