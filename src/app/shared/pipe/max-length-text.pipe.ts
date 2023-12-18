import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'maxLengthText',
    standalone: true,
})
export class MaxLengthTextPipe implements PipeTransform {
    transform(): unknown {
        // return value?.slice(0, number) + '...';
        return null;
    }
}
