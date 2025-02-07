import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { StrictMode } from 'react';

import AppLayout from './app/layout';
import FriendsPage from './app/app/friends/page';
import IndexPage from './app/app/page';
import InstancePage from './app/app/contents/instance/[id]/page';
import Layout from './app/app/layout';
import LoadingPage from './app/page';
import LoginLayout from './app/login/layout';
import LoginPage from './app/login/page';
import SettingsPage from './app/settings/page';
import { ThemeProvider } from './components/theme-provider';
import TotpPage from './app/login/totp/page';
import UserPage from './app/app/contents/user/[id]/page';
import WorldOwnPage from './app/app/world/own/page';
import { initStronghold } from './lib/stronghold';

import '@fontsource/noto-sans/latin.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-700.css';
import '@fontsource/noto-sans-jp/japanese.css';
import '@fontsource/noto-sans-jp/japanese-700.css';
import '@fontsource/noto-sans-tc/chinese-traditional.css';
import '@fontsource/noto-sans-tc/chinese-traditional-700.css';
import '@fontsource/noto-sans-kr/korean.css';
import '@fontsource/noto-sans-kr/korean-700.css';
import '@/assets/css/tailwind.css';

await initStronghold();

ReactDOM
  .createRoot(document.getElementById('app') as HTMLElement)
  .render(
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<LoadingPage />} />

              <Route path="login" element={<LoginLayout />}>
                <Route index element={<LoginPage />} />
                <Route path="totp" element={<TotpPage />} />
              </Route>

              <Route path="app" element={<Layout />}>
                <Route index element={<IndexPage />} />
                <Route path="settings" element={<SettingsPage />} />

                <Route path="social">
                  <Route path="friends" element={<FriendsPage />} />
                </Route>

                <Route path="user">
                  <Route path=":id" element={<UserPage />} />
                </Route>

                <Route path="world">
                  <Route path="own" element={<WorldOwnPage />} />
                </Route>

                <Route path="instance">
                  <Route path=":id" element={<InstancePage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>,
  );
