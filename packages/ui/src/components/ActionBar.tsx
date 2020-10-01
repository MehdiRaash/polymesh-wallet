import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  className?: string;
}

function ActionBar ({ children, className }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default styled(ActionBar)`
  align-content: flex-end;
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  text-align: right;

  a {
    cursor: pointer;
  }

  a+a {
    margin-left: 0.75rem;
  }
`;
