import React from 'react';
import DemoComponent from 'pages/Enjoy';

interface RoutesType {
  label: string;
  component: React.ComponentType;
  path: string;
}

const routes: RoutesType[] = DemoComponent.map((cpn) => ({
  label: cpn.name,
  component: cpn.component,
  path: `/home/${cpn.name}`,
}));
export default routes;
