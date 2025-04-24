import { eckoAdapter } from '@kadena/wallet-adapter-ecko';
import { KadenaWalletProvider } from '@kadena/wallet-adapter-react';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <KadenaWalletProvider adapters={[eckoAdapter()]}>
      <Component {...pageProps} />;
    </KadenaWalletProvider>
  );
}
