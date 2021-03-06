import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useMediaLayout } from 'use-media'

import { X } from 'react-feather'
import { PopupContent } from '../../state/application/actions'
import { useActivePopups, useRemovePopup } from '../../state/application/hooks'
import { AutoColumn } from '../Column'
import TxnPopup from '../TxnPopup'

const StyledClose = styled(X)`
  position: absolute;
  right: 10px;
  top: 10px;

  :hover {
    cursor: pointer;
  }
`

const MobilePopupWrapper = styled.div<{ height: string | number }>`
  position: relative;
  max-width: 100%;
  height: ${({ height }) => height};
  margin: ${({ height }) => (height ? '0 auto;' : 0)};
  margin-bottom: ${({ height }) => (height ? '20px' : 0)}};
`

const MobilePopupInner = styled.div`
  height: 99%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`

const FixedPopupColumn = styled(AutoColumn)`
  position: absolute;
  top: 112px;
  right: 1rem;
  max-width: 355px !important;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const Popup = styled.div`
  display: inline-block;
  width: 100%;
  padding: 1em;
  background-color: ${({ theme }) => theme.bg1};
  position: relative;
  border-radius: 10px;
  padding: 20px;
  padding-right: 35px;
  z-index: 2;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 290px;
  `}
`

function PopupItem({ content, popKey }: { content: PopupContent; popKey: string }) {
  if ('txn' in content) {
    const {
      txn: { hash, success, summary }
    } = content
    return <TxnPopup popKey={popKey} hash={hash} success={success} summary={summary} />
  }
}

export default function Popups() {
  const theme = useContext(ThemeContext)
  // get all popups
  const activePopups = useActivePopups()
  const removePopup = useRemovePopup()

  // switch view settings on mobile
  const isMobile = useMediaLayout({ maxWidth: '600px' })

  if (!isMobile) {
    return (
      <FixedPopupColumn gap="20px">
        {activePopups.map(item => {
          return (
            <Popup key={item.key}>
              <StyledClose color={theme.text2} onClick={() => removePopup(item.key)} />
              <PopupItem content={item.content} popKey={item.key} />
            </Popup>
          )
        })}
      </FixedPopupColumn>
    )
  }
  //mobile
  else
    return (
      <MobilePopupWrapper height={activePopups?.length > 0 ? 'fit-content' : 0}>
        <MobilePopupInner>
          {activePopups // reverse so new items up front
            .slice(0)
            .reverse()
            .map(item => {
              return (
                <Popup key={item.key}>
                  <StyledClose color={theme.text2} onClick={() => removePopup(item.key)} />
                  <PopupItem content={item.content} popKey={item.key} />
                </Popup>
              )
            })}
        </MobilePopupInner>
      </MobilePopupWrapper>
    )
}
