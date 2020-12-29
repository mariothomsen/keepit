import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { CloudIcon, UserIcon, TagMinusIcon, TagPlusIcon } from '../Icons'

export default function Tag({ onClick, tagValue, targetState }) {
  const stateIcon = targetState ? <TagPlusIcon /> : <TagMinusIcon />
  const bgColor = targetState
    ? 'var(--color-primary)'
    : 'var(--color-secondary)'

  function IsCustomIcon(test) {
    if (test.isCustom) {
      return <UserIcon />
    } else {
      return <CloudIcon />
    }
  }

  return (
    <StyledTag bgcolor={bgColor} onClick={() => onClick(tagValue, targetState)}>
      {tagValue}
    </StyledTag>
  )
}

const StyledTag = styled.span`
  background-color: ${(props) => props.bgcolor};
  display: inline-block;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;

  display: inline-flex;
  align-items: center;
  padding: 5px;
  margin: 0 7px 7px 0px;
  color: white;
  font-weight: 400;
  font-size: 13px;
  letter-spacing: 0.5px;
`