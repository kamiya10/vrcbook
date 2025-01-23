import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

const LoginImages = [
  {
    worldName: 'Horse Mountain',
    authorName: 'nprowler',
    imagePath: 'https://assets.vrchat.com/www/appedashi/login_background_1.png',
  },
  {
    worldName: 'Instagib Tournament',
    authorName: 'ville672',
    imagePath: 'https://assets.vrchat.com/www/appedashi/login_background_2.png',
  },
  {
    worldName: 'Gumball Lounge',
    authorName: 'screamingcolor',
    imagePath: 'https://assets.vrchat.com/www/appedashi/login_background_3.png',
  },
  {
    worldName: 'Exoplanet Journey',
    authorName: 'Niko*',
    imagePath: 'https://assets.vrchat.com/www/appedashi/login_background_4.png',
  },
  {
    worldName: 'Dusk',
    authorName: 'Lucifer MStar',
    imagePath: 'https://assets.vrchat.com/www/appedashi/login_background_5.png',
  },
  {
    worldName: 'Amber Glade - Winter',
    authorName: 'Mankey',
    imagePath: 'https://assets.vrchat.com/www/appedashi/login_background_6.png',
  },
];

export default function LoginLayout() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (bgIndex === LoginImages.length - 1) {
        setBgIndex(0);
      }
      else {
        setBgIndex(bgIndex + 1);
      }
    }, 15_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`
      -mt-8 flex min-h-svh w-full items-center justify-center p-6
      md:p-10
    `}
    >
      <img
        key={`login-background-${bgIndex}`}
        src={LoginImages[bgIndex].imagePath}
        alt={`${LoginImages[bgIndex].worldName} by ${LoginImages[bgIndex].authorName}`}
        className={`
          fixed -z-10 h-svh w-svw animate-scale-out object-cover brightness-90
        `}
      />
      <span className={`
        fixed bottom-1 right-1 whitespace-pre-line text-right text-xs opacity-60
        drop-shadow
      `}
      >
        {LoginImages[bgIndex].worldName}
        {'\n'}
        by
        {' '}
        {LoginImages[bgIndex].authorName}
      </span>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
