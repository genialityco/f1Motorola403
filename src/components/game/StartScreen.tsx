"use client";

import type { Category, IntroConfig, StartButtonConfig } from '../../types/game';

import { MediaAsset } from '../layout/MediaAsset';
import { CategorySelector } from './CategorySelector';
import { StartButton } from './StartButton';

type StartScreenProps = {
  intro: IntroConfig;
  categories: Category[];
  selectedCategoryId: string | null;
  startButton: StartButtonConfig;
  validationMessage?: string | null;
  onCategoryChange: (categoryId: string) => void;
  onStart: () => void;
};

export function StartScreen({
  intro,
  categories,
  selectedCategoryId,
  startButton,
  validationMessage,
  onCategoryChange,
  onStart
}: StartScreenProps) {
  return (
    <section className="screen-frame start-screen">
      <article className="panel intro-card">
        {intro.cardBackground ? (
          <div className="intro-card__background" aria-hidden="true">
            <MediaAsset src={intro.cardBackground} alt="" sizes="100vw" />
          </div>
        ) : null}

        <div className="intro-card__media" aria-hidden="true">
          <MediaAsset src={intro.image} alt={intro.imageAlt} sizes="120px" objectFit="contain" />
        </div>

        <p className="intro-card__text">{intro.text}</p>
      </article>

      <div className="start-screen__actions">
        <CategorySelector categories={categories} selectedCategoryId={selectedCategoryId} onChange={onCategoryChange} />

        {validationMessage ? <div className="state-message" role="status">{validationMessage}</div> : null}

        <StartButton config={startButton} disabled={!selectedCategoryId} onStart={onStart} />
      </div>
    </section>
  );
}
