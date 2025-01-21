import React from 'react';
import ReactDOM from 'react-dom';
import Player from './player';
import FilePicker from './file';
import {
  isAudio, readBlobURL, download, rename,
} from './utils';
import { decodeAudioBuffer, sliceAudioBuffer } from './audio-helper';
import './style.css';
import { useClassicState } from './hooks';

export default function App() {
  const [state, setState] = useClassicState<{
    file: File | null;
    blobURL: string | null;
    decoding: boolean;
    audioBuffer: AudioBuffer | null;
    paused: boolean;
    startTime: number;
    endTime: number;
    currentTime: number;
    processing: boolean;
  }>({
    file: null,
    blobURL: null,
    decoding: false,
    audioBuffer: null,
    paused: true,
    startTime: 0,
    endTime: Infinity,
    currentTime: 0,
    processing: false,
  });

  const handleFileChange = async (file: File) => {
    setState({
      file,
      blobURL: URL.createObjectURL(file),
      paused: true,
      decoding: true,
      audioBuffer: null,
    });

    const audioBuffer = await decodeAudioBuffer(file);

    setState({
      paused: false,
      decoding: false,
      audioBuffer,
      startTime: 0,
      currentTime: 0,
      endTime: audioBuffer.duration / 2,
    });
  };

  const handleStartTimeChange = (time: number) => {
    setState({
      startTime: time,
    });
  };

  const handleEndTimeChange = (time: number) => {
    setState({
      endTime: time,
    });
  };

  const handleCurrentTimeChange = (time: number) => {
    setState({
      currentTime: time,
    });
  };

  const handleEnd = () => {
    setState({
      currentTime: state.startTime,
      paused: false,
    });
  };

  const handlePlayPauseClick = () => {
    setState({
      paused: !state.paused,
    });
  };

  const handleReplayClick = () => {
    setState({
      currentTime: state.startTime,
      paused: false,
    });
  };

  const displaySeconds = (seconds: number) => `${seconds.toFixed(2)}s`;

  return (
    <div className="container">
      {
        state.audioBuffer || state.decoding ? (
          <div>
            {
              state.decoding ? (
                <div className="player player-landing">
                  DECODING...
                </div>
              ) : (
                <Player
                  audioBuffer={state.audioBuffer!}
                  blob={state.file!}
                  blobURL={state.blobURL!}
                  paused={state.paused}
                  startTime={state.startTime}
                  endTime={state.endTime}
                  currentTime={state.currentTime}
                  onStartTimeChange={handleStartTimeChange}
                  onEndTimeChange={handleEndTimeChange}
                  onCurrentTimeChange={handleCurrentTimeChange}
                  onEnd={handleEnd}
                />
              )
            }

            <div className="controllers">
              <FilePicker className="ctrl-item" onPick={handleFileChange}>
                Music
              </FilePicker>

              <button
                type="button"
                className="ctrl-item"
                title="Play/Pause"
                onClick={handlePlayPauseClick}
              >
                {state.paused ? 'PlayIcon' : 'pauseIcon'}
              </button>

              <button
                type="button"
                className="ctrl-item"
                title="Replay"
                onClick={handleReplayClick}
              >
                Replay Icon
              </button>

              {
                Number.isFinite(state.endTime)
                && (
                <span className="seconds">
                  Select
                  {' '}
                  <span className="seconds-range">
                    {
                    displaySeconds(state.endTime - state.startTime)
                  }
                  </span>
                  {' '}
                  of
                  {' '}
                  <span className="seconds-total">
                    {
                    displaySeconds(state.audioBuffer?.duration ?? 0)
                  }
                  </span>
                  {' '}
                  (from
                  {' '}
                  <span className="seconds-start">
                    {
                    displaySeconds(state.startTime)
                  }
                  </span>
                  {' '}
                  to
                  {' '}
                  <span className="seconds-end">
                    {
                    displaySeconds(state.endTime)
                  }
                  </span>
                  )
                </span>
                )
              }
            </div>
          </div>
        ) : (
          <div className="landing">
            <FilePicker onPick={handleFileChange}>
              <div className="file-main">
                Select music file
              </div>
            </FilePicker>
          </div>
        )
      }
    </div>
  );
}