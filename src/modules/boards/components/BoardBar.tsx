import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import { Board } from '../types/board'
import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

interface BoardBarProps {
  board?: Board
}

function BoardBar({ board }: BoardBarProps) {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={board?.title}
          onClick={() => { }}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type || '')}
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          onClick={() => { }}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          onClick={() => { }}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          onClick={() => { }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}

        >
          <Tooltip title="Minhtri94">
            <Avatar
              alt="Minhtri94"
              src="https://i.pinimg.com/736x/80/4d/73/804d73986dee8ae72e7480b56c95ca66.jpg" />
          </Tooltip>
          <Tooltip title="Minhtri94">
            <Avatar
              alt="Minhtri94"
              src="https://assets.goal.com/images/v3/blte301dc4690b11599/kvaratskhelia_napoli_(1).jpg" />
          </Tooltip>
          <Tooltip title="Minhtri94">
            <Avatar
              alt="Minhtri94"
              src="https://cdn.tuoitre.vn/471584752817336320/2023/2/14/thoi-the-thay-doi-mbappe-ra-dieu-kien-cuc-kho-de-o-lai-psg-236322-2045-1676347173240951828485.jpg" />
          </Tooltip>
          <Tooltip title="Minhtri94">
            <Avatar
              alt="Minhtri94"
              src="https://forbes.vn/wp-content/uploads/2023/08/Neymar.webp" />
          </Tooltip>
          <Tooltip title="Minhtri94">
            <Avatar
              alt="Minhtri94"
              src="https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c807855c614f111e51cb97783499b12d0fa14cd8645bb7a208f346b3adc1b2c8cbcc481ef806ec8a2c7c0904f3d1d9cd035dcd/ronaldo-the-ky-21-1-5129.jpg" />
          </Tooltip>
          <Tooltip title="Minhtri94">
            <Avatar
              alt="Minhtri94"
              src="https://assets.goal.com/images/v3/blt2aaca933046f8b00/Cristiano%20Ronaldo%20Portugal%202024%20(4).jpg?auto=webp&format=pjpg&width=3840&quality=60" />
          </Tooltip>
          <Tooltip title="Minhtri94">
            <Avatar
              alt="Minhtri94"
              src="https://assets.goal.com/images/v3/blt77a560c322c4981d/Cristiano%20Ronaldo%20Al%20Nassr%202025%20(3).jpg?auto=webp&format=pjpg&width=3840&quality=60" />
          </Tooltip>
          <Tooltip title="Minhtri94">
            <Avatar
              alt="Minhtri94"
              src="https://i.pinimg.com/736x/80/4d/73/804d73986dee8ae72e7480b56c95ca66.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
