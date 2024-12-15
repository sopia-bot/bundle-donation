import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Grid2 as Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Template } from '../types/template';
import TemplateItem from '../components/TemplateItem';

export default function App() {
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ['getVoice'],
    queryFn: () => fetch('stp://donation.sopia.dev/voices').then((res) => res.json()),
  });
  const [templateList, setTemplateList] = useState<Template[]>([]);
  const { isSuccess: templateListSuccess, data: templateListData } = useQuery({
    queryKey: ['getTemplateList'],
    queryFn: () => fetch('stp://donation.sopia.dev/templates').then((res) => res.json()),
  });

  useEffect(() => {
    if ( templateListSuccess ) {
      setTemplateList(templateListData);
    }
  }, [templateListData]);

  if ( isPending ) return 'Lodaing...';

  if ( error ) return 'An error has occurred: ' + error.message;

  async function newTemplate() {

    const res = await fetch('stp://donation.sopia.dev/template', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '새로운 템플릿',
      }),
    }).then((res) => res.json());
    if ( res.success ) {
      queryClient.invalidateQueries({ queryKey: ['getTemplateList']});
    }
  }

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {/* enabled */}
          <Grid container spacing={2} style={{ marginTop: '1rem' }} alignItems={'center'}>
            <Grid size={6}>
              <Typography variant='h6' fontWeight={'bold'}>템플릿</Typography>
              <Typography variant='caption'>어떤 스티커를 받느냐에 따라 어떤 목소리를 사용할지 설정합니다.</Typography>
              <div style={{ marginTop: '1rem' }}/>
              <Button fullWidth variant="outlined" onClick={newTemplate}>
                <Add/>
              </Button>
              {
                templateList.map((template, i) => <TemplateItem key={template.uuid + ':' + i} template={template} />)
              }
            </Grid>
            <Grid size={6} style={{ textAlign: 'right' }}>
              {/* <Switch checked={data.enabled} onChange={(e) => setDataProp('enabled', e.target.checked)}></Switch> */}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}