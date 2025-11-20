import { createSignal, onCleanup, type Accessor, type Signal } from "solid-js";
import "./Scrubber.css";

type ScrubberProps = {
    state: Signal<'play' | 'pause' | 'drag-playing' | 'drag-paused'>,
    length: Accessor<number>,
    progress: Accessor<number>,
    previewProgress: Accessor<number | undefined>,
    onSeek(frame: number): void,
    onSeekPreview(frame: number | undefined): void,
};

export function Scrubber(props: ScrubberProps) {
    const progressWidth = () => {
        const progress = props.progress();
        const length = props.length();
        if (length === 0 || progress >= length) {
            return "100%";
        } else {
            return `${progress / length * 100}%`;
        }
    };

    const [isDragging, setIsDragging] = createSignal(false);

    let scrubber: HTMLDivElement | undefined = undefined;

    document.addEventListener('mousemove', onMouseMove);
    onCleanup(() => document.removeEventListener('mousemove', onMouseMove));

    document.addEventListener('mouseup', onMouseUp);
    onCleanup(() => document.removeEventListener('mouseup', onMouseUp));

    function onMouseMove(event: MouseEvent) {
        if (scrubber) {
            const overlapX = event.clientX > scrubber.clientLeft && event.clientX < scrubber.clientLeft + scrubber.clientWidth;
            const overlapY = event.clientY > scrubber.clientTop && event.clientY < scrubber.clientTop + scrubber.clientHeight;
            const isHovering = overlapX && overlapY;

            let progress = (event.clientX - scrubber.clientLeft) / scrubber.clientWidth;
            progress = Math.min(1, progress); // make sure progress is at most 1
            progress = Math.max(0, progress); // make sure progress is at least 0
            let targetFrame = Math.round(progress * (props.length()));

            if (isDragging()) {
                props.onSeek(targetFrame);
                props.onSeekPreview(undefined);
            } else if (isHovering) {
                props.onSeekPreview(targetFrame);
            } else {
                props.onSeekPreview(undefined);
            }
        }
    }

    function onMouseUp() {
        setIsDragging(false);
        if (props.state[0]() === 'drag-paused') {
            props.state[1]('pause');
        } else if (props.state[0]() === 'drag-playing') {
            props.state[1]('play');
        }
    }

    return <div ref={scrubber} class="scrubber" onmousedown={event => {
        setIsDragging(true);
        onMouseMove(event);
    }}>
        <div class="track"></div>
        <div class="progress" style={{ width: progressWidth() }}></div>
        <div class="previewProgress"></div>
        <div class="thumb" style={{ left: progressWidth() }}></div>
    </div>;
}
