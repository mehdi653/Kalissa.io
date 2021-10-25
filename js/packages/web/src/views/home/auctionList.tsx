import { useWallet } from '@solana/wallet-adapter-react';
import { InstructionsModal } from '../../components/InstructionsModal';
import { LABELS } from '../../constants';
import { Col, Layout, Row, Tabs } from 'antd';
import BN from 'bn.js';
import React, { useState, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { HowToBuyModal } from '../../components/HowToBuyModal';
import { AuctionViewState, useAuctions, AuctionView } from '../../hooks';
import { AuctionRenderCard } from '../../components/AuctionRenderCard';
import { Link } from 'react-router-dom';
import { CardLoader } from '../../components/MyLoader';
import { useMeta } from '../../contexts';
import { Banner } from '../../components/Banner';
import { Banner2 } from '../../components/Banner2';





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
        headingText={'LIMITED & nft  '}
        subHeadingText={'Collection of items unique.'}
        actionComponent={<HowToBuyModal buttonClassName="secondary-btn" />}
        useBannerBg={true}
      />
      <h1>Welcome to the first collector's item brand supported by the NFT</h1>
      <p className="textarea">The kalissa digital and physical collectibles are available in limited editions. They can be bought, sold and exchanged. </p>

      

      
      <div class="ant-modal-content"><button type="button" aria-label="Close" class="ant-modal-close"><span class="ant-modal-close-x"><img src="/modals/close.svg"></span></button><div class="ant-modal-header"><div class="ant-modal-title" id="rcDialogTitle0">Buying NFTs on KALISSA</div></div><div class="ant-modal-body"><div class="site-card-wrapper"><div class="ant-row" style="margin-left: -8px; margin-right: -8px; row-gap: 0px;"><div class="ant-col ant-col-24 ant-col-xl-8" style="padding-left: 8px; padding-right: 8px;"><div class="ant-card ant-card-bordered"><div class="ant-card-cover"><div class="card-cover"><img src="/modals/how-to-buy-1.svg"></div></div><div class="ant-card-body"><div class="body-title">Create a SOL wallet</div><div class="body-content">SOL is the cryptocurrency we use for purchases on KALISSA. To keep your SOL safe, you’ll need a crypto wallet—we recommend using one called Phantom. Just head to Phantom’s site, install the Chrome extension, and create an account.</div><div class="line"></div></div></div> </div><div class="ant-col ant-col-24 ant-col-xl-8" style="padding-left: 8px; padding-right: 8px;"><div class="ant-card ant-card-bordered"><div class="ant-card-cover"><div class="card-cover"><img src="/modals/how-to-buy-2.svg"></div></div><div class="ant-card-body"><div class="body-title">Add funds to your wallet</div><div class="body-content">To fund your wallet, you’ll need to purchase SOL tokens. The easiest way is with a credit card on FTX Pay—a service that’s already part of your new Phantom wallet. Open your wallet, tap “Deposit SOL”, and select “Deposit from FTX”. A new window will open where you can create an FTX account and purchase SOL.</div><div class="line"></div></div></div></div><div class="ant-col ant-col-24 ant-col-xl-8" style="padding-left: 8px; padding-right: 8px;"><div class="ant-card ant-card-bordered"><div class="ant-card-cover"><div class="card-cover"><img src="/modals/how-to-buy-3.jpg"></div></div><div class="ant-card-body"><div class="body-title">Connect your wallet to KALISSA.</div><div class="body-content">To connect your wallet, tap “Connect Wallet” here on the site. Select the Phantom option, and your wallet will connect. After that, you can start bidding on NFTs.</div><button type="button" class="ant-btn secondary-btn"><span>Connect Wallet</span></button></div></div></div></div></div></div></div>
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
