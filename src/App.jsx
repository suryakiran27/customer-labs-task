import { useState } from 'react'
import './App.css'
import SegmentComponent from './components/segment'
function App() {
  const [openSegment, setOpenSegment] = useState(false);

  const segmentHandler = () => {
    setOpenSegment(true);
  }

  return (
    <div className='main-container'>
      <nav>
        <p className='text-lg font-semibold'>View Audience</p>
      </nav>
      <section className='audience-container'>
        <button className='segment-btn ' onClick={segmentHandler}>Save Segment</button>
        
        <SegmentComponent openSegment={openSegment} setOpenSegment={setOpenSegment} />
      </section>
    </div>
  )
}

export default App
