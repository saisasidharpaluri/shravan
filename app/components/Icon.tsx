export type IconName = 'voice' | 'check' | 'pin' | 'privacy' | 'edit' | 'report' | 'road' | 'recycle' | 'water' | 'light' | 'drain' | 'plus' | 'copy' | 'play' | 'search' | 'stop';

export function Icon({ name }: { name: IconName }) {
  return <svg className="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {name === 'voice' && <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8"/></>}
    {name === 'check' && <path d="m5 12 4.5 4.5L19 7"/>}
    {name === 'pin' && <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>}
    {name === 'privacy' && <><path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></>}
    {name === 'edit' && <><path d="m14 5 5 5M4 20l4.2-.9L19 8.3 15.7 5 4.9 15.8 4 20Z"/><path d="M13 7 17 11"/></>}
    {name === 'report' && <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6m-6 4h6m-6 4h4"/></>}
    {name === 'road' && <><path d="M8 3 5 21m11-18 3 18M12 5v3m0 4v3m0 4v1"/></>}
    {name === 'recycle' && <><path d="m8 5 2-3 3 5m4 1 3 1-3 5m-2 5-3 2-3-5M5 11l-2 3 5 1m2-9-2 4m8 3 3 1m-9 2 2 3"/></>}
    {name === 'water' && <><path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z"/><path d="M9 15a3 3 0 0 0 3 3"/></>}
    {name === 'light' && <><path d="M9 18h6m-5 3h4m-5-6a7 7 0 1 1 6 0l-.7 3H10l-1-3Z"/><path d="M12 1v2m9 9h2M1 12h2m15.4-6.4 1.4-1.4M4.2 4.2l1.4 1.4"/></>}
    {name === 'drain' && <><path d="M4 7h16M4 12h16M4 17h16"/><path d="m8 4-2 3 2 3m8 0 2 2-2 3m-8 0-2 2 2 3"/></>}
    {name === 'plus' && <path d="M12 5v14M5 12h14"/>}
    {name === 'copy' && <><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></>}
    {name === 'play' && <path d="m8 5 11 7-11 7V5Z"/>}
    {name === 'search' && <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></>}
    {name === 'stop' && <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none"/>}
  </svg>;
}
