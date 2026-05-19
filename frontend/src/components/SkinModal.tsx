import { useState } from 'react';
import './SkinModal.css';

interface Props {
  onClose: () => void;
  onSelect?: (skin: any) => void;
  skins: any
}

export default function SkinModal({ skins, onClose, onSelect }: Props) {
  const skinsArray = Array.isArray(skins) ? skins : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const next = () => {
    if (currentIndex < skinsArray.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="skin-overlay" onClick={onClose}>
      <div className="skin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="skin-close" onClick={onClose}>✕</button>



        <div className="skin-header">
          <div className="skin-line"></div>
          <h2>ВЫБОР ПЕРСОНАЖА</h2>
          <div className="skin-line"></div>
        </div>


        {skinsArray.length !== 0 ?
          <div className="skin-slider">
            <button
              className="skin-nav"
              onClick={prev}
              disabled={currentIndex === 0}
            >
              ‹
            </button>

            <div className="skin-preview">
              <div className="skin-frame">
                <img
                  src={skinsArray[currentIndex].defaultImagePath}
                  alt={skinsArray[currentIndex].name}
                />
              </div>
              <div className="skin-details">
                <div className="skin-title">{skinsArray.length !== 0 ? skinsArray[currentIndex].name : ''}</div>
              </div>
            </div>

            <button
              className="skin-nav"
              onClick={next}
              disabled={currentIndex === skinsArray.length - 1}
            >
              ›
            </button>
          </div>
          :
          ""
        }

        <div className="skin-indicators">
          {skinsArray.map((_, idx) => (
            <button
              key={idx}
              className={`skin-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>

        {skinsArray.length !== 0 ?
          <div className="skin-actions">
            <button
              className="skin-select"
              onClick={() => onSelect?.(skinsArray[currentIndex])}
            >
              ВЫБРАТЬ
            </button>
            <button className="skin-cancel" onClick={onClose}>
              ОТМЕНА
            </button>
          </div>
          :
          ""
        }

      </div>
    </div>
  );
}