import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useQuery } from '@tanstack/react-query';

/*
효과음 추가

1. 효과음 선택
2. 효과음 볼륨
3. 효과음 스푼
4. 효과음 삭제
5. 효과음 편집ㄽㄹ
*/
export default function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ['getVoice'],
    queryFn: () => fetch('stp://donation.sopia.dev/voices').then((res) => res.json()),
  });

  if ( isPending ) return 'Lodaing...';

  if ( error ) return 'An error has occurred: ' + error.message;

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
              This is effect sound page.
          </Typography>
        </Box>
      </Container>
    </>
  );
}