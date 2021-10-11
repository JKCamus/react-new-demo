/*
 * @Description:
 * @version:
 * @Author: camus
 * @Date: 2021-09-29 10:01:42
 * @LastEditors: camus
 * @LastEditTime: 2021-10-11 09:54:18
 */
import React from 'react';

interface IProps {
  passProps?: any;
  fail?: React.ReactNode;
  failStyle?: React.CSSProperties;
  failClassName?: string;
}

interface State {
  hasError: boolean;
}

// 异常时展示的组件
export const ErrorComponent = ({ fail, passProps, failStyle, failClassName }: IProps) => {
  // @ts-ignore
  if (fail && typeof fail.type === 'function') {
    // @ts-ignore
    const comProps = { ...fail.props, ...passProps };
    // @ts-ignore
    if (fail.type.prototype instanceof React.Component) {
      // @ts-ignore
      // eslint-disable-next-line new-cap
      return new fail.type(comProps).render();
    } else {
      // @ts-ignore
      return fail.type(comProps);
    }
  }

  return (
    <div className={`error-component-failed ${failClassName}`} style={failStyle}>
      {fail || 'Fail!'}
    </div>
  );
};

class ErrorBoundary extends React.Component<IProps, State> {
  public static getDerivedStateFromError() {
    return { hasError: true };
  }
  public constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  // 重置状态
  public restState() {
    this.setState({ hasError: false });
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorComponent {...this.props} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

type ErrorWrapperType = <T>(Component: any, errorProps?: IProps) => (props: T) => React.ReactElement<T>;

export const ErrorWrapper: ErrorWrapperType = (Component, errorProps) => (props) => {
  return (
    <ErrorBoundary {...errorProps} passProps={props}>
      <Component {...props} />
      <div />
    </ErrorBoundary>
  );
};
