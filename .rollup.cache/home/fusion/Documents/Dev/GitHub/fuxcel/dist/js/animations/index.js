/**
 * Returns a map of all supported Web Animations API keyframe definitions,
 * parametrised by duration, iteration count, and display value.
 */
export const animations = ({ timeout = 300, iterations = 1, display = 'unset', }) => ({
    blink: {
        name: 'blink',
        onBegin: {},
        onFinished: {},
        options: {
            keyFrames: [
                { opacity: 1 }, { opacity: 0.8 }, { opacity: 0.5 },
                { opacity: 0.3 }, { opacity: 0.1 }, { opacity: 0.3 },
                { opacity: 0.5 }, { opacity: 0.8 }, { opacity: 1 },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    fadeIn: {
        name: 'fadein',
        onBegin: { display },
        onFinished: {},
        options: {
            keyFrames: [{ opacity: 0 }, { opacity: 1 }],
            timing: { duration: timeout, iterations },
        },
    },
    fadeOut: {
        name: 'fadeout',
        onBegin: { display },
        onFinished: { display: 'none' },
        options: {
            keyFrames: [{ opacity: 1 }, { opacity: 0 }],
            timing: { duration: timeout, iterations },
        },
    },
    slideInDown: {
        name: 'slideindown',
        onBegin: { display },
        onFinished: {},
        options: {
            keyFrames: [
                { transform: 'translate3d(0, 100%, 0)', visibility: 'hidden' },
                { transform: 'translate3d(0, 0, 0)', visibility: 'visible' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideInUp: {
        name: 'slideinup',
        onBegin: { display },
        onFinished: {},
        options: {
            keyFrames: [
                { transform: 'translate3d(0, -100%, 0)', visibility: 'hidden' },
                { transform: 'translate3d(0, 0, 0)', visibility: 'visible' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideOutDown: {
        name: 'slideoutdown',
        onBegin: { display },
        onFinished: { display: 'none' },
        options: {
            keyFrames: [
                { transform: 'translate3d(0, 0, 0)', visibility: 'visible' },
                { transform: 'translate3d(0, 100%, 0)', visibility: 'hidden' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideOutUp: {
        name: 'slideoutup',
        onBegin: { display },
        onFinished: { display: 'none' },
        options: {
            keyFrames: [
                { transform: 'translate3d(0, 0, 0)', visibility: 'visible' },
                { transform: 'translate3d(0, -100%, 0)', visibility: 'hidden' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideInLeft: {
        name: 'slideinleft',
        onBegin: { display },
        onFinished: {},
        options: {
            keyFrames: [
                { transform: 'translate3d(-100%, 0, 0)', visibility: 'visible' },
                { transform: 'translate3d(0, 0, 0)' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideInRight: {
        name: 'slideinright',
        onBegin: { display },
        onFinished: {},
        options: {
            keyFrames: [
                { transform: 'translate3d(100%, 0, 0)', visibility: 'visible' },
                { transform: 'translate3d(0, 0, 0)' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideOutLeft: {
        name: 'slideoutleft',
        onBegin: { display },
        onFinished: { display: 'none' },
        options: {
            keyFrames: [
                { transform: 'translate3d(0, 0, 0)' },
                { visibility: 'hidden', transform: 'translate3d(-100%, 0, 0)' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    slideOutRight: {
        name: 'slideoutright',
        onBegin: { display },
        onFinished: { display: 'none' },
        options: {
            keyFrames: [
                { transform: 'translate3d(0, 0, 0)' },
                { visibility: 'hidden', transform: 'translate3d(100%, 0, 0)' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
    spaceLettersBig: {
        name: 'spacelettersbig',
        onBegin: {},
        onFinished: { marginRight: '50px' },
        options: {
            keyFrames: [{ marginRight: 0 }, { marginRight: '50px' }],
            timing: { duration: timeout, iterations },
        },
    },
    spaceLettersSmall: {
        name: 'spaceletterssmall',
        onBegin: {},
        onFinished: { marginRight: '3px' },
        options: {
            keyFrames: [{ marginRight: '3px' }, { marginRight: '3px' }],
            timing: { duration: timeout, iterations },
        },
    },
    unspaceLetters: {
        name: 'unspaceletters',
        onBegin: {},
        onFinished: { marginRight: 0 },
        options: {
            keyFrames: [{ marginRight: 0 }],
            timing: { duration: timeout, iterations },
        },
    },
    zoomIn: {
        name: 'zoomin',
        onBegin: {},
        onFinished: { width: 'inherit', height: 'inherit' },
        options: {
            keyFrames: [
                { width: '500px', height: '500px' },
                { width: '150px', height: '150px' },
            ],
            timing: { duration: timeout, iterations },
        },
    },
});
//# sourceMappingURL=index.js.map