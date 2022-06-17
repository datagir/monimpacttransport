import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { Flipper, Flipped } from 'react-flip-toolkit'

import TransportationContext from 'utils/TransportationContext'
import SearchContext from 'utils/SearchContext'
import useIframe from 'hooks/useIframe'

import Transportation from 'components/misc/Transportation'
import Disclaimer from 'components/misc/Disclaimer'

const Wrapper = styled.div`
  flex: 1;
  position: relative;
  margin-bottom: 2rem;
`
export default function Results() {
  const iframe = useIframe(true)

  useEffect(() => {
    if (!iframe) {
      document.title = 'Mon Impact Transport'
      document.getElementById('Accueil')?.focus()
      document.activeElement.blur()
    }
  }, [iframe])

  const { transportations, carpool, uncertainty, displayAll, construction } =
    useContext(TransportationContext)
  const { km } = useContext(SearchContext)

  const [transportationsToDisplay, settransportationsToDisplay] = useState([])
  useEffect(() => {
    settransportationsToDisplay(
      transportations
        // Remove all empty transportations
        .filter(
          (transportation) =>
            transportation[construction ? 'construction' : 'values']
        )
        // Show only default (or display all)
        .filter((transportation) => transportation.default || displayAll)
        // Show carpool or not
        .filter((transportation) => !transportation.carpool || carpool)
        // Show only depending on distance (or display all)
        .filter(
          (transportation) =>
            // Display all transportations
            displayAll ||
            // Show construction
            construction ||
            // No display indicator at all
            !transportation.display ||
            // Empty display indicator
            (!transportation.display.min && !transportation.display.max) ||
            //Only max
            (!transportation.display.min && transportation.display.max >= km) ||
            //Only min
            (!transportation.display.max && transportation.display.min <= km) ||
            //Both min and max
            (transportation.display.min <= km &&
              transportation.display.max >= km)
        )
        .map((transportation) => {
          const valuesToUse =
            transportation[construction ? 'construction' : 'values'].length > 1
              ? transportation[construction ? 'construction' : 'values'].find(
                  (value) => value.max > km
                )
              : transportation[construction ? 'construction' : 'values'][0]
          const valueToUse =
            (valuesToUse
              ? uncertainty && valuesToUse.uncertainty
                ? valuesToUse.uncertainty
                : valuesToUse.value
              : 0) * km
          const valueWithCarpool = transportation.carpool
            ? valueToUse / carpool
            : valueToUse
          return {
            ...transportation,
            value: valueWithCarpool,
            base: valueToUse.value * km,
          }
        })
        .sort((a, b) => (a.value > b.value ? 1 : -1))
    )
  }, [km, transportations, carpool, uncertainty, displayAll, construction])

  return (
    <Wrapper>
      <Flipper
        flipKey={transportationsToDisplay
          .map((transportation) => transportation.id)
          .join()}
      >
        {transportationsToDisplay.map((transportation) => (
          <Flipped flipId={transportation.id} key={transportation.id}>
            <Transportation
              transportation={transportation}
              max={
                transportationsToDisplay[transportationsToDisplay.length - 1]
                  .value
              }
            />
          </Flipped>
        ))}
      </Flipper>
      <Disclaimer />
    </Wrapper>
  )
}
