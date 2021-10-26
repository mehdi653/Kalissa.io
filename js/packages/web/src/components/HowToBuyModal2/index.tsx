import { InstructionsModal } from '../InstructionsModal';
import React from 'react';
import { LABELS } from '../../constants';
import { ConnectButton } from '@oyster/common';

interface HowToBuyModal2Props {
  buttonClassName: string;
  onClick?: any;
}

export const HowToBuyModal2: React.FC<HowToBuyModal2Props> = ({
  buttonClassName,
  onClick,
}) => {
  return (
    <InstructionsModal
      buttonClassName={buttonClassName}
      buttonText="How it works ?"
      modalTitle={`Buying NFTs on ${LABELS.STORE_NAME}`}
      cardProps={[
        {
          title: 'Mint  your nft ',
          imgSrc: '/modals/how-to-buy-1.svg',
          description: `Partnership , co-branding , Artist . All creator choices are carefully selected  ${LABELS.STORE_NAME}. To keep your SOL safe, you’ll need a crypto wallet—we recommend using one called Phantom. Just head to Phantom’s site, install the Chrome extension, and create an account.`,
        },
        {
          title: 'Receive your nft and your item. ',
          imgSrc: '/modals/how-to-buy-2.svg',
          description: `After the purchase you receive your nft and you decide if you want to receive your item or clothing. 
          You can resell your nft with the collectible or without it, the choice is yours. 
          `,
        },
        {
          title: `Discover, buy and sell to ${LABELS.STORE_NAME}.`,
          imgSrc: '/modals/how-to-buy-3.jpg',
          description: `Come to our marketplace to complete your collection or resell your nft.`,
          endElement: <ConnectButton className={'secondary-btn'} />,
        },
      ]}
      onClick={onClick}
    />
  );
};
