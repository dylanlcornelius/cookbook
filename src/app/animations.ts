import {
    trigger,
    transition,
    animate,
    style,
    query
} from '@angular/animations';

// width is content width
export const fadeComponentAnimation = trigger('fadeComponentAnimation', [
    transition('* <=> *', [
        query(':leave', style({position: 'absolute', opacity: 1, width: '90%'}), {optional: true}),
        query(':enter', style({position: 'absolute', opacity: 0, width: '90%'}), {optional: true}),
        query(':leave', animate('0.2s', style({opacity: 0})), {optional: true}),
        query(':enter', animate('0.2s', style({opacity: 1})), {optional: true})
    ])
]);

export const fadeInAnimation = trigger('fadeInAnimation', [
    transition(':enter', [
        style({opacity: 0}),
        animate('1s', style({opacity: 1}))
    ])
]);
