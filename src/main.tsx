import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './integrations/supabase/client';

function attemptSignOut() {
	try {
		// Best-effort: trigger Supabase sign-out (async, may be cancelled on unload)
		supabase.auth.signOut().catch(() => {});

		// Remove common Supabase/local auth storage keys and our redirect token
		try {
			for (const k of Object.keys(localStorage)) {
				if (k.includes('supabase') || k.includes('sb:') || k.includes('sb-') || k === 'post_auth_redirect') {
					localStorage.removeItem(k);
				}
			}
		} catch (e) {}

		try {
			sessionStorage.removeItem('post_auth_redirect');
		} catch (e) {}
	} catch (e) {
		// swallow errors - this is a best-effort action on unload
	}
}

// pagehide triggers on tab close / navigation in most browsers and is preferred for unload work
window.addEventListener('pagehide', () => attemptSignOut());

// beforeunload as a fallback
window.addEventListener('beforeunload', () => attemptSignOut());

// Also trigger when the document becomes hidden (e.g. mobile app backgrounded)
document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'hidden') attemptSignOut();
});

createRoot(document.getElementById("root")!).render(<App />);
