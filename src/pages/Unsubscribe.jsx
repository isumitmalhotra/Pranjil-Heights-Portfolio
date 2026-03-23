import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { H1, Body } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { newsletterAPI } from '../services/api';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const resubscribeMode = searchParams.get('resubscribe') === 'true';

  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const heading = useMemo(() => {
    return resubscribeMode ? 'Resubscribe to Newsletter' : 'Unsubscribe from Newsletter';
  }, [resubscribeMode]);

  const submitAction = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = resubscribeMode
        ? await newsletterAPI.subscribe({ email, source: 'email-resubscribe' })
        : await newsletterAPI.unsubscribe(email);

      setResult({
        success: true,
        message: response?.message || (resubscribeMode ? 'You are subscribed again.' : 'You have been unsubscribed.'),
      });
      toast.success(resubscribeMode ? 'Subscribed successfully!' : 'Unsubscribed successfully!');
    } catch (error) {
      setResult({ success: false, message: error.message || 'Request failed. Please try again.' });
      toast.error(error.message || 'Request failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <GlassCard className="border-gold/20 p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/20">
              <Mail className="h-7 w-7 text-gold" />
            </div>
            <H1 className="mb-3 text-white">{heading}</H1>
            <Body className="text-slate-300">
              {resubscribeMode
                ? 'Enter your email to activate newsletter updates again.'
                : 'Enter your email to stop receiving promotional newsletter updates.'}
            </Body>
          </div>

          <form onSubmit={submitAction} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              className="w-full rounded-xl border border-blue-200/25 bg-blue-300/15 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/50"
            />

            <Button type="submit" variant="primary" className="w-full bg-gold text-white hover:bg-gold/90" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : (resubscribeMode ? 'Resubscribe' : 'Unsubscribe')}
            </Button>
          </form>

          {result && (
            <div className={`mt-6 rounded-xl border p-4 ${result.success ? 'border-green-500/40 bg-green-500/10' : 'border-red-500/40 bg-red-500/10'}`}>
              <div className="flex items-start gap-3">
                {result.success ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-400" /> : <AlertCircle className="mt-0.5 h-5 w-5 text-red-400" />}
                <p className={result.success ? 'text-green-200' : 'text-red-200'}>{result.message}</p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold/90">
              <ArrowLeft className="h-4 w-4" />
              Back to homepage
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Unsubscribe;
