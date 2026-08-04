"use client";

import { useEffect, useMemo, useRef } from 'react';
import type { KeyboardEvent } from 'react';

import type { Category, ResultConfig, ResultType } from '../../types/game';
import { formatTime } from '../../utils/formatTime';

import { MediaAsset } from '../layout/MediaAsset';

type ResultModalProps = {
  resultType: ResultType;
  category: Category;
  resultConfig: ResultConfig;
  foundWordsCount: number;
  targetWordsCount: number;
  remainingMilliseconds: number | null;
  onPlayAgain: () => void;
};

export function ResultModal({
  resultType,
  category,
  resultConfig,
  foundWordsCount,
  targetWordsCount,
  remainingMilliseconds,
  onPlayAgain
}: ResultModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const actionRef = useRef<HTMLButtonElement | null>(null);

  const isSuccess = resultType === 'success';
  const image = isSuccess ? resultConfig.successImage : resultConfig.timeoutImage;
  const imageAlt = isSuccess ? resultConfig.successImageAlt : resultConfig.timeoutImageAlt;
  const title = isSuccess ? resultConfig.successTitle : resultConfig.timeoutTitle;
  const message = isSuccess ? resultConfig.successMessage : resultConfig.timeoutMessage;

  const secondaryMessage = useMemo(() => {
    if (isSuccess) {
      return `Tiempo restante: ${formatTime(remainingMilliseconds ?? 0)}`;
    }

    const pending = Math.max(0, targetWordsCount - foundWordsCount);

    return `Te faltaron ${pending} palabra${pending === 1 ? '' : 's'}.`;
  }, [foundWordsCount, isSuccess, remainingMilliseconds, targetWordsCount]);

  useEffect(() => {
    actionRef.current?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onPlayAgain();
    }

    if (event.key !== 'Tab' || !dialogRef.current) {
      return;
    }

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="result-modal__backdrop" role="presentation">
      <div
        className="result-modal panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-modal-title"
        aria-describedby="result-modal-message"
        ref={dialogRef}
        onKeyDown={handleKeyDown}
      >
        <button type="button" className="result-modal__close" onClick={onPlayAgain} aria-label="Cerrar y volver a jugar">
          ×
        </button>

        <div className="result-modal__content">
          <div className="result-modal__media">
            <MediaAsset src={image} alt={imageAlt} sizes="(max-width: 720px) 60vw, 240px" objectFit="contain" />
          </div>

          <div>
            <p className="result-modal__eyebrow">{isSuccess ? 'Victoria' : 'Resultado'}</p>
            <h2 className="result-modal__title" id="result-modal-title">
              {title}
            </h2>
          </div>

          <p className="result-modal__message" id="result-modal-message">
            {message}
          </p>

          <div className="result-modal__stats" aria-label="Resumen de la partida">
            <div className="result-modal__stat">
              <span className="result-modal__stat-label">Categoría</span>
              <span className="result-modal__stat-value">{category.name}</span>
            </div>

            <div className="result-modal__stat">
              <span className="result-modal__stat-label">Encontradas</span>
              <span className="result-modal__stat-value">
                {foundWordsCount} / {targetWordsCount}
              </span>
            </div>

            <div className="result-modal__stat">
              <span className="result-modal__stat-label">Tiempo</span>
              <span className="result-modal__stat-value">{formatTime(remainingMilliseconds ?? 0)}</span>
            </div>
          </div>

          <div className="result-modal__actions">
            <button ref={actionRef} type="button" className="result-modal__action" onClick={onPlayAgain}>
              {isSuccess ? 'Volver a jugar' : 'Volver a intentarlo'}
            </button>
            <p className="result-modal__secondary">{secondaryMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
