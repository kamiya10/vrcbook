import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { applyCookie } from '@/lib/utils';
import { getCredentialStore } from '@/lib/stronghold';
import { useUserStore } from '@/stores/user';

export default function LoadingPage() {
  const fetch = useUserStore((state) => state.fetchCurrent);
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      const auth = await getCredentialStore().getRecord('currentAuth');
      const twoFactorAuth = await getCredentialStore().getRecord('current2FA');
      console.log(auth, twoFactorAuth);

      if (!auth) {
        void navigate('/login');
      }
      else {
        applyCookie(auth, twoFactorAuth);
        fetch()
          .then(() => void navigate('/app'))
          .catch((e) => {
            console.error(e);
            void navigate('/login');
          });
      }
    })();
  }, []);

  return (
    <div className="grid items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
