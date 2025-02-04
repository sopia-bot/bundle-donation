/* eslint-disable jsx-a11y/media-has-caption */
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import Waver from './waver';
import Dragger, { Pos } from './dragger';
import { formatSeconds } from './utils';
import { useRaf } from './hooks';

function clamp(x: number, min: number, max: number) {
    if (x < min) {
        return min;
    }
    
    if (x > max) {
        return max;
    }
    
    return x;
}

function getClipRect(start: number, end: number, containerHeight = 0) {
    return `rect(0, ${end}px, ${containerHeight}px, ${start}px)`;
}

const color1 = '#0cf';
const color2 = '#1ad1ff';
const gray1 = '#ddd';
const gray2 = '#e3e3e3';

interface PlayerProps {
    blob: Blob;
    blobURL: string;
    audioBuffer: AudioBuffer;
    paused: boolean;
    startTime: number;
    endTime: number;
    currentTime: number;
    onStartTimeChange(time: number): void;
    onEndTimeChange(time: number): void;
    onCurrentTimeChange(time: number): void;
    onEnd(): void;
    volume: number;
}

export default function Player({
    blob,
    blobURL,
    audioBuffer,
    startTime,
    endTime,
    currentTime,
    paused,
    onStartTimeChange,
    onEndTimeChange,
    onCurrentTimeChange,
    onEnd,
    volume,
}: PlayerProps) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const widthDurationRatio = containerWidth / audioBuffer.duration;
    const time2pos = (time: number) => time * widthDurationRatio;
    const audioRef = useRef<HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const currentTimeRef = useRef<number>();
    
    const pos2Time = useCallback(
        (pos: number) => pos / widthDurationRatio,
        [widthDurationRatio],
    );
    
    const clampTime = useCallback(
        (time: number) => clamp(time, 0, audioBuffer.duration),
        [audioBuffer.duration],
    );
    
    const start = time2pos(startTime);
    const end = time2pos(endTime);
    const current = time2pos(currentTime);
    
    const currentTimeFormatted = formatSeconds(currentTime);

    function resizeEvent() {
        if (!containerRef.current) return;
        setContainerWidth(containerRef.current.clientWidth);
        setContainerHeight(containerRef.current.clientHeight);
    }
    window.removeEventListener('resize', resizeEvent);
    window.addEventListener('resize', resizeEvent);
    useEffect(() => {
        resizeEvent();
    }, []);

    const handleDragStart = useCallback(({ x }: Pos) => {
        onStartTimeChange(clampTime(pos2Time(x)));
    }, [clampTime, onStartTimeChange, pos2Time]);
    
    const handleDragEnd = useCallback(({ x }: Pos) => {
        onEndTimeChange(clampTime(pos2Time(x)));
    }, [clampTime, onEndTimeChange, pos2Time]);
    
    const handleDragCurrent = useCallback(({ x }: Pos) => {
        onCurrentTimeChange(clampTime(pos2Time(x)));
    }, [clampTime, onCurrentTimeChange, pos2Time]);
    
    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const { currentTime: time } = audioRef.current;
        if (time === currentTime) return;
        onCurrentTimeChange(time);
        if (time >= endTime && currentTime < endTime) {
            onEnd();
        }
        currentTimeRef.current = time;
    };
    
    const handleEnded = () => {
        onEnd();
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio?.src) return;
        
        if (paused) {
            audio.pause();
        } else {            
            audio.play();
        }
    }, [paused]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio?.src) return;
        
        audio.volume = volume * 0.01;
    }, [volume])
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio?.src) return;
        
        if (currentTimeRef.current !== currentTime) {
            audio.currentTime = currentTime;
        }
    }, [currentTime]);
    
    useRaf(handleTimeUpdate);
    
    return (
        <div className="player" ref={containerRef}>
            <audio
                hidden
                src={blobURL}
                ref={audioRef}
                onEnded={handleEnded}
            />
            <div className="clipper">
                <Waver
                    audioBuffer={audioBuffer}
                    width={containerWidth}
                    height={containerHeight}
                    color1={gray1}
                    color2={gray2}
                />
            </div>
            <div
                className="clipper"
                style={{ clip: getClipRect(start, end, containerHeight) }}
            >
                <Waver
                    audioBuffer={audioBuffer}
                    width={containerWidth}
                    height={containerHeight}
                    color1={color1}
                    color2={color2}
                />
            </div>
            <Dragger
                x={start}
                value={startTime}
                onDrag={handleDragStart}
            />
            <Dragger
                className="drag-current"
                x={current}
                value={currentTime}
                onDrag={handleDragCurrent}
            >
                <div className="cursor-current">
                    <span className="num">{currentTimeFormatted[0]}</span>
                    &apos;
                    <span className="num">{currentTimeFormatted[1]}</span>
                    .
                    <span className="num">{currentTimeFormatted[2].toString().padStart(2, '0')}</span>
                </div>
            </Dragger>
            <Dragger
                x={end}
                value={endTime}
                onDrag={handleDragEnd}
            />
        </div>
    );
}