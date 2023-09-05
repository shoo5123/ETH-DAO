import { ConnectWallet, useSwitchChain, useAddress, useChain, useContract } from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import { EdexaTestnet, Sepolia } from "@thirdweb-dev/chains";
import { useEffect, useState, useMemo } from 'react';
import { editionDropAddress, ERCTokenAddress } from '../src/scripts/module';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const address = useAddress();
  const chain = useChain();

  /** ネットワーク切り替え用 */
  const switchChain = useSwitchChain();

  /** edition contract define */
  const editionDrop = useContract(
    editionDropAddress,
    'edition-drop',
  ).contract;

  const token = useContract(
    ERCTokenAddress,
    'token'
  ).contract;

  const [hasMemberShipNFT, setHasMemberShipNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts ] = useState<any>([])
  const [memberAddress, setMemberAddress] = useState<string[] | undefined>([]);

  const shortAddress = (str: string) => {
    return str.substring(0, 6) + '...' + str.substring(str.length -4 );
  }

  const debag =async () => {
    console.log(token);
  }

return (
    <div className={styles.container}>
    <main className={styles.main}>
    <h1 className={styles.title}>
        debagger
    </h1>
    <button onClick={debag}> debag </button>
    </main>
</div>
);
};

export default Home;