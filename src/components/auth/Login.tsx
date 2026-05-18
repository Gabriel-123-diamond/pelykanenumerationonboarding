import React, { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { LogIn, UserPlus, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import type { UserRole } from '../../types';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('enumeration');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Unified Login for both Staff and Admin
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Staff Registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          name,
          role,
          isApproved: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-stone-950 to-stone-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-stone-800/10">
        <div className="p-10 text-center text-white bg-amber-600 transition-colors duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 bg-stone-900 shadow-xl shadow-black/50 transition-all">
            {isLogin ? <LogIn size={36} /> : <UserPlus size={36} />}
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Meal Villa</h1>
          <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            {isLogin ? "Bakery Distribution" : "Staff Onboarding"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-orange-50 border border-amber-100 text-amber-900 text-xs rounded-2xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              {error}
            </div>
          )}
          
          <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                placeholder="name@mealvilla.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-5 pr-12 py-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-amber-500 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Assign System Role</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'enumeration', label: 'Enumeration Staff', desc: 'Field Input & Scoring' },
                    { id: 'onboarding', label: 'Onboarding Staff', desc: 'Validation & Pipeline' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as UserRole)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        role === r.id 
                          ? "border-amber-600 bg-amber-50 shadow-sm" 
                          : "border-stone-50 bg-stone-50 hover:border-stone-100"
                      }`}
                    >
                      <div className="text-left">
                        <p className={`text-xs font-black uppercase tracking-tight ${role === r.id ? "text-amber-700" : "text-stone-700"}`}>{r.label}</p>
                        <p className="text-[10px] text-stone-400 font-bold">{r.desc}</p>
                      </div>
                      {role === r.id && <ShieldCheck size={20} className="text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-amber-500/20 active:scale-95 disabled:bg-stone-200 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Verifying..." : isLogin ? "Enter Dashboard" : "Create Account"}
          </button>
        </form>
        
        <div className="p-8 bg-stone-50 border-t border-stone-100 flex flex-col gap-4 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] hover:text-amber-700 transition-colors"
          >
            {isLogin ? "Need a staff account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};
