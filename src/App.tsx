import { createTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import { AuthContextProvider, useAuthContext } from './data/AuthContext';
import Authorization from './pages/Authorization';
import ContactsManager from './pages/ContactsManager';

const theme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
  },
});

function PrivateRoute({
  path,
  component,
}: {
  path: string;
  component: () => JSX.Element;
}) {
  const { isLoggedIn } = useAuthContext();
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return <Route path={path} component={component} />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <AuthContextProvider>
          <Switch>
            <PrivateRoute path="/contacts" component={ContactsManager} />
            <Route path="/" component={Authorization} />
          </Switch>
        </AuthContextProvider>
      </HashRouter>
    </ThemeProvider>
  );
}
