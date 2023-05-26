import {Directive, HostBinding} from '@angular/core'
import {v4 as uuidv4} from 'uuid'

@Directive({
  selector: '[appUniqueId]',
})
export class UniqueIdDirective {
  readonly uniqueId = uuidv4()
  @HostBinding('id') id = this.uniqueId
}
