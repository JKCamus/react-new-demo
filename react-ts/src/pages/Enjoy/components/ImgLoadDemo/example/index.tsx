import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CacheDemo from './useImage.cache';
import SrcListDemo from './useImage.srcList';
import ImageDemo from './img';

type DemoType = 'ImageDemo' | 'srcListDemo' | 'cacheDemo' | '';

const Divider = () => <div style={{ height: '10px' }} />;

const ImgLoadDemo = () => {
  const [demoType, showDemo] = React.useState<DemoType>('');
  return (
    <div>
      <h2>cache demo </h2>
      <Divider />
      <button onClick={() => showDemo('cacheDemo')}>show cache demo</button>
      {demoType === 'cacheDemo' && <CacheDemo />}
      <Divider />

      <h2>srcList demo </h2>
      <button onClick={() => showDemo('srcListDemo')}>show srcList demo</button>
      <Divider />
      {demoType === 'srcListDemo' && <SrcListDemo />}
      <Divider />

      <h2>Img demo </h2>
      <button onClick={() => showDemo('ImageDemo')}>show Img demo</button>
      <Divider />
      {demoType === 'ImageDemo' && <ImageDemo />}
      <Divider />
    </div>
  );
};

export default ImgLoadDemo;
