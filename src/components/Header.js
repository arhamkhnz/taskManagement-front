import React from 'react'
import { Layout } from 'antd';
const { Header } = Layout;

export default function HeaderComponent() {
  return (
    <>
    <Header>
        <span style={{color: 'white'}} className='d-flex Justify-content-center'>Task Management</span>
    </Header>
    </>
  )
}
