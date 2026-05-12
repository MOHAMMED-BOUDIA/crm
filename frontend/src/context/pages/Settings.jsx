import { useState, useRef } from 'react';
import Layout from '../../components/Layout';
import { Camera, Mail, User, Briefcase, Globe, DollarSign, ChevronDown, CheckCircle2, Loader2, Key } from 'lucide-react';
import { Button, IconButton } from '../../components/ui/Button';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

const INPUT_CLS = 'w-full pl-4 pr-10 py-3.5 bg-white/50 backdrop-blur-md border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white shadow-inner transition-all duration-300';

const Settings = () => {
  const { addToast } = useUI();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    fullName: user?.name || 'Alexander Sterling',
    role: 'Enterprise Admin',
    email: user?.email || 'admin@crmpro.dev'
  });

  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80');

  const [company, setCompany] = useState({
    name: 'ClientFlow Enterprise',
    timezone: '(GMT+01:00) Casablanca',
    currency: 'DH - Moroccan Dirham'
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API
    setSavingProfile(false);
    addToast('Profile settings updated successfully.', 'success');
  };

  const handleSaveCompany = async () => {
    setSavingCompany(true);
    await new Promise(r => setTimeout(r, 800));
    setSavingCompany(false);
    addToast('Company preferences updated.', 'success');
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newUrl = URL.createObjectURL(file);
      addToast('Uploading new profile avatar...', 'info');
      // Simulate API upload delay
      setTimeout(() => {
        setAvatarUrl(newUrl);
        addToast('Avatar updated successfully!', 'success');
      }, 1500);
    }
  };

  const handlePasswordChange = () => {
    setPassModalOpen(true);
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      return addToast('New passwords do not match.', 'error');
    }
    if (passData.new.length < 6) {
      return addToast('Password must be at least 6 characters.', 'error');
    }

    setPassLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate API
    setPassLoading(false);
    setPassModalOpen(false);
    setPassData({ current: '', new: '', confirm: '' });
    addToast('Password updated successfully!', 'success');
  };

  return (
    <Layout title="">
      <div className="mb-12 mt-2">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">Settings</h2>
        <p className="text-slate-400 font-bold mt-2">Manage your personal preferences and organization-wide configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Profile Settings</h3>
          <p className="text-sm font-semibold text-slate-400 mt-2 leading-relaxed">
            This information will be displayed to your teammates and clients during interactions.
          </p>
        </div>

        <div className="lg:col-span-2 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-8 mb-10">
              <div className="relative">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center overflow-hidden ring-[6px] ring-white shadow-[0_8px_30px_rgb(59,130,246,0.15)] group-hover:ring-blue-50 transition-all duration-300">
                  {/* Profile Placeholder */}
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                <IconButton
                  icon={<Camera size={14} />}
                  label="Change profile photo"
                  variant="primary"
                  shape="circle"
                  onClick={handleCameraClick}
                  className="absolute -bottom-2 -right-2 border-[3px] border-white shadow-xl hover:scale-110 w-9 h-9"
                />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800">Your Avatar</h4>
                <p className="text-xs font-black text-slate-400 mt-1 uppercase tracking-widest">JPG, GIF or PNG. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2 relative group/input">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <input type="text" value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} className={INPUT_CLS} />
                  <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative group/input">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                <div className="relative">
                  <input type="text" value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} className={INPUT_CLS} />
                  <Briefcase size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors pointer-events-none" />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2 relative group/input">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className={INPUT_CLS} />
                  <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100/50">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full sm:w-auto font-bold" onClick={handlePasswordChange} leftIcon={<Key size={16} />}>
                Change Password
              </Button>
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-10 shadow-lg shadow-blue-500/25" onClick={handleSaveProfile} loading={savingProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Company Settings</h3>
          <p className="text-sm font-semibold text-slate-400 mt-2 leading-relaxed">
            Configure your organization's global identity and regional preferences.
          </p>
        </div>

        <div className="lg:col-span-2 relative group mb-12">
          <div className="absolute -inset-0.5 bg-gradient-to-bl from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="md:col-span-2 space-y-2 relative group/input">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Company Name</label>
                <div className="relative">
                  <input type="text" value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} className={INPUT_CLS} />
                  <Globe size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative group/input">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Timezone</label>
                <div className="relative">
                  <select className={`${INPUT_CLS} appearance-none cursor-pointer`} value={company.timezone} onChange={e => setCompany({ ...company, timezone: e.target.value })}>
                    <option>{company.timezone}</option>
                    <option>(GMT+00:00) UTC</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2 relative group/input">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Default Currency</label>
                <div className="relative">
                  <select className={`${INPUT_CLS} appearance-none cursor-pointer`} value={company.currency} onChange={e => setCompany({ ...company, currency: e.target.value })}>
                    <option>{company.currency}</option>
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-slate-100/50">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-10 shadow-lg shadow-blue-500/25" onClick={handleSaveCompany} loading={savingCompany}>
                Update Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {passModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => !passLoading && setPassModalOpen(false)} />

          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
            <div className="px-8 pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Update Password</h3>
              <p className="text-slate-400 font-bold mt-1 text-sm">Keep your account secure with a strong password.</p>
            </div>

            <form onSubmit={submitPasswordChange} className="px-8 pb-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passData.current}
                  onChange={e => setPassData({ ...passData, current: e.target.value })}
                  className={INPUT_CLS + " bg-slate-50/50"}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passData.new}
                  onChange={e => setPassData({ ...passData, new: e.target.value })}
                  className={INPUT_CLS + " bg-slate-50/50"}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passData.confirm}
                  onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                  className={INPUT_CLS + " bg-slate-50/50"}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setPassModalOpen(false)}
                  disabled={passLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={passLoading}
                >
                  Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Settings;
