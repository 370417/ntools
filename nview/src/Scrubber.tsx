import { Match, onCleanup, Switch, type Accessor, type Signal } from "solid-js";
import "./Scrubber.css";

type ScrubberProps = {
    recording: Signal<boolean>,
    isPlaying: Signal<boolean>,
    dragStart: Signal<number | undefined>,
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

    const previewProgressSize = () => {
        const progress = props.progress[0]();
        const previewProgress = props.previewProgress[0]();
        const length = props.length();
        if (previewProgress === undefined || length === 0) {
            return {
                left: "0%",
                width: "0%",
            };
        }
        const min = Math.min(progress, previewProgress);
        const max = Math.min(Math.max(progress, previewProgress), length);
        return {
            left: `${min / length * 100}%`,
            width: `${(max - min) / length * 100}%`,
        };
    };

    let scrubber: HTMLDivElement | undefined = undefined;

    document.addEventListener('mousemove', onMouseMove);
    onCleanup(() => document.removeEventListener('mousemove', onMouseMove));

    document.addEventListener('mouseup', onMouseUp);
    onCleanup(() => document.removeEventListener('mouseup', onMouseUp));

    function targetFrameFromMouse(event: MouseEvent): number {
        if (scrubber) {
            let { left, width } = scrubber.getBoundingClientRect();
            let progress = (event.clientX - left) / width;
            progress = Math.min(1, progress); // make sure progress is at most 1
            progress = Math.max(0, progress); // make sure progress is at least 0
            return Math.round(progress * (props.length()));
        } else {
            return 0;
        }
    }

    function onMouseMove(event: MouseEvent) {
        if (scrubber) {
            if (props.dragStart[0]() !== undefined) {
                props.progress[1](targetFrameFromMouse(event));
                props.previewProgress[1](undefined);
            } else if (scrubber.matches(':hover')) {
                props.previewProgress[1](targetFrameFromMouse(event));
            } else {
                props.previewProgress[1](undefined);
            }
        }
    }

    function onMouseUp() {
        // Stop dragging
        props.dragStart[1](undefined);
    }

    return <div id="media-controls">
        <div class="text-button"><div>⏺</div></div>
        <div class="text-button" onclick={() => {
            if (props.isPlaying[0]()) {
                props.isPlaying[1](false);
            } else {
                if (props.progress[0]() >= props.length() && !props.recording[0]()) {
                    // Go back to start if we press play after reaching the end of the recorded inputs.
                    props.progress[1](0);
                }
                props.isPlaying[1](true);
            }
        }}><div>
            <Switch>
                <Match when={!props.isPlaying[0]()}>
                    {'▶'}
                </Match>
                <Match when={props.isPlaying[0]()}>
                    {'⏸'}
                </Match>
            </Switch>
        </div></div>
        <div ref={scrubber} class="scrubber" onmousedown={event => {
            props.dragStart[1](targetFrameFromMouse(event));
            onMouseMove(event);
            event.preventDefault();
        }}>
            <div class="track"></div>
            <div class="progress" style={{ width: progressWidth() }}></div>
            <div class="previewProgress" style={{ left: previewProgressSize().left, width: previewProgressSize().width }}></div>
            <div class="thumb" style={{ left: progressWidth() }}></div>
        </div>
    </div>;
}
