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

    /**
     * targetFrame is the frame that progress should be set to based on the
     * horizontal position of the mouse on the scrubber.
     * strength is a number from 0 to 1. Strength is 1 when the mouse is vertically
     * on the scrubber and drops when the mouse gets vertically farther away
     * from the scrubber.
     */
    function targetFrameFromMouse(event: MouseEvent): {
        targetFrame: number,
        strength: number,
    } {
        if (scrubber) {
            const { left, top, width } = scrubber.getBoundingClientRect();
            let progressZeroToOne = (event.clientX - left) / width;
            progressZeroToOne = Math.min(1, progressZeroToOne); // make sure progress is at most 1
            progressZeroToOne = Math.max(0, progressZeroToOne); // make sure progress is at least 0
            let verticalDist = Math.abs(event.clientY - top);
            return {
                targetFrame: Math.round(progressZeroToOne * (props.length())),
                strength: Math.pow(Math.E, -5 * verticalDist / width),
            };
        } else {
            return {
                targetFrame: 0,
                strength: 0,
            };
        }
    }

    function onMouseMove(event: MouseEvent) {
        if (scrubber) {
            const dragStart = props.dragStart[0]();
            if (dragStart !== undefined) {
                const { targetFrame, strength } = targetFrameFromMouse(event);
                // reduce effect of dragging if mouse is farther away from scrubber
                props.progress[1](Math.round(dragStart + (targetFrame - dragStart) * strength));
                props.previewProgress[1](undefined);
            } else if (scrubber.matches(':hover')) {
                props.previewProgress[1](targetFrameFromMouse(event).targetFrame);
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
            props.dragStart[1](targetFrameFromMouse(event).targetFrame);
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
