import { useEffect, useRef, useState } from "react";
import { Template, Voice } from "../types/template";
import { StickerDialogBtn } from "./StickerDialog";
import { FormControl, Grid2 as Grid, Input, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Slider, TextField, Typography } from "@mui/material";
import { Sticker } from "@sopia-bot/core";
import styled from "@emotion/styled";
import { VolumeOff, VolumeUp } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import VoiceItem from "./VoiceItem";


interface TemplateSettingProp {
    template: Template
    onChange: (template: Template) => void
}

/*
1. 트리거 방식 (스티커, n개이상)
2. 트리거 스티커 / 트리거 갯수
3. 보이스 선택
4. 보이스 볼륨
5. 템플릿 삭제
*/

const RightDiv = styled.div(() => ({
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0 1rem',
}));

export default function(props: TemplateSettingProp) {
    const [template, setTemplate] = useState<Template>(props.template);
    const { isPending, error, data, isSuccess } = useQuery({
        queryKey: ['getVoice'],
        queryFn: () => fetch('stp://donation.sopia.dev/voices').then((res) => res.json()),
    });
    const [voices, setVoices] = useState<Voice[]>([]);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newData = data.voices.map((voice: Voice) => {
            let checked = props.template.voices.find((item: any) => item.voiceId === voice.voice_id) ? true : false;
            return {
                ...voice,
                checked,
            }
        });
        setVoices(newData);
        setTemplate(props.template);
        if ( divRef.current ) {
            divRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, [props.template]);

    if ( isPending ) return 'Lodaing...';
    
    if ( error ) return 'An error has occurred: ' + error.message;
    

    const templateChange = (key: keyof Template, value: Template[keyof Template]) => {
        const newTemplate = {
            ...template,
            [key]: value,
        };
        props.onChange(newTemplate)
        setTemplate(newTemplate);
    }

    const voiceToggle = (item: Voice) => {
        const newVoices = voices.map((voice: Voice) => {
            if ( voice.voice_id === item.voice_id ) {
                return item;
            }
            return voice;
        })
        const settingVoices = newVoices
            .filter((voice: Voice) => voice.checked)
            .map((voice: Voice) => ({
                name: voice.name || '',
                voiceId: voice.voice_id
            }));
        templateChange('voices', settingVoices);
        setVoices(newVoices);
    }

    return <div ref={divRef} style={{ maxHeight: 'calc(100vh - 113px)', overflowY: 'auto' }}>
        <Grid container spacing={2} style={{ marginTop: '1rem' }} alignItems={'center'}>
            <Grid size={{ xs: 6 }}>
                <Typography variant='h6' fontWeight={'bold'}>템플릿 이름</Typography>
                <p style={{ margin: '0' }}><Typography variant='caption'>템플릿이란 특정 조건에 달성하면 특정 목소리로 동작하는 설정입니다.</Typography></p>
                <p style={{ margin: '0' }}><Typography variant='caption'>여러개의 템플릿으로 여러 상황을 지정할 수 있습니다.</Typography></p>
            </Grid>
            <Grid size={{ xs: 6 }} alignContent={'end'} textAlign={'right'}>
                <RightDiv>
                    <TextField
                        style={{ maxWidth: '200px' }}
                        size="small"
                        value={template.name}
                        onChange={(e) => templateChange('name', e.target.value)}
                        label="템플릿 이름"
                    />
                </RightDiv>
            </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: '1rem' }} alignItems={'center'}>
            <Grid size={{ xs: 6 }}>
                <Typography variant='h6' fontWeight={'bold'}>동작 방식</Typography>
                <p style={{ margin: '0' }}><Typography variant='caption'>스티커: 특정 스티커를 선물받았을 때만 동작합니다.</Typography></p>
                <p style={{ margin: '0' }}><Typography variant='caption'>임계치: 설정한 스푼 개수 이상의 스푼을 받았을 때 동작합니다.</Typography></p>
            </Grid>
            <Grid size={{ xs: 6 }} alignContent={'end'} textAlign={'right'}>
                <RightDiv>
                    <FormControl sx={{ minWidth: 200, textAlign: 'left' }} size="small">
                        <InputLabel id="use-type-label">방식 선택</InputLabel>
                        <Select
                            labelId="use-type-label"
                            id="use-type-select"
                            value={template.useType.toString()}
                            label="방식 선택"
                            onChange={(e: SelectChangeEvent) => templateChange('useType', parseInt(e.target.value))}
                        >
                            <MenuItem value={1}>스티커</MenuItem>
                            <MenuItem value={2}>임계치</MenuItem>
                        </Select>
                    </FormControl>
                </RightDiv>
            </Grid>
        </Grid>
        {
            template.useType === 1
            ? (
                <Grid container spacing={2} style={{ marginTop: '1rem' }} alignItems={'center'}>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant='h6' fontWeight={'bold'}>스푼 스티커</Typography>
                        <Typography variant='caption'>선택한 스푼을 선물받으면 동작합니다.</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }} alignContent={'end'} textAlign={'right'}>
                        <RightDiv>
                            <StickerDialogBtn sticker={template.sticker} onChange={(v: Sticker) => templateChange('sticker', v.name)}></StickerDialogBtn>
                        </RightDiv>
                    </Grid>
                </Grid>
            )
            : (
                <Grid container spacing={2} style={{ marginTop: '1rem' }} alignItems={'center'}>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant='h6' fontWeight={'bold'}>임계치 설정</Typography>
                        <Typography variant='caption'>해당 스푼 가격의 이상을 받으면 동작합니다.</Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }} alignContent={'end'} textAlign={'right'}>
                        <RightDiv>
                            <FormControl size="small" variant="outlined" style={{ minWidth: '200px' }}>
                                <OutlinedInput
                                    style={{ maxWidth: '200px' }}
                                    size="small"
                                    value={template.threshold}
                                    onChange={(e) => templateChange('threshold', +e.target.value)}
                                    label="스푼 개수"
                                    endAdornment={<InputAdornment position="end">개</InputAdornment>}
                                />
                            </FormControl>
                        </RightDiv>
                    </Grid>
                </Grid>
            )
        }
        <Grid container spacing={2} style={{ marginTop: '1rem' }} alignItems={'center'}>
            <Grid size={{ xs: 6 }}>
                <Typography variant='h6' fontWeight={'bold'}>목소리 볼륨</Typography>
                <p style={{ margin: '0' }}><Typography variant='caption'>목소리 재생 볼륨을 지정합니다.</Typography></p>
            </Grid>
            <Grid size={{ xs: 6 }} alignContent={'end'} textAlign={'right'}>
                <RightDiv>
                    <Grid container spacing={2} sx={{ alignItems: 'center', flex: '1', textAlign: 'right', justifyContent: 'right' }}>
                        <Grid>
                            {
                                template.volume
                                ? <VolumeUp />
                                : <VolumeOff />
                            }
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Slider
                                value={typeof template.volume === 'number' ? template.volume : 0}
                                onChange={(e, v) => templateChange('volume', v as number)}
                            />
                        </Grid>
                        <Grid>
                            <Input
                                value={template.volume ?? 0}
                                size="small"
                                onChange={(e) => templateChange('volume', +e.target.value)}
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                }}
                            />
                        </Grid>
                    </Grid>
                </RightDiv>
            </Grid>
        </Grid>
        <h3>목소리 선택</h3>
        <p style={{ margin: 0 }}>사용할 목소리에 체크하면, 체크된 목소리들 중 랜덤으로 재생됩니다.</p>
            {
                voices.map((voice: any) => <VoiceItem key={voice.voice_id} voice={voice} onChange={voiceToggle}></VoiceItem>)
            }
    </div>;
}