import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Tooltip,
  Button
} from '@mui/material'

import SendIcon from '@mui/icons-material/Send'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import HomeIcon from '@mui/icons-material/Home'

import { fetchPosts } from '../services/posts'
import { fetchUsers } from '../services/users'
import type { Post } from '../types/post'
import type { User } from '../types/user'

interface PostsPageProps {
  isAdmin?: boolean
}

const PostsPage = ({ isAdmin = false }: PostsPageProps) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()

  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [selectedUserIdForPost, setSelectedUserIdForPost] = useState<number | null>(null)

  const currentUserId = isAdmin ? null : Number(userId)

  useEffect(() => {
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    } else {
      fetchUsers().then(data => {
        setUsers(data)
        localStorage.setItem('users', JSON.stringify(data))
      })
    }
  }, [])

  useEffect(() => {
    const storedPosts = localStorage.getItem('posts')
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
      setLoading(false)
    } else {
      fetchPosts()
        .then(data => {
          const sliced = data.slice(0, 30)
          setPosts(sliced)
          localStorage.setItem('posts', JSON.stringify(sliced))
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('posts', JSON.stringify(posts))
    }
  }, [posts, loading])

  const handleAddPost = () => {
    const userIdForPost = isAdmin ? selectedUserIdForPost : currentUserId
    if (!newTitle.trim() || !userIdForPost) return

    const newPost: Post = {
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      userId: userIdForPost,
      title: newTitle.trim()
    }

    setPosts(prev => [newPost, ...prev])
    setNewTitle('')
    if (isAdmin) setSelectedUserIdForPost(null)
  }

  const handleDeletePost = (id: number) => {
    setPosts(prev => prev.filter(post => post.id !== id))
  }

  const startEditing = (post: Post) => {
    setEditingPostId(post.id)
    setEditingTitle(post.title)
  }

  const handleSaveEdit = () => {
    if (editingPostId === null) return
    setPosts(prev =>
      prev.map(post =>
        post.id === editingPostId ? { ...post, title: editingTitle } : post
      )
    )
    setEditingPostId(null)
    setEditingTitle('')
  }

  if (loading) {
    return (
      <Box sx={{ padding: 4, color: '#fff', textAlign: 'center' }}>
        Yükleniyor...
      </Box>
    )
  }

  const visiblePosts = posts

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default, py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 4 }}>
          {isAdmin ? 'Postlar' : 'Kullanıcı Postları'}
        </Typography>

        {(isAdmin || currentUserId) && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 3,
              alignItems: 'stretch'
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Button
                onClick={() => navigate('/')}
                sx={{
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.primary.main,
                  border: `1px solid ${theme.palette.primary.main}`,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: '#5DADE2',
                    color: '#fff',
                  },
                  width: '100%',
                }}
              >
                <HomeIcon />
              </Button>
            </Box>

            {isAdmin && (
              <Box sx={{ width: { xs: '100%',md:'50%', sm: '50%' } }}>
                <FormControl size="small" fullWidth>
                  <InputLabel sx={{ color: '#5DADE2' }}>Kullanıcı Seç</InputLabel>
                  <Select
                    value={selectedUserIdForPost ?? ''}
                    onChange={(e) => setSelectedUserIdForPost(Number(e.target.value))}
                    label="Kullanıcı Seç"
                    fullWidth
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      color: theme.palette.primary.main,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5DADE2',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5DADE2',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5DADE2',
                      }
                    }}
                  >
                    {users.map(user => (
                      <MenuItem sx={{backgroundColor: theme.palette.background.default,
                      color: theme.palette.primary.main}} key={user.id} value={user.id}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                size="small"
                label="Yeni Post Başlığı"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                variant="outlined"
                sx={{
                  input: { color: theme.palette.text.primary },
                  '& .MuiInputLabel-root': { color: '#5DADE2' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    backgroundColor: theme.palette.background.default,
                    '& fieldset': {
                      borderColor: '#5DADE2'
                    },
                    '&:hover fieldset': {
                      borderColor: '#5DADE2'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#5DADE2'
                    }
                  }
                }}
              />
            </Box>

            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Tooltip title="Paylaş">
                <IconButton
                  onClick={handleAddPost}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.primary.main,
                    height: '40px',
                    width: '100%',
                    border: `1px solid ${theme.palette.primary.main}`,
                    '&:hover': { bgcolor: '#5DADE2', color: '#fff' },
                    borderRadius: 1,
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.default }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Kullanıcı</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Başlık</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visiblePosts.map(post => {
                const postOwner = users.find(user => user.id === post.userId)
                const isOwner = post.userId === currentUserId
                const canEdit = isAdmin || isOwner

                return (
                  <TableRow key={post.id}>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{post.id}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{postOwner?.username || 'Bilinmeyen'}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>
                      {editingPostId === post.id && canEdit ? (
                        <TextField
                          size="small"
                          value={editingTitle}
                          onChange={e => setEditingTitle(e.target.value)}
                          sx={{
                            input: { color: theme.palette.text.primary },
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: theme.palette.background.paper,
                              '& fieldset': {
                                borderColor: '#5DADE2'
                              },
                              '&:hover fieldset': {
                                borderColor: '#5DADE2'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#5DADE2'
                              }
                            }
                          }}
                        />
                      ) : (
                        post.title
                      )}
                    </TableCell>
                    <TableCell>
                      {canEdit ? (
                        editingPostId === post.id ? (
                          <>
                            <Tooltip title="Kaydet">
                              <IconButton onClick={handleSaveEdit} size="small" sx={{ color: '#5DADE2' }}>
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="İptal">
                              <IconButton onClick={() => setEditingPostId(null)} size="small" sx={{ color: '#aaa' }}>
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Düzenle">
                              <IconButton onClick={() => startEditing(post)} size="small" sx={{ color: '#5DADE2' }}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Sil">
                              <IconButton onClick={() => handleDeletePost(post.id)} size="small" sx={{ color: '#f44336' }}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )
                      ) : (
                        <em style={{ color: '#888' }}>Düzenleme Yetkiniz Yok</em>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  )
}

export default PostsPage
