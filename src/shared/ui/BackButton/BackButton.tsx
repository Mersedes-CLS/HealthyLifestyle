import { useNavigate } from 'react-router-dom'
import './BackButton.css'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <button className="back-button" onClick={() => navigate('/')}>
      <span className="back-button__arrow">&#8592;</span>
      <span className="back-button__text">Back</span>
    </button>
  )
}
