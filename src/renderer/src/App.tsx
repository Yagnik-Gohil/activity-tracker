import { Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { TaskList } from './pages/TaskList'
import { Dashboard } from './pages/Dashboard'
import { Toaster } from 'react-hot-toast'

export default function App(): JSX.Element {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: '#FFF',
              color: '#111827',
              border: '1px solid #111827'
            }
          },
          error: {
            style: {
              background: '#FFF',
              color: '#111827',
              border: '1px solid #111827'
            }
          }
        }}
      />
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:projectId" element={<TaskList />} />
        </Routes>
      </main>
    </div>
  )
}
