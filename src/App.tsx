import { useState, useEffect } from 'react'
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged } from './lib/auth'
import type { User } from './lib/auth'
import { addNailItem, updateNailItem, deleteNailItem, fetchNailItems } from './lib/firestore'
import type { NailItemDoc } from './lib/firestore'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [nailItems, setNailItems] = useState<NailItemDoc[]>([])
  const [nailTitle, setNailTitle] = useState('')
  const [nailTags, setNailTags] = useState('')
  const [nailImageUrl, setNailImageUrl] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nailLoading, setNailLoading] = useState(false)
  const [nailError, setNailError] = useState('')

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  useEffect(() => {
    if (!user) { setNailItems([]); return }
    fetchNailItems(user.uid)
      .then(setNailItems)
      .catch((e: unknown) => console.error('fetch failed', e))
  }, [user])

  const parseTags = (s: string): string[] =>
    s.split(',').map(t => t.trim()).filter(Boolean)

  const resetForm = () => {
    setNailTitle('')
    setNailTags('')
    setNailImageUrl('')
    setEditingId(null)
    setNailError('')
  }

  const handleSubmitNailItem = () => {
    if (!user || nailTitle.trim() === '') return
    const uid = user.uid
    setNailLoading(true)
    setNailError('')
    const input = { title: nailTitle.trim(), imageUrl: nailImageUrl.trim(), tags: parseTags(nailTags), memo: '' }
    const op: Promise<void> = editingId
      ? updateNailItem(uid, editingId, input)
      : addNailItem(uid, input).then(() => {})
    op
      .then(() => fetchNailItems(uid))
      .then(items => { setNailItems(items); resetForm() })
      .catch((e: unknown) => setNailError(String(e)))
      .finally(() => setNailLoading(false))
  }

  const handleStartEdit = (item: NailItemDoc) => {
    setEditingId(item.id)
    setNailTitle(item.title)
    setNailTags(item.tags.join(', '))
    setNailImageUrl(item.imageUrl)
    setNailError('')
  }

  const handleDeleteNailItem = (itemId: string) => {
    if (!user) return
    const uid = user.uid
    if (editingId === itemId) resetForm()
    setNailLoading(true)
    setNailError('')
    deleteNailItem(uid, itemId)
      .then(() => fetchNailItems(uid))
      .then(setNailItems)
      .catch((e: unknown) => setNailError(String(e)))
      .finally(() => setNailLoading(false))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false }
      ])
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      handleAddTodo()
    }
  }

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <>
      <section id="center">
        <div id="auth-bar">
          {user === undefined ? null : user ? (
            <div className="auth-user">
              <span>{user.displayName ?? user.email}</span>
              <button type="button" onClick={() => {
                signOutUser().catch((e: unknown) => console.error('sign-out failed', e))
              }}>Sign out</button>
            </div>
          ) : (
            <button type="button" className="auth-signin" onClick={() => {
              signInWithGoogle().catch((e: unknown) => console.error('sign-in failed', e))
            }}>
              Sign in with Google
            </button>
          )}
        </div>
        {user && (
          <div id="nail-section">
            <h2>My Nail Items</h2>
            <div id="nail-form">
              <input
                type="text"
                value={nailTitle}
                onChange={e => setNailTitle(e.target.value)}
                placeholder="Title *"
                className="nail-input"
              />
              <input
                type="text"
                value={nailTags}
                onChange={e => setNailTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="nail-input"
              />
              <input
                type="text"
                value={nailImageUrl}
                onChange={e => setNailImageUrl(e.target.value)}
                placeholder="Image URL (optional)"
                className="nail-input"
              />
              <div className="nail-form-actions">
                <button
                  type="button"
                  onClick={handleSubmitNailItem}
                  disabled={nailLoading || nailTitle.trim() === ''}
                >
                  {nailLoading ? 'Saving...' : editingId ? 'Update' : 'Add NailItem'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} disabled={nailLoading}>
                    Cancel
                  </button>
                )}
              </div>
              {nailError && <p className="nail-error">{nailError}</p>}
            </div>
            {nailItems.length === 0 ? (
              <p className="nail-empty">No nail items yet.</p>
            ) : (
              <ul id="nail-list">
                {nailItems.map(item => (
                  <li key={item.id} className={editingId === item.id ? 'editing' : ''}>
                    <div className="nail-item-info">
                      <span className="nail-item-title">{item.title}</span>
                      {item.tags.length > 0 && (
                        <span className="nail-item-tags">
                          {item.tags.map(t => '#' + t).join(' ')}
                        </span>
                      )}
                    </div>
                    <div className="nail-item-actions">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        disabled={nailLoading}
                      >Edit</button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNailItem(item.id)}
                        disabled={nailLoading}
                      >Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button onClick={handleAddTodo} className="add-button">Add</button>
        <ul id="todo-list">
  {todos.map((todo) => (
    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
      <span
        className="todo-text"
        onClick={() => handleToggleComplete(todo.id)}
      >
        {todo.text}
      </span>
      <button type="button" onClick={() => handleDeleteTodo(todo.id)}>
        Delete
      </button>
    </li>
  ))}
</ul>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
