import styled from 'styled-components';

export const VerifyWrapper = styled.div`
  position: relative;

  .block {
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
    cursor: grab;
  }

  .block:active {
    cursor: grabbing;
  }

  .sliderContainer {
    position: relative;
    text-align: center;
    width: 310px;
    height: 40px;
    line-height: 40px;
    margin-top: 15px;
    background: #f7f9fa;
    color: #45494c;
    border: 1px solid #e4e7eb;
  }

  .slider {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    transition: background 0.2s linear;
    cursor: pointer;
    cursor: grab;
  }

  .sliderContainer_active .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #486cd6;
  }

  .sliderContainer_success .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #0db87f;
    background-color: #0ca14a !important;
  }

  .sliderMask {
    position: absolute;
    left: 0;
    top: 0;
    height: 40px;
    border: 0 solid #486cd6;
    background: #d1e9fe;
  }

  .sliderContainer_active .sliderMask {
    height: 38px;
    border-width: 1px;
  }

  .sliderContainer_success .sliderMask {
    height: 38px;
    border: 1px solid #0db87f;
    background-color: #d2f4ef;
  }

  .sliderContainer_fail .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #f57a7a;
    background-color: #f57a7a !important;
  }

  .sliderContainer_fail .sliderMask {
    height: 38px;
    border: 1px solid #f57a7a;
    background-color: #fce1e1;
  }

  .slider:active {
    cursor: grabbing;
  }

  .slider:hover {
    background: #486cd6;
  }

  .sliderIcon {
    font-size: 18px;
    color: #000;
  }

  .sliderContainer_fail .sliderIcon {
    top: 14px;
    background-position: 0 -82px !important;
  }

  .sliderContainer_success .sliderIcon {
    background-position: 0 -26px !important;
  }

  .sliderContainer_active .sliderText,
  .sliderContainer_success .sliderText,
  .sliderContainer_fail .sliderText {
    display: none;
  }

  .slider:hover .sliderIcon {
    color: #fff;
  }

  .refreshIcon {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    background-size: 32px;
  }

  .loadingContainer {
    position: absolute;
    left: 0;
    top: 0;
    width: 310px;
    height: 155px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #45494c;
    z-index: 2;
    background: #edf0f2;
  }

  .loadingIcon {
    width: 32px;
    height: 32px;
    margin-bottom: 10px;
    background: url(http://cdn.dooring.cn/dr/icon12.png);
    background-size: 32px;
    animation: loading-icon-rotate 0.8s linear infinite;
  }
`;
