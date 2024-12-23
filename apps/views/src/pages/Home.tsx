import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Grid2 as Grid, List, Snackbar } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Template } from '../types/template';
import TemplateItem from '../components/TemplateItem';
import TemplateSetting from '../components/TemplateSetting';
import styled from '@emotion/styled';

const LeftPanel = styled(Grid)(({ theme }) => ({
  background: '#fcfcfc'
}));

const GridContainer = styled(Grid)(() => ({
  height: 'calc(100vh - 113px)',
  maxHeight: 'calc(100vh - 113px)',
}));

export default function App() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { isPending, error, data } = useQuery({
    queryKey: ['getVoice'],
    queryFn: () => fetch('stp://donation.sopia.dev/voices').then((res) => res.json()),
  });
  const [templateList, setTemplateList] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template|null>(null);
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
    } else {
      setOpen(true);
    }
  }

  async function onTemplateSelected(template: Template) {
    console.log('template', template);
    setCurrentTemplate(template);
  }

  async function onTemplateRemove(template: Template) {
    console.log('template', template);
    const res = await fetch('stp://donation.sopia.dev/template', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid: template.uuid,
      }),
    }).then((res) => res.json());
    if ( res.success ) {
      setCurrentTemplate(null);
      queryClient.invalidateQueries({ queryKey: ['getTemplateList']});
    }
  }

  const handleClose = () => {
    setOpen(false);
  }

  const templateChange = (template: Template) => {
    const cloneTemp = Object.assign({}, template);
    fetch('stp://donation.sopia.dev/template', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cloneTemp),
    }).then((res) => res.json()).then((res) => {
      if ( res.success ) {
        queryClient.invalidateQueries({ queryKey: ['getTemplateList']});
      }
    });
  }

  return (
    <Box>
      <Box>
        {/* enabled */}
        <GridContainer container spacing={2}>
          <LeftPanel size={{ xs: 6, sm: 5, md: 4, lg: 3, xl: 2 }}>
            <div style={{ padding: '1rem', }}>
              <Typography variant='h6' fontWeight={'bold'}>템플릿</Typography>
              <Typography variant='caption'>어떤 스티커를 받느냐에 따라 어떤 목소리를 사용할지 설정합니다.</Typography>
            </div>
            <div style={{ padding: '0 1rem' }}>
              <Button fullWidth variant="outlined" color='grey' onClick={newTemplate}>
                <Add/>
              </Button>
            </div>
            
            <List>
            {
              templateList.map((template, i) => <TemplateItem
                key={template.uuid + ':' + i}
                template={template}
                isSelect={currentTemplate?.uuid === template.uuid}
                onSelected={onTemplateSelected}
                onRemove={onTemplateRemove}
              />)
            }
            </List>
          </LeftPanel>
          <Grid flex={1}>
            {
              currentTemplate && <TemplateSetting template={currentTemplate} onChange={templateChange}></TemplateSetting>
            }
          </Grid>
        </GridContainer>
      </Box>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          오류가 발생했습니다.
        </Alert>
      </Snackbar>
    </Box>
  );
}