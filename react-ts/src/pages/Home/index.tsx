import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { HomeWrapper } from './styles';
import { AsyncUnMount, SlotDemo, Verify } from 'pages/Enjoy';
import { NavLink, Route, Switch } from 'react-router-dom';

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
const { Header, Sider: SidNav, Content } = Layout;
const Home: React.FC = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <HomeWrapper>
      <Layout className={'layout'}>
        <SidNav trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              <NavLink to="/home/enjoy"> enjoy</NavLink>
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
          </Menu>
        </SidNav>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            <NavLink to="/home/AsyncUnMount"> AsyncUnMount</NavLink>
            <NavLink to="/home/SlotDemo"> SlotDemo</NavLink>
            <NavLink to="/home/Verify"> Verify</NavLink>

            <Switch>
              <Route exact key="/home/AsyncUnMount" path={'/home/AsyncUnMount'} component={AsyncUnMount}></Route>
              <Route exact key="/home/SlotDemo" path={'/home/SlotDemo'} component={SlotDemo}></Route>
              <Route exact key="/home/Verify" path={'/home/Verify'} component={Verify}></Route>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </HomeWrapper>
  );
};
export default Home;
