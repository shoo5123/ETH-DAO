import { ConnectWallet, useSwitchChain, useAddress, useChain } from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import { Sepolia, Goerli } from "@thirdweb-dev/chains";


import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const address = useAddress();
  const chain = useChain();
  
  {/** ネットワーク変更の実装時に、ボタン活性化用 */}
  const switchChain = useSwitchChain();
  
  {/* current chain check */}
  if (chain === undefined || chain.chainId !== Goerli.chainId) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Sepolia に切り替えてください⚠️</h1>
          <p>この dApp は Sepolia テストネットのみで動作します。</p>
          <p>ウォレットから接続中のネットワークを切り替えてください。</p>
        </main>
      </div>
    );
  } else {
    {/* checked Seponia chain active connect */}
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to CompanyCircleDAO !!
          </h1>
          <p></p>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>
        </main>
      </div>
    );
  }
};

export default Home;