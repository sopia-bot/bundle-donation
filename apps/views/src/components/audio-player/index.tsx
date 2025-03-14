import Player from './player';
import FilePicker from './file';
import { decodeAudioBuffer, sliceAudioBuffer } from './audio-helper';
import './style.css';
import { useClassicState } from './hooks';
import { FileOpen, Pause, PlayArrow, Save, VolumeDown, VolumeMute, VolumeOff, VolumeUp } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { Slider, Stack } from '@mui/material';
import { trimAudio } from './trim-audio';

export default function App({
  audioName,
  selectedAudioBlob,
  onChange,
  volume,
}: {
  audioName?: string,
  selectedAudioBlob?: Blob,
  onChange?: (file: File, volume: number) => void,
  volume?: number,
}) {
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
    volume: number;
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
    volume: volume || 0.5,
  });

  useEffect(() => {
    if ( selectedAudioBlob && audioName ) {
      handleFileChange(new File([selectedAudioBlob], audioName), true);
    }
  }, [selectedAudioBlob])

  const handleFileChange = async (file: File, evtStop = false) => {
    setState({
      file,
      blobURL: URL.createObjectURL(file),
      paused: true,
      decoding: true,
      audioBuffer: null,
    });

    const audioBuffer = await decodeAudioBuffer(file);

    setState({
      paused: true,
      decoding: false,
      audioBuffer,
      startTime: 0,
      currentTime: 0,
      endTime: audioBuffer.duration,
    });

    if ( !evtStop && onChange ) {
      onChange(file, state.volume);
    }
  };

  const handleVolumeChange = (newValue: number, evtStop = false) => {
    setState({
      volume: newValue,
    });

    if ( !evtStop && typeof onChange === 'function' ) {
      onChange(state.file!, newValue);
    }
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
      paused: true,
    });
  };

  const handlePlayPauseClick = () => {
    setState({
      paused: !state.paused,
    });
  };

  const handleFileSave = () => {
    const {
      startTime, endTime, audioBuffer, file, volume
    } = state;
    if (!audioBuffer || !file) return;

    const { length, duration } = audioBuffer;

    // setState({
    //   processing: true,
    // });
    trimAudio(
      audioBuffer,
      Math.floor(length * startTime / duration),
      Math.floor(length * endTime / duration),
    ).then((audioSliced) => {
      console.log('audioSliced', audioSliced, file);

      if ( typeof onChange === 'function' ) {
        onChange(new File([audioSliced], file.name), volume);
      }
    });
  }

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
                  volume={state.volume}
                />
              )
            }

            <div className="controllers">
              <FilePicker className="ctrl-item" onPick={handleFileChange}>
                <FileOpen/>
              </FilePicker>

              <button
                type="button"
                className="ctrl-item"
                title={ state.paused ? '재생' : '일시정지' }
                onClick={handlePlayPauseClick}
              >
                {
                  state.paused
                  ? <PlayArrow/>
                  : <Pause/>
                }
              </button>

              <Stack spacing={2} direction="row" sx={{ alignItems: 'center', width: '250px' }}>
                {state.volume === 0 ? <VolumeOff/> : <VolumeDown />}
                <Slider min={0} max={100} value={state.volume} onChange={(e, newValue: number | number[]) => handleVolumeChange(newValue as number, true)} />
                <VolumeUp />
                <span>{state.volume}</span>
              </Stack>

              <div style={{ flex: 1 }}>
              </div>
              <button
                type="button"
                className="ctrl-item"
                title="저장"
                style={{ margin: 0 }}
                onClick={handleFileSave}
              >
                <Save/>
              </button>
            </div>
          </div>
        ) : (
          <div className="landing">
            <FilePicker onPick={handleFileChange}>
              <div className="file-main">
                효과음 파일을 선택해 주세요.
              </div>
            </FilePicker>
          </div>
        )
      }
    </div>
  );
}