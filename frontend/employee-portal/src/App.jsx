import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';
import AppRoutes from './router/routerConfig';
import { Loader2 } from 'lucide-react';

function App() {
  const dispatch = useDispatch();
  const { initialized } = useSelector((state) => state.auth);

  useEffect(() => {
    // Perform session handshake with backend on application mount
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (!initialized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#070b13] text-slate-350">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide animate-pulse">
          Initializing Secure Systems...
        </p>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
