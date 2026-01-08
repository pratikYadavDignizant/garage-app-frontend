'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function useAuth() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    type Win = Window & { recaptchaVerifier?: RecaptchaVerifier | null; confirmationResult?: ConfirmationResult | null };

    const initRecaptcha = (containerId = 'recaptcha-container') => {
        if (!auth) {
            toast.error('Firebase Auth is not initialized. Check your API keys.');
            return null;
        }

        const win = window as Win;
        if (win.recaptchaVerifier) return win.recaptchaVerifier;

        let container = document.getElementById(containerId);
        if (!container) {
            const fallback = document.createElement('div');
            fallback.id = containerId;
            fallback.style.position = 'absolute';
            fallback.style.left = '-9999px';
            fallback.setAttribute('aria-hidden', 'true');
            fallback.style.pointerEvents = 'none';
            document.body.appendChild(fallback);
            container = fallback;
        }

        try {
            const verifier = new RecaptchaVerifier(auth, container, {
                size: 'invisible',
                callback: () => { },
            });
            win.recaptchaVerifier = verifier;
            return verifier;
        } catch (err) {
            console.error('Failed to initialize reCAPTCHA:', err);
            toast.error('Failed to initialize reCAPTCHA.');
            return null;
        }
    };

    const sendOtp = async (phoneNumber: string, containerId = 'recaptcha-container') => {
        if (!phoneNumber || phoneNumber.length < 8) {
            toast.error('Please enter a valid phone number including country code.');
            return false;
        }

        setIsLoading(true);
        try {
            // Clear any existing captcha first
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
            }

            const verifier = initRecaptcha(containerId);
            if (!verifier) return false;

            // Some environments require render to be called once
            try {
                const r = (verifier as unknown as { render?: () => Promise<unknown> }).render;
                if (r) await r.call(verifier);
            } catch { }

            if (!auth) { toast.error('Firebase Auth is not initialized.'); return false; }
            const result = await signInWithPhoneNumber(auth!, phoneNumber, verifier);
            (window as Win).confirmationResult = result;
            setConfirmationResult(result);
            toast.success('Verification code sent!');
            return true;
        } catch (error: unknown) {
            const e = error as { code?: string; message?: string };
            let message = e?.message || 'Failed to send verification code.';
            if (e?.code === 'auth/invalid-phone-number') message = 'Invalid phone number format.';
            if (e?.code === 'auth/too-many-requests' || e?.code === 'auth/quota-exceeded') message = 'Too many requests. Try again later.';

            // Clear captcha on error
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
            }

            toast.error(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = async (code: string) => {
        if (!code || code.length < 4) {
            toast.error('Please enter the verification code.');
            return false;
        }

        setIsLoading(true);
        try {
            const win = window as Win;
            const cr = confirmationResult || win.confirmationResult;
            if (!cr) {
                toast.error('No verification in progress. Request a new code.');
                return false;
            }

            const result = await cr.confirm(code);
            const token = await result.user.getIdToken();

            // Exchange token for backend session (optional)
            try {
                const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

                const resp = await fetch(`${baseURL}/auth/firebase`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!resp.ok) {
                    const errorText = await resp.text();
                    console.error('Backend auth failed:', resp.status, errorText);
                    throw new Error(`Backend auth failed: ${resp.status}`);
                }

                const data = await resp.json();

                const backendToken = data?.token || token;
                localStorage.setItem('admin_token', backendToken);
                document.cookie = `admin_token=${backendToken}; path=/; max-age=${30 * 24 * 60 * 60}`;
            } catch (e) {
                // Backend failed — still allow local token usage
                console.warn('Backend auth failed, using Firebase token directly:', e);
                localStorage.setItem('admin_token', token);
                document.cookie = `admin_token=${token}; path=/; max-age=${30 * 24 * 60 * 60}`;
            }

            toast.success('Signed in successfully!');
            router.push('/admin/dashboard');
            return true;
        } catch (error: unknown) {
            const e = error as { code?: string; message?: string };
            let message = e?.message || 'Invalid verification code.';
            if (e?.code === 'auth/code-expired') message = 'Code expired. Request a new one.';
            toast.error(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            if (auth) await auth.signOut();
        } catch (e) {
            console.warn('Sign out failed:', e);
        }
        localStorage.removeItem('admin_token');
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
        toast.info('Logged out');
    };

    return {
        sendOtp,
        verifyOtp,
        isLoading,
        isOtpSent: !!confirmationResult || (typeof window !== 'undefined' && !!(window as unknown as Win).confirmationResult),
        logout,
    };
}
