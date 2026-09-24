import React, { useState } from 'react';
import { Shield, Fingerprint, Check, AlertCircle, X, Key, UserCheck } from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { registerBiometrics, verifyBiometrics } from '../utils/biometric';
import { soundFx } from '../utils/audio';

interface AuthModalProps {
  profile: PlayerProfile;
  onUpdateProfile: (updated: Partial<PlayerProfile>) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  profile,
  onUpdateProfile,
  onClose
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setStatusMsg({ text: `Connecting to ${provider === 'google' ? 'Google' : 'Apple'} Identity Provider...`, type: 'info' });

    // Simulated seamless OAuth handshake
    setTimeout(() => {
      const generatedName = provider === 'google' ? 'GooglePilot_' + Math.floor(100 + Math.random() * 900) : 'AppleAce_' + Math.floor(100 + Math.random() * 900);
      onUpdateProfile({
        authProvider: provider,
        username: profile.username.startsWith('SkyAce_') ? generatedName : profile.username,
        email: `${profile.username.toLowerCase()}@${provider}.com`
      });
      setLoading(false);
      soundFx.playFanfare();
      setStatusMsg({ text: `Successfully authenticated via ${provider === 'google' ? 'Google' : 'Apple'} OAuth!`, type: 'success' });
    }, 900);
  };

  const handleBiometricEnroll = async () => {
    setLoading(true);
    setStatusMsg({ text: 'Accessing device platform authenticator (TouchID / FaceID / Passkey)...', type: 'info' });

    const result = await registerBiometrics(profile.username);
    setLoading(false);

    if (result.success) {
      onUpdateProfile({ isBiometricEnabled: true });
      soundFx.playFanfare();
      setStatusMsg({ text: result.message, type: 'success' });
    } else {
      setStatusMsg({ text: result.message, type: 'error' });
    }
  };

  const handleBiometricTestVerify = async () => {
    setLoading(true);
    setStatusMsg({ text: 'Verifying biometric sensor...', type: 'info' });

    const result = await verifyBiometrics();
    setLoading(false);

    if (result.success) {
      soundFx.playScore();
      setStatusMsg({ text: 'Biometric passkey verified! Identity confirmed.', type: 'success' });
    } else {
      setStatusMsg({ text: result.message, type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-400" />
              <span>Pilot Security & ID</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>OAuth 2.0 Single Sign-On</span>
              <span aria-hidden="true">·</span>
              <span>WebAuthn Passkeys</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Auth Status Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-sm text-slate-100 block">
                {profile.username}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="capitalize">{profile.authProvider} Account</span>
                <span aria-hidden="true">·</span>
                <span>Level {profile.level}</span>
              </div>
            </div>
          </div>

          {profile.authProvider !== 'guest' && (
            <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              OAuth Verified
            </span>
          )}
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-start gap-2 border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : statusMsg.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : statusMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            ) : (
              <Key className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* OAuth Providers */}
        <div className="mt-5 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Single Sign-On (OAuth)
          </span>

          <button
            disabled={loading}
            onClick={() => handleOAuthLogin('google')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            disabled={loading}
            onClick={() => handleOAuthLogin('apple')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all border border-slate-700 active:scale-[0.98]"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.38-.58.68-1.09 1.77-.95 2.83 1.02.08 2.06-.51 2.68-1.28z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Biometrics & Passkeys Section */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Biometric Authentication
            </span>
            <span className="text-[11px] text-slate-500">TouchID / FaceID</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-xs text-slate-100 block">
                  Hardware Security Key (Passkey)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {profile.isBiometricEnabled
                    ? 'Device passkey is active and protecting your saves.'
                    : 'Enroll device biometrics for instantaneous secure unlocking.'}
                </span>
              </div>
            </div>

            {profile.isBiometricEnabled ? (
              <button
                disabled={loading}
                onClick={handleBiometricTestVerify}
                className="w-full py-2.5 px-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Test Biometric Sensor</span>
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleBiometricEnroll}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Register Biometric Passkey</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
