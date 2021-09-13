/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-09-07 16:30:27
 * @LastEditors: camus
 * @LastEditTime: 2021-09-11 10:24:27
 */
import React from 'react';
import { Redirect, Route, RouteChildrenProps } from 'react-router-dom';
import NotFound from 'components/NotFound';
import Home from 'pages/Home';

interface RouteComponent extends RouteChildrenProps<any> {
  routes?: BaseRoute[];
}

export interface BaseRoute {
  routes?: BaseRoute[];
  component: React.ComponentType<RouteComponent> | React.ComponentType<any>;
  path: string;
  exact?: boolean;
  sensitive?: boolean;
  strict?: boolean;
  auth?: boolean;
  keepAlive?: boolean;
}

const routes: BaseRoute[] = [
  {
    path: '/',
    exact: true,
    component: () => (
      <Redirect to="/home" /> //刚进入时，重定向，到home，需要引入react
    ),
  },
  {
    path: '/home',
    component: Home,
  },
];

export default routes;
