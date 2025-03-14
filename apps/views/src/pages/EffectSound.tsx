import { useCallback, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useQuery } from '@tanstack/react-query';
import { Button, IconButton, List, ListItem, ListItemText, Slider, Snackbar, Stack, Tooltip } from '@mui/material';
import { Close, KeyboardArrowDown, KeyboardArrowRight, QuestionMark, VolumeUp } from '@mui/icons-material';
import styled from '@emotion/styled';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Player from '../components/audio-player/index';
import axios from 'axios';
import { Sticker } from '@sopia-bot/core';
import { StickerDialog, useStickerStore, findSticker } from '../components/StickerDialog';

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
});

const NewItemButton = styled(ListItem)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1.3rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  border: '1px solid #e0e0e0',
  borderWidth: '0.5px',
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
  const [ stickerDialogOpen, setStickerDialogOpen ] = useState(false);
  const [ selectedSticker, setSelectedSticker ] = useState<Sticker|null>(null);
  const { stickerList, isInit } = useStickerStore((state) => state);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const snackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if ( isInit && Array.isArray(data) ) {
      (async () => {
        const _effectList = [];
        for ( const effect of data ) {
          const dataurl = `data:${effect.mimeType};base64,${effect.base64}`;
          const blob = await base64ToBlob(dataurl);
          effect.blob = blob;
          effect.isOpending = false;
          if ( effect.sticker === '_sopia_def_sticker' ) {
            setDefaultEffect(effect);
          } else {
            if ( isInit ) {
              const s = findSticker(stickerList, effect.sticker);
              if ( s ) {
                effect.stickerData = s;
              }
            }
            _effectList.push(effect);
          }
        }
        setEffectList(_effectList);
      })();
    }
  }, [data, isInit]);



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
    .then(async (res) => {
      if ( res.success ) {
        if ( sticker === '_sopia_def_sticker' ) {
          const effect = structuredClone(defaultEffect);
          effect.blob = file as Blob;
          setDefaultEffect(effect);
          console.log('i want reload');
        } else {
          const newEffectList = structuredClone(effectList);
          const newEffect = newEffectList.find((e) => e.sticker === sticker);
          newEffect.blob = file as Blob;
          setEffectList(newEffectList);
        }
      }
    })
  }

  const onStickerSelect = (sticker: Sticker) => {
    console.log("🚀 ~ onStickerSelect ~ sticker:", sticker)
    const newEffectList = structuredClone(effectList);

    if ( !!newEffectList.find((e) => e.sticker === sticker.name) ) {
      setSnackbarMessage('이미 설정된 스티커입니다.');
      setSnackbarOpen(true);
      return;
    }

    newEffectList.push({
      sticker: sticker.name,
      stickerData: findSticker(stickerList, sticker.name),
      volume: 50,
      isOpending: false,
    });
    setEffectList(newEffectList);
  };

  const toggleEffect = (effect: typeof effectList[0]) => {
    const newEffectList = structuredClone(effectList);
    const newEffect = newEffectList.find((e) => e.sticker = effect.sticker);
    console.log('new', newEffectList, 'e', effect);
    newEffect.isOpending = !effect.isOpending;
    setEffectList(newEffectList);
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
                  <div style={{ marginLeft: 'auto' }}>
                    {defaultEffect?.soundName}
                  </div>
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
            {
              Array.isArray(effectList) && effectList.map((effect) => <ListItem key={`listitem:${effect.id}:${effect.sticker}`}>
              <div style={{ width: '100%' }}>
                <ListItemButton onClick={() => toggleEffect(effect)}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {
                      effect.isOpending ? <KeyboardArrowDown /> : <KeyboardArrowRight />
                    }
                    <img src={effect.stickerData?.image_url_web} height={50}/>
                    {effect.stickerData?.price} 스푼
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    {effect?.soundName}
                  </div>
                </ListItemButton>
                {
                  effect.isOpending &&
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Player
                      audioName={effect?.soundName}
                      selectedAudioBlob={effect?.blob}
                      onChange={(file, volume) => handleEffectChange(effect.sticker, file, volume)}
                      volume={effect?.volume}
                    />
                  </div>
                }
              </div>
            </ListItem>)
            }
            <NewItemButton onClick={() => setStickerDialogOpen(true)}>
              + 새 효과음 추가하기
            </NewItemButton>
            <ListItem>
              asdf
            </ListItem>
          </List>
        </Box>
      </Container>
      <StickerDialog
        open={stickerDialogOpen}
        sticker={selectedSticker}
        onChange={onStickerSelect}
        onClose={() => setStickerDialogOpen(false)}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={snackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        message={snackbarMessage}
        action={<>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={snackbarClose}
          >
            <Close fontSize="small" />
          </IconButton>
        </>}
      />
    </>
  );
}