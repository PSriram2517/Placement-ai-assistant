import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import ChatPage from './pages/ChatPage';
import LoginView from './views/LoginView';
import { getCurrentUser, logoutUser } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!mounted) return;
      if (fbUser) {
        setUser({
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email,
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          provider: 'google',
        });
        setCheckingAuth(false);
        return;
      }

      const localUser = await getCurrentUser();
      if (mounted) {
        setUser(localUser);
        setCheckingAuth(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore Firebase sign-out errors if signed in via local session
    }
    await logoutUser();
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#f7f4ee] dark:bg-[#161513] flex items-center justify-center">
        <span className="text-xs font-mono text-[#7b7266] dark:text-[#8a847a]">Loading session…</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {user ? (
        <ChatPage user={user} onLogout={handleLogout} />
      ) : (
        <LoginView onAuthSuccess={setUser} />
      )}
    </div>
  );
}

export default App;
