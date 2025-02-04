import { useCallback, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useQuery } from '@tanstack/react-query';
import { Button, IconButton, List, ListItem, ListItemText, Slider, Stack, Tooltip } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight, QuestionMark, VolumeUp } from '@mui/icons-material';
import styled from '@emotion/styled';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Player from '../components/audio-player/index';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ListItemButton = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '0.3rem',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#f5f5f5',
  },
})

/*
효과음 추가

1. 효과음 선택
2. 효과음 볼륨
3. 효과음 스푼
4. 효과음 삭제
5. 효과음 편집ㄽㄹ
*/
async function base64ToBlob(b64data: string) {
  return fetch(b64data).then((res) => res.blob());
}
function blobToBase64(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const res = await fetch(url);
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    }
    reader.readAsDataURL(await res.blob());
  });
}
export default function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ['getEffect'],
    queryFn: () => fetch('stp://donation.sopia.dev/effect').then((res) => res.json()),
  });
  const [ isOpending, setOpending ] = useState(false);
  const [ defaultEffect, setDefaultEffect ] = useState<any>({});
  const [ effectList, setEffectList ] = useState<any[]>([]);

  useEffect(() => {
    if ( Array.isArray(data) ) {
      (async () => {
        const _effectList = [];
        for ( const effect of data ) {
          const dataurl = `data:${effect.mimeType};base64,${effect.base64}`;
          const blob = await base64ToBlob(dataurl);
          effect.blob = blob;
          if ( effect.sticker === '_sopia_def_sticker' ) {
            setDefaultEffect(effect);
          } else {
            _effectList.push(effect);
          }
        }
        setEffectList(_effectList);
      })();
    }
  }, [data]);

  if ( isPending ) return 'Lodaing...';

  if ( error ) return 'An error has occurred: ' + error.message;

  async function handleEffectChange(sticker: string, file: File, volume: number) {
    const fileName = file.name;
    let b64 = await blobToBase64(URL.createObjectURL(file));
    const mimeType = b64.split(';')[0].split(':')[1];
    b64 = b64.split(',')[1];
    fetch('stp://donation.sopia.dev/effect', {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sticker,
        soundName: fileName,
        mimeType,
        base64: b64,
        volume: volume,
      }),
    }).then((res) => res.json())
  }

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <List>
            <ListItem>
              <div style={{ width: '100%' }}>
                <ListItemButton onClick={() => setOpending(!isOpending)}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {
                      isOpending ? <KeyboardArrowDown /> : <KeyboardArrowRight />
                    }
                    기본 효과음
                  </div>
                  <Tooltip title="설정되지 않은 스푼에 대해 재생되는 효과음입니다.">
                    <IconButton style={{ marginLeft: 6, fontSize: '17px', color: 'gray' }} size='small' onClick={(e) => { e.stopPropagation(); }}>
                      <QuestionMark/>
                    </IconButton> 
                  </Tooltip>
                </ListItemButton>
                {
                  isOpending &&
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Player
                      audioName={defaultEffect?.soundName}
                      selectedAudioBlob={defaultEffect?.blob}
                      onChange={(file, volume) => handleEffectChange('_sopia_def_sticker', file, volume)}
                      volume={defaultEffect?.volume}
                    />
                  </div>
                }
              </div>
            </ListItem>
            <ListItem>
              asdf
            </ListItem>
            <ListItem>
              asdf
            </ListItem>
          </List>
        </Box>
      </Container>
    </>
  );
}