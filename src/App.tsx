import { Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import { Home } from './pages/Home'
import { LostPlaces } from './pages/LostPlaces'
import { LocationPage } from './pages/LocationPage'
import { Wildlife } from './pages/Wildlife'
import { DataPage } from './pages/DataPage'
import { SourcesPage } from './pages/SourcesPage'
import { About } from './pages/About'
import { SearchPage } from './pages/SearchPage'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/lost-places" element={<LostPlaces />} />
        <Route path="/lost-places/:slug" element={<LocationPage />} />
        <Route path="/wildlife" element={<Wildlife />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
