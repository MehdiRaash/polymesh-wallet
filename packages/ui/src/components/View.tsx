import { ThemeProps } from '../types';

import React, { useState } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

// FIXME We should not import from index when this one is imported there as well
import { AvailableThemes, chooseTheme, themes, ThemeSwitchContext } from '.';

interface Props {
  children: React.ReactNode;
  className?: string;
}

function View ({ children, className }: Props): React.ReactElement<Props> {
  const [theme, setTheme] = useState(chooseTheme());
  const _theme = themes[theme];

  const switchTheme = (theme: AvailableThemes): void => {
    localStorage.setItem('theme', theme);
    setTheme(theme);
  };

  return (
    <ThemeSwitchContext.Provider value={switchTheme}>
      <ThemeProvider theme={_theme}>
        <BodyTheme theme={_theme} />
        <Main className={className}>{children}</Main>
      </ThemeProvider>
    </ThemeSwitchContext.Provider>
  );
}

const BodyTheme = createGlobalStyle<ThemeProps>`
  body {
    background-color: ${({ theme }: ThemeProps): string => theme.bodyColor};
  }

  html {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: ${({ theme }: ThemeProps): string => theme.textColor};
  font-size: ${({ theme }: ThemeProps): string => theme.fontSize};
  line-height: ${({ theme }: ThemeProps): string => theme.lineHeight};

  * {
    font-family: ${({ theme }: ThemeProps): string => theme.fontFamily};
  }

  > * {
    padding-left: 8px;
    padding-right: 8px;
  }
`;

export default View;