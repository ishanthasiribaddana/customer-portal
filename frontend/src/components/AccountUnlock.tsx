import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lock, MessageCircle, ArrowLeft, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { unlockApi } from '../lib/api';

interface AccountUnlockProps {
  onBack: () => void;
  onSuccess: () => void;
}

type Step = 'username' | 'otp' | 'success';

const RESEND_COOLDOWN_SECONDS = 60;
const WHATSAPP_BUSINESS_PHONE = '+94777918914';

const getErrorMessage = (err: unknown, fallback: string): string => {
  const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
  return axiosErr.response?.data?.message || axiosErr.response?.data?.error || fallback;
};

const AccountUnlock: React.FC<AccountUnlockProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<Step>('username');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [businessPhone, setBusinessPhone] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Use correct WhatsApp business phone
  useEffect(() => {
    setBusinessPhone(WHATSAPP_BUSINESS_PHONE);
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleRequestUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await unlockApi.requestUnlock(username);
      
      if (response.data.success) {
        setMaskedPhone(response.data.maskedPhone || '****');
        setStep('otp');
        startCooldown();
        // Auto-focus OTP input after render
        setTimeout(() => otpInputRef.current?.focus(), 100);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to request unlock. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);

    try {
      const response = await unlockApi.requestUnlock(username);
      if (response.data.success) {
        setMaskedPhone(response.data.maskedPhone || '****');
        startCooldown();
        setOtp('');
        otpInputRef.current?.focus();
      } else {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to resend OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await unlockApi.verifyOtp(username, otp);
      
      if (response.data.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Verification failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(`UNLOCK ${username}`);
    const phone = (businessPhone || WHATSAPP_BUSINESS_PHONE).replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-t-4 border-temco-blue">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-temco-yellow via-temco-pink to-temco-blue flex items-center justify-center">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-secondary-800">
          {step === 'success' ? 'Account Unlocked!' : 'Unlock Your Account'}
        </h2>
        <p className="text-secondary-500 text-sm mt-1">
          {step === 'username' && 'Enter your username to receive an OTP'}
          {step === 'otp' && `OTP sent to WhatsApp ${maskedPhone}`}
          {step === 'success' && 'You can now login to your account'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Step 1: Username Input */}
      {step === 'username' && (
        <form onSubmit={handleRequestUnlock} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-temco-blue focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full py-3 px-4 bg-temco-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Send OTP via WhatsApp
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 text-secondary-600 hover:text-secondary-800 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Enter 6-digit OTP
            </label>
            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-secondary-200 rounded-lg focus:ring-2 focus:ring-temco-blue focus:border-transparent"
              maxLength={6}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3 px-4 bg-temco-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Verify & Unlock
              </>
            )}
          </button>

          <div className="text-center text-sm text-secondary-500 space-y-2">
            <p>Didn't receive OTP?</p>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                className="text-temco-blue hover:text-temco-blue/80 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-4 h-4" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
              <span className="text-secondary-300">|</span>
              <button
                type="button"
                onClick={openWhatsApp}
                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp directly
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setStep('username'); setOtp(''); setError(''); }}
            className="w-full py-2 text-secondary-600 hover:text-secondary-800 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Username
          </button>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 'success' && (
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-secondary-600">Redirecting to login...</p>
        </div>
      )}

      {/* WhatsApp Info */}
      {step !== 'success' && businessPhone && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-green-800">WhatsApp Support</p>
              <p className="text-green-700">
                Or send "UNLOCK {username || 'your_username'}" to{' '}
                <a 
                  href={`https://wa.me/${businessPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {businessPhone}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountUnlock;
