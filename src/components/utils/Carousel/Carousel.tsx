import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UIkit from 'uikit';
import { LucidIcon } from '../Icons/LucidIcon';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

export interface CarouselProps {
  style?: string;
  children: React.ReactNode;
  containerClasses: string;
  pagination?: boolean;
  padding?: boolean;
}

export const Carousel = ({
  style,
  children,
  containerClasses,
  pagination,
  padding,
}: CarouselProps) => {
  const { asPath } = useRouter();
  const carouselRef = React.useRef<HTMLDivElement | null>(null);

  let tag;

  if (asPath.includes('/recruter')) {
    tag = GA_TAGS.PAGE_RECRUTER_CARROUSEL_CLIC;
  }
  if (asPath.includes('/travailler')) {
    tag = GA_TAGS.PAGE_TRAVAILLER_CARROUSEL_CLIC;
  }
  if (asPath.includes('/orienter')) {
    tag = GA_TAGS.PAGE_ORIENTER_CARROUSEL_CLIC;
  }
  if (asPath.includes('/entreprises')) {
    tag = GA_TAGS.PAGE_ENTREPRISES_CARROUSEL_CLIC;
  }

  useEffect(() => {
    UIkit.slider(carouselRef.current, {
      autoplay: true,
      'autoplay-interval': 2000,
      'pause-on-hover': true,
      center: true,
    });
  }, []);

  return (
    <div
      ref={carouselRef}
      className="uk-position-relative uk-margin-medium-left uk-margin-medium-right"
      style={{ maxWidth: '100%' }}
    >
      <div
        className={`uk-slider-container uk-border-rounded ${
          padding ? 'uk-padding-small' : ''
        } uk-background-${style}`}
      >
        <ul className={`uk-slider-items ${containerClasses}`}>{children}</ul>
      </div>
      {pagination && (
        <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin" />
      )}
      <div className="uk-hidden uk-light">
        <a
          href="#"
          className="uk-position-center-left uk-position-small"
          data-uk-slider-item="previous"
          onClick={() => {
            if (tag) {
              gaEvent(tag);
            }
          }}
        >
          <LucidIcon name="ChevronLeft" size={30} />
        </a>
        <a
          href="#"
          className="uk-position-center-right uk-position-small"
          data-uk-slider-item="next"
          onClick={() => {
            if (tag) {
              gaEvent(tag);
            }
          }}
        >
          <LucidIcon name="ChevronRight" size={30} />
        </a>
      </div>
      <div className="uk-visible@m">
        <a
          href="#"
          className="uk-position-center-left-out uk-position-small"
          data-uk-slider-item="previous"
          onClick={() => {
            if (tag) {
              gaEvent(tag);
            }
          }}
        >
          <LucidIcon name="ChevronLeft" size={30} />
        </a>
        <a
          href="#"
          className="uk-position-center-right-out uk-position-small"
          data-uk-slider-item="next"
          onClick={() => {
            if (tag) {
              gaEvent(tag);
            }
          }}
        >
          <LucidIcon name="ChevronRight" size={30} />
        </a>
      </div>
    </div>
  );
};

Carousel.defaultProps = {
  style: 'default',
  pagination: true,
  padding: false,
};
