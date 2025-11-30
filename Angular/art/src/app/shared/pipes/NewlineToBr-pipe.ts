import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appNewlineToBr',
  standalone: true,
})
export class NewlineToBrPipe implements PipeTransform {

  transform(value: string): string {
    return value ? value.replace(/\n/g, '<br/>') : '';
  }

}
