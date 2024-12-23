import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useQuery } from '@tanstack/react-query';

/*
1. 채팅 입력 대기 시간
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