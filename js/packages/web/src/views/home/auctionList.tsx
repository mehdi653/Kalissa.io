import { useWallet } from '@solana/wallet-adapter-react';
import { InstructionsModal } from '../../components/InstructionsModal';
import { LABELS } from '../../constants';
import { Col, Layout, Row, Tabs } from 'antd';
import BN from 'bn.js';
import React, { useState, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { HowToBuyModal } from '../../components/HowToBuyModal';
import { HowToWorkModal } from '../../components/HowToWorkModal';
import { AuctionViewState, useAuctions, AuctionView } from '../../hooks';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { Link } from 'react-router-dom';
import { CardLoader } from '../../components/MyLoader';
import { useMeta } from '../../contexts';
import { Banner } from '../../components/Banner';



const { TabPane } = Tabs;

const { Content } = Layout;

export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
}

export const AuctionListView = () => {
  const auctions = useAuctions(AuctionViewState.Live);
  const auctionsEnded = [
    ...useAuctions(AuctionViewState.Ended),
    ...useAuctions(AuctionViewState.BuyNow),
  ];
  const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
  const { isLoading } = useMeta();
  const { connected, publicKey } = useWallet();
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  // Check if the auction is primary sale or not
  const checkPrimarySale = (auc: AuctionView) => {
    var flag = 0;
    auc.items.forEach(i => {
      i.forEach(j => {
        if (j.metadata.info.primarySaleHappened == true) {
          flag = 1;
          return true;
        }
      });
      if (flag == 1) return true;
    });
    if (flag == 1) return true;
    else return false;
  };

  const resaleAuctions = auctions
    .sort(
      (a, b) =>
        a.auction.info.endedAt
          ?.sub(b.auction.info.endedAt || new BN(0))
          .toNumber() || 0,
    )
    .filter(m => checkPrimarySale(m) == true);

  // Removed resales from live auctions
  const liveAuctions = auctions
    .sort(
      (a, b) =>
        a.auction.info.endedAt
          ?.sub(b.auction.info.endedAt || new BN(0))
          .toNumber() || 0,
    )
    .filter(a => !resaleAuctions.includes(a));

  const asStr = publicKey?.toBase58();
  const participated = useMemo(
    () =>
      liveAuctions
        .concat(auctionsEnded)
        .filter((m, idx) =>
          m.auction.info.bidState.bids.find(b => b.key == asStr),
        ),
    [publicKey, auctionsEnded.length],
  );
  let items = liveAuctions;
  switch (activeKey) {
    case LiveAuctionViewState.All:
      items = liveAuctions;
      break;
    case LiveAuctionViewState.Participated:
      items = participated;
      break;
    case LiveAuctionViewState.Resale:
      items = resaleAuctions;
      break;
    case LiveAuctionViewState.Ended:
      items = auctionsEnded;
      break;
  }

  const liveAuctionsView = (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {!isLoading
        ? items.map((m, idx) => {
            const id = m.auction.pubkey;
            return (
              <Link to={`/auction/${id}`} key={idx}>
                <AuctionRenderCard key={id} auctionView={m} />
              </Link>
            );
          })
        : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
    </Masonry>
  );
  const endedAuctions = (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {!isLoading
        ? auctionsEnded.map((m, idx) => {
            const id = m.auction.pubkey;
            return (
              <Link to={`/auction/${id}`} key={idx}>
                <AuctionRenderCard key={id} auctionView={m} />
              </Link>
            );
          })
        : [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
    </Masonry>
  );

  return (
    <>
      <Banner
        src={'/kalibanniere2.svg'}
        headingText={'LIMITED & nft  .'}
        subHeadingText={'Collection of clothes unique.'}
        actionComponent={<HowToBuyModal buttonClassName="secondary-btn" />}
        useBannerBg={true}
      />
      <h1>Welcome to the first collector's clothing brand supported by nft</h1>
      (
    <InstructionsModal
      
      buttonText="How to Buy"
      modalTitle={`Buying NFTs on ${LABELS.STORE_NAME}`}
      cardProps={[
        {
          title: 'Create a SOL wallet',
          imgSrc: '/modals/how-to-buy-1.svg',
          description: `SOL is the cryptocurrency we use for purchases on ${LABELS.STORE_NAME}. To keep your SOL safe, you’ll need a crypto wallet—we recommend using one called Phantom. Just head to Phantom’s site, install the Chrome extension, and create an account.`,
        },
        {
          title: 'Add funds to your wallet',
          imgSrc: '/modals/how-to-buy-2.svg',
          description: `To fund your wallet, you’ll need to purchase SOL tokens. The easiest way is with a credit card on FTX Pay—a service that’s already part of your new Phantom wallet. Open your wallet, tap “Deposit SOL”, and select “Deposit from FTX”. A new window will open where you can create an FTX account and purchase SOL.`,
        },
        {
          title: `Connect your wallet to ${LABELS.STORE_NAME}.`,
          imgSrc: '/modals/how-to-buy-3.jpg',
          description: `To connect your wallet, tap “Connect Wallet” here on the site. Select the Phantom option, and your wallet will connect. After that, you can start bidding on NFTs.`,
          
        },
      ]}
      
    />
  );
      <Layout>
     
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 32 }}>
            <Row>
              <Tabs
                activeKey={activeKey}
                onTabClick={key => setActiveKey(key as LiveAuctionViewState)}
              >
                <TabPane
                  tab={
                    <>
                      <span className={'live'}></span> Live
                    </>
                  }
                  key={LiveAuctionViewState.All}
                >
                  {liveAuctionsView}
                </TabPane>
                {resaleAuctions.length > 0 && (
                  <TabPane
                    tab={'Secondary Marketplace'}
                    key={LiveAuctionViewState.Resale}
                  >
                    {liveAuctionsView}
                  </TabPane>
                )}
                <TabPane tab={'Ended'} key={LiveAuctionViewState.Ended}>
                  {endedAuctions}
                </TabPane>
                {connected && (
                  <TabPane
                    tab={'Participated'}
                    key={LiveAuctionViewState.Participated}
                  >
                    {liveAuctionsView}
                  </TabPane>
                )}
              </Tabs>
            </Row>
          </Col>
        </Content>
      </Layout>
    </>
  );
};
