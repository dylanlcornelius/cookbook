import {
    trigger,
    transition,
    animate,
    style,
    query,
    animateChild,
    group
} from '@angular/animations';

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

export const fadeInFastAnimation = trigger('fadeInFastAnimation', [
    transition(':enter', [
        group([
            query('@*', animateChild(), {optional: true}),
            style({opacity: 0}),
            animate('100ms', style({opacity: 1}))
        ])
    ])
]);

export const slideInOutAnimation = trigger('slideInOutAnimation', [
    transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('400ms ease', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
        animate('400ms ease', style({transform: 'translateX(100%)'}))
    ])
]);
