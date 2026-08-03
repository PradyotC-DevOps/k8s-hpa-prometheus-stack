// src/App.jsx
import { useState, useRef, useEffect } from 'react'

function App() {
  const [isSpamming, setIsSpamming] = useState(false)
  const [requestsSent, setRequestsSent] = useState(0)
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const intervalRef = useRef(null)

  // Keep a running clock for Grafana correlation
  useEffect(() => {
    const clock = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(clock)
  }, [])

  const toggleLoad = () => {
    if (isSpamming) {
      clearInterval(intervalRef.current)
      setIsSpamming(false)
    } else {
      setIsSpamming(true)
      // Fire 20 requests every 500ms (approx 40 requests per second)
      // Browsers have connection limits, so we batch them.
      intervalRef.current = setInterval(() => {
        for (let i = 0; i < 20; i++) {
          fetch('/api/ping').catch(() => { })
          setRequestsSent(prev => prev + 1)
        }
      }, 500)
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>DevOps HPA Load Tester</h1>
      <h2>Current Time: {time}</h2>
      <p>Total Requests Sent: <strong>{requestsSent}</strong></p>

      <button
        onClick={toggleLoad}
        style={{
          padding: '15px 30px', fontSize: '1.2rem',
          backgroundColor: isSpamming ? '#ff4757' : '#2ed573',
          color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}
      >
        {isSpamming ? '🛑 STOP Load Test' : '🚀 START Load Test (40 Req/Sec)'}
      </button>
      <p style={{ marginTop: '20px', color: '#666' }}>
        Check Grafana and run <code>kubectl get hpa -w</code> to watch the cluster scale!
      </p>
    </div>
  )
}
export default App