import type { LayoutConfig } from '../../types/game';

import { MediaAsset } from './MediaAsset';

type HeaderProps = {
  header: LayoutConfig['header'];
};

export function Header({ header }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__logo">
          <MediaAsset src={header.leftImage} alt={header.leftImageAlt} priority sizes="240px" objectFit="contain" />
        </div>

        <div className="site-header__logo">
          <MediaAsset src={header.rightImage} alt={header.rightImageAlt} priority sizes="240px" objectFit="contain" />
        </div>
      </div>
    </header>
  );
}
