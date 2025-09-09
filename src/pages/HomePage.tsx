import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Typography } from '@mui/material'
import logo from '../assets/loginBg.png'
import bgImage from '../assets/bgHomeScreen.jpg'
import { useTheme } from '@mui/material/styles'

const HomePage = () => {
  const theme = useTheme()

  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
         sx={{
    bgcolor: 'rgba(255, 255, 255, 0.25)', // yarı saydam beyaz
    backdropFilter: 'blur(12px)',         // bulanıklık efekti
    WebkitBackdropFilter: 'blur(12px)',   // Safari desteği
    borderRadius: 3,
    boxShadow: '0 8px 20px #5DADE2',
    py: 6,
    textAlign: 'center',
    color: theme.palette.text.primary,
  }}
      >
        <Box
          component="img"
          src={logo}
          alt="Site Logo"
          sx={{ width: 150, height: 'auto', mb: 3, mx: 'auto' }}
        />

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', paddingBottom: 3, color: theme.palette.primary.main }}>
          Giriş Yap
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/admin')}
            sx={{

              borderColor: '#5DADE2',
              color: "#fff",
              fontWeight: 'bold',
              px: 6,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#0797e5ff',
                borderColor: '#fff',
                color: '#fff',
              },
              minWidth: 140,
            }}
          >
            Admin Girişi
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate('/user-login')}
            sx={{
              borderColor: '#5DADE2',
              color: "#fff",
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              '&:hover': {
               backgroundColor: '#0797e5ff',
                borderColor: '#fff',
                color: '#fff',
              },
              minWidth: 140,
            }}
          >
            Kullanıcı Girişi
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default HomePage
