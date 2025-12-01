import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import Navigation from './components/Navigation';
import Profile from './pages/Profile';
import ProfileDetails from './pages/ProfileDetails';
import ProfileForm from './pages/ProfileForm';
import NotFound from './pages/NotFound';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Navigation />
            <Routes>
              <Route path="/" element={<Profile />} />
              <Route path="/profile" element={<ProfileDetails />} />
              <Route path="/profile-form" element={<ProfileForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;