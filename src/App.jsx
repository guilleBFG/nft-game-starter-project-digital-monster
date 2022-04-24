import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
import {
	CONTRACT_ADDRESS,
	transformCharacterData
} from './constants/constanst';
import digitalMonsterContract from './utils/DigimonNFTGame.json';
import { ethers } from 'ethers';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
	const [currentAccount, setCurrentAccount] = useState(null);
	const [characterNFT, setCharacterNFT] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  
	const checkNetwork = async () => {
		try {
			if (window.ethereum.networkVersion !== '4') {
				alert('please connect to rinkeby');
			}
		} catch (error) {
			console.log(error);
		}
	};
	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log('please use metamask');
        setIsLoading(false);
				return;
			} else {
				console.log('ethereum object found', ethereum);

				const accounts = await ethereum.request({ method: 'eth_accounts' });

				if (accounts.length !== 0) {
					const account = accounts[0];
					console.log('found an auth account', account);
					setCurrentAccount(account);
				} else {
					console.log('not auth account found');
				}
			}
		} catch (error) {
			console.log(error);
		}

    setIsLoading(false);
	};

	const connectWallet = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				alert('get Metamask');
				return;
			}

			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			});

			console.log('account connected', accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const renderContent = () => {
    if(isLoading){
      return <LoadingIndicator />;
    }
		if (!currentAccount) {
			return (
				<div className="connect-wallet-container">
					<img src="https://i.gifer.com/8VuY.gif" />
					<button
						className="cta-button connect-wallet-button"
						onClick={connectWallet}
					>
						Connect To Wallet to Get Started
					</button>
				</div>
			);
		} else if (currentAccount && !characterNFT) {
			return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
		} else if (currentAccount && characterNFT) {
			return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}/>;
		}
	};

	useEffect(() => {
    setIsLoading(true);
		checkIfWalletIsConnected();
	}, []);

	useEffect(
		() => {
			const fetchNFTMetadata = async () => {
				try {
					console.log('checking for characters NFT on Address', currentAccount);

					const provider = new ethers.providers.Web3Provider(window.ethereum);
					const signer = provider.getSigner();
					const gameContract = new ethers.Contract(
						CONTRACT_ADDRESS,
						digitalMonsterContract.abi,
						signer
					);
					const txn = await gameContract.checkIfUserHasNFT();

					if (txn.name) {
						console.log('user has character NFT');
						setCharacterNFT(transformCharacterData(txn));
					} else {
						console.log('no character NFT found');
					}

          setIsLoading(false);
				} catch (error) {
					console.log(error);
				}
			};
			if (currentAccount) {
				console.log('CurrentAccount: ', currentAccount);
				fetchNFTMetadata();
			}
		},
		[currentAccount]
	);

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">Digital Monsters RPG</p>
					<p className="sub-text">Team up to protect the Metaverse!</p>
					{renderContent()}
				</div>
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;
