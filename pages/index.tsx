import { ConnectWallet, useSwitchChain, useAddress, useChain, useContract } from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import { EdexaTestnet, Sepolia } from "@thirdweb-dev/chains";
import { useEffect, useState, useMemo } from 'react';
import { editionDropAddress, ERCTokenAddress, gavananceAddress } from '../src/scripts/module';
import { Proposal } from '@thirdweb-dev/sdk';
import { AddressZero } from '@ethersproject/constants';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const address = useAddress();
  console.log("wallet address:" + address);

  const chain = useChain();
  
  /** ネットワーク切り替え用 */
  // const switchChain = useSwitchChain();

  /** edition drop contract define */
  const editionDrop = useContract(
    editionDropAddress,
    'edition-drop',
  ).contract;

  /** token contract define */  
  const token = useContract(
    ERCTokenAddress,
    'token'
  ).contract;

  /** vote contract define */  
  const vote = useContract(
    gavananceAddress, 
    'vote'
  ).contract;

  /** define state */
  const [hasMemberShipNFT, setHasMemberShipNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts ] = useState<any>([]);
  const [memberAddresses, setMemberAddresses] = useState<string[] | undefined>([]);
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + '...' + str.substring(str.length -4 );
  }

  /** get all proposals */
  useEffect(() => {
    if (!hasMemberShipNFT) {
      return;
    }

    const getAllProposals = async () => {
      try{
        const proposals = await vote!.getAll();
        setProposals(proposals);
        console.log("success to get all proposals ");
      } catch (error) {
        console.log("failed to get all proposals ", error);
      }
    };
    getAllProposals();
  }, [hasMemberShipNFT, vote]);

  /** already voted check */
  useEffect(() => {
    if (!hasMemberShipNFT) {
      return;
    }

    if(!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote!.hasVoted(proposals[0].proposalId.toString(), address);
        if (hasVoted) {
          console.log("you are already voted.");
        } else {
          console.log("you are voted yet.");
        } 
      } catch (error) {
        console.log("failed to checkIfUserHasVoted.", error);
      }
    };
    checkIfUserHasVoted();
  }, [hasMemberShipNFT, vote, proposals, address]);

  /** get address of having MemberShipHolderNFT*/
  useEffect(() => {
    if(!hasMemberShipNFT) {
      return;
    }

    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop!.history.getAllClaimerAddresses('0');
        setMemberAddresses(memberAddresses);
        console.log('🚀 Member address: ' + memberAddresses);
      } catch(err) {
        console.error(err);
        console.error('failed to get memberAllAddresses');
      }
    }
    getAllAddresses();
  }, [hasMemberShipNFT, editionDrop?.history]);

  // memberAddresses と memberTokenAmounts を 1 つの配列に結合します
  const memberList = useMemo(() => {
    return memberAddresses?.map((address) => {
      // memberTokenAmounts 配列でアドレスが見つかっているかどうかを確認します
      // その場合、ユーザーが持っているトークンの量を返します
      // それ以外の場合は 0 を返します
      const member = memberTokenAmounts?.find(
        ({ holder }: {holder: string}) => holder === address,
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || '0',
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  /** get had membership NFT */
  useEffect(() => {
    if(!address) {
      return;
    }
    const checkBalance = async () => {
      console.log("time");
      try {
        const balance = await editionDrop!.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasMemberShipNFT(false);
          console.log("don't have member ship nft. address: " + address);
        } else {
          setHasMemberShipNFT(true);
          console.log("don't have member ship nft. address: " + address);
        }
      } catch(err) {
        setHasMemberShipNFT(true);
        console.log("get balance failed. address: " + address);
      }
    }
    checkBalance();
  }, [address, editionDrop]);

  const mint = async () => {
    console.log("clicked mint");
    
    if (!editionDrop) {
      return;
    }

    /** loading */
    try {
      setIsClaiming(true);

      editionDrop.claim("0", 1);
      console.log("successfully minted nft. address: " + address);
      setHasMemberShipNFT(true);

      setIsClaiming(false);
    } catch(err) {
      console.log("failed minted nft. address: " + address);
      setHasMemberShipNFT(false);

    } finally {
      setIsClaiming(false);
    }
  }

  {/* current chain check */}
  if (!address) {
    console.log("unconnected wallet");
    return (
      <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to CompanyDAO !!
        </h1>
        <div className={styles.connect}>
          <ConnectWallet />
        </div>
      </main>
    </div>
    );
  }
  else if (chain === undefined || chain.chainId !== Sepolia.chainId) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Sepolia に切り替えてください⚠️</h1>
          <p>この dApp は Sepolia テストネットのみで動作します。</p>
          <p>ウォレットから接続中のネットワークを切り替えてください。</p>
        </main>
      </div>
    );
  } else if (hasMemberShipNFT) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
        <h1 className={styles.title}>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
          <div>
            <div>
              <h2>■ Member List</h2>
              <table className="card">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Token Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList!.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td>{shortenAddress(member.address)}</td>
                        <td>{member.tokenAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <h2>■ Active Proposals</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // ダブルクリックを防ぐためにボタンを無効化します
                  setIsVoting(true);

                  // フォームから値を取得します
                  const votes = proposals.map((proposal) => {
                    const voteResult = {
                      proposalId: proposal.proposalId,
                      vote: 2,
                    };
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementById(
                        proposal.proposalId + '-' + vote.type
                      ) as HTMLInputElement;

                      if (elem!.checked) {
                        voteResult.vote = vote.type;
                        return;
                      }
                    });
                    return voteResult;
                  });

                  // ユーザーが自分のトークンを投票に委ねることを確認する必要があります
                  try {
                    // 投票する前にウォレットがトークンを委譲する必要があるかどうかを確認します
                    const delegation = await token!.getDelegationOf(address);
                    // トークンを委譲していない場合は、投票前に委譲します
                    if (delegation === AddressZero) {
                      await token!.delegateTo(address);
                    }
                    // 提案に対する投票を行います
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId, vote: _vote }) => {
                          // 提案に投票可能かどうかを確認します
                          const proposal = await vote!.get(proposalId);
                          // 提案が投票を受け付けているかどうかを確認します
                          if (proposal.state === 1) {
                            return vote!.vote(proposalId.toString(), _vote);
                          }
                          return;
                        })
                      );
                      try {
                        // 提案が実行可能であれば実行する
                        await Promise.all(
                          votes.map(async ({ proposalId }) => {
                            const proposal = await vote!.get(proposalId);

                            // state が 4 の場合は実行可能と判断する
                            if (proposal.state === 4) {
                              return vote!.execute(proposalId.toString());
                            }
                          })
                        );
                        // 投票成功と判定する
                        setHasVoted(true);
                        console.log('successfully voted');
                      } catch (err) {
                        console.error('failed to execute votes', err);
                      }
                    } catch (err) {
                      console.error('failed to vote', err);
                    }
                  } catch (err) {
                    console.error('failed to delegate tokens');
                  } finally {
                    setIsVoting(false);
                  }
                }}
              >
                {proposals.map((proposal) => (
                  <div key={proposal.proposalId.toString()} className="card">
                    <h5>{proposal.description}</h5>
                    <div>
                      {proposal.votes.map(({ type, label }) => (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + '-' + type}
                            name={proposal.proposalId.toString()}
                            value={type}
                            // デフォルトで棄権票をチェックする
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + '-' + type}>
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <p></p>
                <button disabled={isVoting || hasVoted} type="submit">
                  {isVoting
                    ? 'Voting...'
                    : hasVoted
                      ? 'You Already Voted'
                      : 'Submit Votes'}
                </button>
                <p></p>
                {!hasVoted && (
                  <small>
                    This will trigger multiple transactions that you will need to
                    sign.
                  </small>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  } else {
    {/* checked Seponia chain active connect */}
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Mint your free DAO Member ship NFT
          </h1>
          <button disabled={isClaiming} onClick={mint}>
            {isClaiming ? "Minting..." : "Mint your free NFT"}
          </button>
        </main>
      </div>
    );
  }
};

export default Home;