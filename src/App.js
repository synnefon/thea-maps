import { Routes, Route } from 'react-router-dom';
import NavBar from './nav/NavBar';
import { Map } from './map/Map';
import Homepage from './Homepage';

// App root.
export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/althea" element={<Map />} />
      </Routes>
    </div>
  )
}
