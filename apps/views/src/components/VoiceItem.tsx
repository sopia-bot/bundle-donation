import styled from "@emotion/styled";
import { Avatar, Checkbox, Chip, Tooltip } from "@mui/material";
import { TemplateVoice, Voice } from "../types/template";
import { IconButton } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ChangeEvent, useEffect, useState } from "react";
import { Stop } from "@mui/icons-material";

interface VoiceItemProps {
    voice: Voice;
    onChange: (voice: Voice) => void|Promise<void>;
}

const Wrapper = styled.div(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
}));

const audio = new Audio();
export default function VoiceItem(props: VoiceItemProps) {
    const [playStatus, setPlayStatus] = useState(false);
    const [voice, setVoice] = useState<Voice>(props.voice);

    useEffect(() => {
        setVoice(props.voice);
    }, [props.voice]);

    const playSample = () => {
        if ( props.voice.preview_url ) {
            setPlayStatus(true);
            audio.src = props.voice.preview_url;
            audio.play();
            audio.onpause = () => {
                setPlayStatus(false);
            }
        }
    }
    const stopSample = () => {
        setPlayStatus(false);
        audio.pause();
    }

    const onUseChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const newItem = {
            ...voice,
            checked: evt.target.checked,
        };
        setVoice(newItem);
        props.onChange(newItem);
    }
    
    return <Wrapper>
        <div style={{ width: '60px' }}>
            <Checkbox
                checked={voice.checked}
                onChange={onUseChange}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 50 } }}
            />
        </div>
        <div style={{ padding: '0 1rem', flex: '1' }}>
            <div>
                {props.voice.name}
            </div>
            <div>
                {
                    Object.keys(props.voice.labels ?? {}).map(([key, value]) =>
                        <Chip size="small" key={`voice-${voice.voice_id}-${key}-${value}`} sx={{ marginRight: '0.5rem' }} label={`${key}: ${value}`} />
                    )
                }
            </div>
        </div>
        <div>
            {
                playStatus
                ? <Tooltip title="정지" onClick={stopSample}>
                    <IconButton size="large" color="error" aria-label="stop">
                        <Stop />
                    </IconButton>
                </Tooltip>
                : <Tooltip title="재생" onClick={playSample}>
                    <IconButton size="large" color="primary" aria-label="play">
                        <PlayArrowIcon />
                    </IconButton>
                </Tooltip>
            }
        </div>
    </Wrapper>;
}