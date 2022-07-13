import React, { useState } from 'react';
import { Input } from '@tarojs/components';

export interface UsernameProps {
  value: string;
  onChange: (value: string) => void;
}

const Username: React.FC<UsernameProps> = (props) => {
  const { value, onChange } = props;
  const [username, setUsername] = useState(value);

  return (
    <Input
      value={username}
      onInput={({ detail }) => {
        setUsername(detail.value);
        onChange(detail.value);
      }}
    />
  );
};

export default Username;
