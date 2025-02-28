import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import LoginForm from '@/app/login/LoginForm';
import { getCurrentUser } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Login - Web 2.0',
  description: 'Sign in to your account',
};

export default async function LoginPage({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
} = {}) {
  const redirectPath = typeof searchParams.redirect === 'string' 
    ? searchParams.redirect 
    : '/admin';

  const user = await getCurrentUser();
  
  if (user) {
    redirect(redirectPath);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <LoginForm redirectTo={redirectPath} />
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic'; 