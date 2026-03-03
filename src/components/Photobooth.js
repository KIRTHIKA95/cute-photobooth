import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas'; // Importation
import './Photobooth.css';

const Photobooth = () => {
  const webcamRef = useRef(null);
  const stripRef = useRef(null); // Référence pour cibler ce qu'on télécharge
  const [photos, setPhotos] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [isTakingPhotos, setIsTakingPhotos] = useState(false);

  const frames = [
    { id: 1, src: '/assets/frames/heart-frame.png', name: 'sweet', gridClass: 'grid-sweet' },
    { id: 2, src: '/assets/frames/heart-frame-2.png', name: 'hugs & kisses', gridClass: 'grid-hugs' },
    { id: 3, src: '/assets/frames/heart-frame-3.png', name: 'CUTE', gridClass: 'grid-cute' },
    { id: 4, src: '/assets/frames/heart-frame-4.png', name: 'Love', gridClass: 'grid-love' },
  ];

  // Fonction pour télécharger l'image
  const downloadImage = async () => {
    if (stripRef.current) {
      const canvas = await html2canvas(stripRef.current, {
        useCORS: true, // Autorise les images chargées depuis des dossiers
        backgroundColor: null, // Garde la transparence si nécessaire
        scale: 2, // Améliore la qualité de l'image finale
      });
      const link = document.createElement('a');
      link.download = `mon-photobooth-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhotos(prev => {
          if (prev.length < 4) {
            return [...prev, imageSrc];
          }
          return prev;
        });
      }
    }
  };

  useEffect(() => {
    let timer;
    if (isTakingPhotos && photos.length < 4) {
      setCountdown(3); 
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            capturePhoto();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsTakingPhotos(false);
    }
    return () => clearInterval(timer);
  }, [isTakingPhotos, photos.length]);

  return (
    <div className="photobooth-app">
      {!selectedFrame ? (
        <div className="selection-screen">
          <div className="frames-list">
            {frames.map(f => (
              <div key={f.id} className="frame-option" onClick={() => setSelectedFrame(f)}>
                <img src={f.src} alt={f.name} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="capture-screen">
          <div className="left-side">
            <div className="webcam-container">
              <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" mirrored={true} className="webcam-view" />
              {countdown > 0 && <div className="timer-overlay">{countdown}</div>}
            </div>
            <div className="button-group">
              {photos.length < 4 && !isTakingPhotos && (
                <button className="btn-take" onClick={() => setIsTakingPhotos(true)}>Prendre 4 photos</button>
              )}
              
              {/* Bouton de téléchargement visible seulement quand les 4 photos sont prises */}
              {photos.length === 4 && (
                <button className="btn-download" onClick={downloadImage}>
                  💾 Télécharger l'image
                </button>
              )}

              <button className="btn-back" onClick={() => {setSelectedFrame(null); setPhotos([]); setIsTakingPhotos(false);}}>Retour</button>
            </div>
          </div>

          <div className="right-side">
            {/* Ajout de la ref stripRef ici */}
            <div className="final-photobooth-container" ref={stripRef}>
              <div className={`photos-grid-layer ${selectedFrame.gridClass}`}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="individual-photo-box">
                    {photos[i] ? (
                      <img src={photos[i]} alt={`Photo unique ${i}`} className="captured-image" />
                    ) : (
                      <div className="empty-slot"></div>
                    )}
                  </div>
                ))}
              </div>
              <img src={selectedFrame.src} className="frame-overlay-top" alt="Cadre" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photobooth;