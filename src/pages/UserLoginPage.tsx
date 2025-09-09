import { useEffect, useState } from 'react'
import {
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  InputLabel,
  FormControl,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { fetchUsers } from '../services/users'
import type { User } from '../types/user'
import HomeIcon from '@mui/icons-material/Home' // ✅ İKON EKLENDİ
import { useTheme } from '@mui/material/styles' // ✅ EKLENDİ


const UserLoginPage = () => {
  const theme = useTheme() // ✅ EKLENDİ

  const navigate = useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('users')
    if (stored) {
      setUsers(JSON.parse(stored))
    } else {
      const loadUsers = async () => {
        const data = await fetchUsers()
        setUsers(data)
        localStorage.setItem('users', JSON.stringify(data))
      }
      loadUsers()
    }
  }, [])

  const handleLogin = () => {
    if (!selectedUserId) return
    const loggedInUser = users.find(user => user.id === Number(selectedUserId))
    if (loggedInUser) {
      localStorage.setItem('activeUser', JSON.stringify(loggedInUser))
      navigate(`/user/${loggedInUser.id}`)
    }
  }

  const handleCreateUser = () => {
    if (!name || !username || !email) return

    const newUser: User = {
      id: users.length + 1,
      name,
      username,
      email
    }

    const updatedUsers = [newUser, ...users]
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    localStorage.setItem('activeUser', JSON.stringify(newUser))

    navigate(`/user/${newUser.id}`)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      {/* ✅ Ana Sayfa Butonu */}
      <Button
        onClick={() => navigate('/')}
        sx={{
          border: `2px solid ${theme.palette.primary.main}`,
          position: 'fixed',
          top: 16,
          left: 16,
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          zIndex: 1000,
          '&:hover': {
            bgcolor: '#5DADE2',
            color: theme.palette.text.primary,
          },
          px: { xs: 1, sm: 2 },
          minWidth: { xs: 'unset', sm: 'auto' },
        }}
      >
        <HomeIcon />
      </Button>

      <Container
        maxWidth={"sm"}
        sx={{
          bgcolor: theme.palette.background.default,
          boxShadow: '0 8px 20px #5DADE2',
          borderRadius: 3,
          p: { xs: 3, sm: 5 },
          color: theme.palette.primary.main,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Typography
          variant="h4" fontWeight="bold" align="center" gutterBottom>
          Kullanıcı Girişi
        </Typography>

        {/* Var Olan Kullanıcıyla Giriş */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Var Olan Kullanıcıyla Giriş Yap
          </Typography>

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel size='small' sx={{ color: '#5DADE2' }}>
              Kullanıcı Seç
            </InputLabel>
            <Select
              labelId="user-select-label"
              value={selectedUserId}
              label="Kullanıcı Seç"
              onChange={(e) => setSelectedUserId(e.target.value)}
              size="small"
              sx={{
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiSvgIcon-root': { color: theme.palette.primary.main },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <MenuItem sx={{ color: theme.palette.primary.main, backgroundColor: theme.palette.background.default }} value="">Seçim yapınız</MenuItem>
              {users.map((user) => (
                <MenuItem sx={{ color: theme.palette.primary.main, backgroundColor: theme.palette.background.default }} key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.text.primary,
              fontWeight: 'bold',
              '&:hover': { bgcolor: theme.palette.primary.main },
            }}
            onClick={handleLogin}
          >
            Giriş Yap
          </Button>
        </Box>

        <Divider sx={{ bgcolor: '#555' }} />

        {/* Yeni Kullanıcı Oluştur */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Yeni Kullanıcı Oluştur
          </Typography>

          <TextField
            label="İsim"
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              mb: 2,
              input: { color: '#fff', py: 1 },
              '& label': { color: theme.palette.primary.main },
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.background.default,
                height: 45,
                '& fieldset': { borderColor: theme.palette.primary.main },
                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
              },
            }}
          />
          <TextField
            label="Kullanıcı Adı"
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              mb: 2,
              input: { color: '#fff', py: 1 },
              '& label': { color: theme.palette.primary.main },
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.background.default,
                height: 45,
                '& fieldset': { borderColor: '#5DADE2' },
                '&:hover fieldset': { borderColor: '#5DADE2' },
                '&.Mui-focused fieldset': { borderColor: '#5DADE2' },
              },
            }}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 3,
              input: { color: theme.palette.text.primary, py: 1 },
              '& label': { color: theme.palette.primary.main },
              '& .MuiOutlinedInput-root': {
                bgcolor: theme.palette.background.default,
                height: 45,
                '& fieldset': { borderColor: '#5DADE2' },
                '&:hover fieldset': { borderColor: '#5DADE2' },
                '&.Mui-focused fieldset': { borderColor: '#5DADE2' },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.text.primary,
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#5DADE2' },
            }}
            onClick={handleCreateUser}
          >
            Kullanıcı Oluştur
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default UserLoginPage
