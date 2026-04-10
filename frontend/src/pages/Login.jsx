import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  ArrowRight,
  Mail,
  Lock,
  ShieldCheck,
  Globe,
  Zap,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (api.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.login({ email, password });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login integration coming soon!`);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-0 bg-[#161e31]/80 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative z-10">

        {/* Left Side - Visual/Marketing */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

          <div className="relative z-10">
            <div className="mb-10">
              <Logo size="lg" withText={true} theme="dark" text="CRM Pro" option="A" />
            </div>

            <h2 className="text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight font-display">
              The OS for your <br />
              <span className="text-blue-200">Customer Success</span>
            </h2>
            <p className="text-blue-100/70 text-lg leading-relaxed max-w-md font-medium">
              Join 500+ enterprises managing their pipelines, tasks, and relationships in one unified workstation.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6 mt-12">
            {[
              { icon: ShieldCheck, label: 'Enterprise Security', text: 'Military-grade encryption' },
              { icon: Zap, label: 'Real-time Sync', text: 'Always up to date' },
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10">
                <feature.icon className="text-blue-200 mb-3" size={24} />
                <div className="font-bold text-white text-sm mb-1">{feature.label}</div>
                <div className="text-xs text-blue-100/50 font-medium">{feature.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Logo size="md" withText={true} theme="light" text="CRM Pro" option="A" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">Welcome Back</h3>
            <p className="text-slate-400 font-semibold">Enter your credentials to access your workspace</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="text-rose-500 shrink-0" size={20} />
              <p className="text-sm font-bold text-rose-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="input-label">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email"
                  className="input pl-14"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="input-label mb-0">Password</label>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700 py-1 px-2 h-auto">Forgot?</Button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="password"
                  className="input pl-14"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={isLoading}
              rightIcon={<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            >
              Sign in to Workspace
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase font-extrabold tracking-widest text-slate-300"><span className="bg-white px-4">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleSocialLogin('Google')}
                leftIcon={<svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>}
                className="w-full text-slate-700 bg-white"
              >
                Google
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleSocialLogin('GitHub')}
                leftIcon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>}
                className="w-full text-slate-700 bg-white"
              >
                GitHub
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm font-semibold text-slate-400">
              Don't have an account? <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-bold ml-1 px-2 py-1 h-auto">Create an account</Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
