import '../styles/navbar.scss'
import hatIcon from './hatIcon.png'

import React, { useState } from 'react'
import {
  CCollapse,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
} from '@coreui/react'

export default function NavBar() {
  const [visible, setVisible] = useState(false)
  return (
    <CNavbar expand="lg" className="bg-body-tertiary" placement="fixed-top">
      <CContainer fluid>
        <CNavbarBrand href="/"> 
          <img src={hatIcon} alt={'hat favicon in navbar'}/>
        </CNavbarBrand>
        <CNavbarToggler onClick={() => setVisible(!visible)} />
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav className="me-auto">
            <CNavItem>
              <CNavLink href="/althea">Althea Map</CNavLink>
            </CNavItem>
            <CDropdown variant="nav-item" popper={false}>
              <CDropdownToggle>Dropdown Example</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="/">Home</CDropdownItem>
                {/* <CDropdownDivider /> */}
                <CDropdownItem href="/althea">Althea Map</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CNavbarNav>
        </CCollapse>
      </CContainer>
    </CNavbar>
  )
}