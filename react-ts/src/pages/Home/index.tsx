import { NavLink, Route, Switch } from 'react-router-dom';
import React, { useState } from 'react';
import { Layout, Menu, Card, Col, Row } from 'antd';
import { HomeWrapper } from './styles';
import demoRoutes from './demoRoutes';
import styled from 'styled-components';

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
      <Layout className="layout">
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
            <CardWrapper>
              {demoRoutes.map((route) => (
                <NavLink key={route.path} to={route.path}>
                  <Card>
                    <div>{route.label}</div>
                  </Card>
                </NavLink>
              ))}
            </CardWrapper>

            <Switch>
              {demoRoutes.map((route) => (
                <Route exact key={route.path} path={route.path} component={route.component} />
              ))}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </HomeWrapper>
  );
};
export default Home;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(304px, 1fr));
  grid-column-gap: 25px;
  row-gap: 24px;
  /* grid-auto-rows: 200px; */
  margin-bottom: 80px;
`;
