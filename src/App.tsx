import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/auth/Login';
import { EnumerationDashboard } from './components/EnumerationDashboard';
import { OnboardingDashboard } from './components/OnboardingDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LogOut } from 'lucide-react';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';

const DashboardRouter = () => {
  const { user, loading, role, isApproved } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600/20 border-t-amber-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="text-amber-600/50 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Meal Villa Loading</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (!role || !isApproved) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-amber-600/10 rounded-[2rem] flex items-center justify-center mb-8 border border-amber-600/20 shadow-2xl shadow-amber-900/20">
          <div className="animate-bounce">
            <div className="w-3 h-3 bg-amber-600 rounded-full mb-1"></div>
            <div className="w-3 h-3 bg-amber-600/50 rounded-full"></div>
          </div>
        </div>
        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter italic text-white">Access Pending</h2>
        <p className="text-stone-400 max-w-md text-sm leading-relaxed">
          {role 
            ? `Your account (${user.email}) is currently in the approval queue. Management will review your access shortly.`
            : `Your account (${user.email}) has been successfully created. Please wait for an administrator to assign your system role.`}
        </p>
        <button 
          onClick={() => signOut(auth)}
          className="mt-12 px-8 py-3 bg-stone-900 text-stone-400 hover:text-amber-500 hover:bg-stone-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-stone-800"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Global Logout Button */}
      <button 
        onClick={() => signOut(auth)}
        className="fixed top-6 right-6 z-50 bg-stone-900/90 backdrop-blur-md p-4 rounded-[1.5rem] shadow-2xl border border-stone-800 text-stone-400 hover:text-amber-500 hover:border-amber-600/50 transition-all hover:scale-110 group"
      >
        <LogOut size={20} />
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-amber-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap shadow-xl shadow-amber-900/20">SIGN OUT</span>
      </button>

      {role === 'admin' && <AdminDashboard />}
      {role === 'enumeration' && <EnumerationDashboard />}
      {role === 'onboarding' && <OnboardingDashboard />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DashboardRouter />
    </AuthProvider>
  );
}

export default App;
