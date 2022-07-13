import React from 'react';
import { View, ViewProps } from '@tarojs/components';
import classNames from 'classnames';

import styles from './index.module.less';

export interface ContainerProps extends ViewProps {
  full?: boolean;
  center?: boolean;
  row?: boolean;
  flex?: number | true;
  hidden?: boolean;
  absolute?: boolean;
  relative?: boolean;
}

const Container: React.FC<ContainerProps> = (props) => {
  const { full, center, row, flex, hidden, absolute, relative, className, ...rest } =
    props;
  return (
    <View
      className={classNames(
        styles.container,
        full && styles.full,
        center && styles.center,
        row && styles.row,
        flex ? styles[`flex${Number(flex)}`] : false,
        hidden && styles.hidden,
        absolute && styles.absolute,
        relative && styles.relative,
        className,
      )}
      {...rest}
    />
  );
};

export default Container;
