import { onCleanup, type Accessor, type Signal } from "solid-js";
import "./Scrubber.css";

type ScrubberProps = {
    state: Signal<'play' | 'pause' | 'drag-playing' | 'drag-paused'>,
    length: Accessor<number>,
    progress: Signal<number>,
    previewProgress: Signal<number | undefined>,
};

export function Scrubber(props: ScrubberProps) {
    const progressWidth = () => {
        const progress = props.progress[0]();
        const length = props.length();
        if (length === 0 || progress >= length) {
            return "100%";
        } else {
            return `${progress / length * 100}%`;
        }
    };

    let scrubber: HTMLDivElement | undefined = undefined;

    document.addEventListener('mousemove', onMouseMove);
    onCleanup(() => document.removeEventListener('mousemove', onMouseMove));

    document.addEventListener('mouseup', onMouseUp);
    onCleanup(() => document.removeEventListener('mouseup', onMouseUp));

    function onMouseMove(event: MouseEvent) {
        if (scrubber) {
            const isHovering = scrubber.matches(':hover');

            let progress = (event.clientX - scrubber.clientLeft) / scrubber.clientWidth;
            progress = Math.min(1, progress); // make sure progress is at most 1
            progress = Math.max(0, progress); // make sure progress is at least 0
            let targetFrame = Math.round(progress * (props.length()));

            const state = props.state[0]();
            if (state === 'drag-paused' || state === 'drag-playing') {
                props.progress[1](targetFrame);
                props.previewProgress[1](undefined);
            } else if (isHovering) {
                props.previewProgress[1](targetFrame);
            } else {
                props.previewProgress[1](undefined);
            }
        }
    }

    function onMouseUp() {
        if (props.state[0]() === 'drag-paused') {
            props.state[1]('pause');
        } else if (props.state[0]() === 'drag-playing') {
            props.state[1]('play');
        }
    }

    return <div ref={scrubber} class="scrubber" onmousedown={event => {
        const state = props.state[0]();
        if (state === 'play') {
            props.state[1]('drag-playing');
        } else {
            props.state[1]('drag-paused');
        }
        onMouseMove(event);
        event.preventDefault();
    }}>
        <div class="track"></div>
        <div class="progress" style={{ width: progressWidth() }}></div>
        <div class="previewProgress"></div>
        <div class="thumb" style={{ left: progressWidth() }}></div>
    </div>;
}
