import { SyntheticEvent, useState } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Tab, Tabs } from '@mui/material';
import { grey, purple } from '@mui/material/colors';
import LayersIcon from '@mui/icons-material/Layers';
import PersonIcon from '@mui/icons-material/Person';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'flex-start',
  marginTop: '1rem',
}));

const StyledTabs = styled(Tabs)({
  '& .MuiTab-root': {
    color: grey[400],
    '&.Mui-selected': {
      color: 'white',
    },
  },
  '.MuiTabs-indicator': {
    backgroundColor: 'white',
  }
});

const TabLabel = styled('div')({
  display: 'flex',
  alignItems: 'center',
})

export default function ProminentAppBar() {
  const [value, setValue] = useState(1);
  const navigate = useNavigate();

  const handleChange = (evt: SyntheticEvent, val: number) => {
    setValue(val);
    switch(val) {
      case 1:
        navigate('/');
        break;
      case 2:
        navigate('/signature');
        break;
      case 3:
        navigate('/effect');
        break;
      case 4:
        navigate('/settings');
        break;
    }
  }
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: purple[500] }}>
      <AppBar position="static">
        <StyledToolbar variant='dense'>
          <Typography
            variant="h5"
            component="div"
          >
            🔊 도네이션
          </Typography>
        </StyledToolbar>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <StyledTabs value={value} onChange={handleChange}>
          <Tab label={<TabLabel><LayersIcon/>템플릿</TabLabel>} value={1} />
          <Tab label={<TabLabel><PersonIcon/>시그니처</TabLabel>} value={2} />
          <Tab label={<TabLabel><AudiotrackIcon/>효과음</TabLabel>} value={3} />
          <Tab label={<TabLabel><SettingsIcon/>설정</TabLabel>} value={4} />
        </StyledTabs>
      </Box>
      </AppBar>
    </Box>
  );
}
