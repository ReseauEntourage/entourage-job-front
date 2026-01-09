import Image from 'next/image';
import React, { FC } from 'react';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import {
  CommitmentFormat,
  CommitmentFormatMode,
} from 'src/constants/commitmentFormat';
import {
  CommitmentFormatCardContainer,
  CommitmentFormatCardImg,
  CommitmentFormatCardContent,
  CommitmentFormatCardInfos,
  CommitmentFormatCardDesc,
  CommitmentFormatCardPrice,
} from './CommitmentFormat.styles';

interface CommitmentFormatCardProps {
  commitmentFormat: CommitmentFormat;
}

export const CommitmentFormatCard: FC<CommitmentFormatCardProps> = ({
  commitmentFormat,
}) => {
  const modeLabel =
    commitmentFormat.mode === CommitmentFormatMode.ONLINE
      ? 'En ligne'
      : 'En présentiel';
  const modeIcon =
    commitmentFormat.mode === CommitmentFormatMode.ONLINE
      ? 'Monitor'
      : 'MapPin';

  return (
    <CommitmentFormatCardContainer>
      <CommitmentFormatCardImg>
        <Image
          src={commitmentFormat.image}
          alt={commitmentFormat.title}
          width={320}
          height={240}
          style={{ objectFit: 'contain', display: 'block' }}
        />
      </CommitmentFormatCardImg>
      <CommitmentFormatCardContent>
        <h3>{commitmentFormat.title}</h3>
        <CommitmentFormatCardInfos>
          <span>
            <LucidIcon name={modeIcon} size={18} /> {modeLabel}
          </span>
          <span>
            <LucidIcon name="Clock" size={18} /> {commitmentFormat.duration}
          </span>
          <span>
            <LucidIcon name="Users" size={18} /> {commitmentFormat.participants}
          </span>
        </CommitmentFormatCardInfos>
        <CommitmentFormatCardDesc>
          {commitmentFormat.description}
        </CommitmentFormatCardDesc>
      </CommitmentFormatCardContent>
      <CommitmentFormatCardPrice>
        <span>{commitmentFormat.price}</span>
      </CommitmentFormatCardPrice>
    </CommitmentFormatCardContainer>
  );
};
