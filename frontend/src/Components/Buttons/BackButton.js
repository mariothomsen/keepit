import { useHistory } from 'react-router-dom'
import { BackIcon } from '../Icons'

export default function BackButton({ onClick, buttonText }) {
  function handleOnClick() {
    history.goBack()
  }
  const history = useHistory()
  return <BackIcon></BackIcon>
}
