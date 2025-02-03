import Player from './player';
import FilePicker from './file';
import { decodeAudioBuffer } from './audio-helper';
import './style.css';
import { useClassicState } from './hooks';
import { FileOpen, Pause, PlayArrow, Save } from '@mui/icons-material';
import { useCallback, useEffect } from 'react';

export default function App({
  audioName,
  selectedAudioBlob,
  onFileChange,
}: {
  audioName?: string,
  selectedAudioBlob?: Blob,
  onFileChange?: (file: File) => void,
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

  useEffect(() => {
    console.log('callback?', Date.now());
    if ( selectedAudioBlob && audioName && state.file === null ) {
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

    if ( !evtStop && onFileChange ) {
      onFileChange(file);
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
    if ( !state.file ) {
      return;
    }

    if ( typeof onFileChange === 'function' ) {
      onFileChange(state.file);
    }
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