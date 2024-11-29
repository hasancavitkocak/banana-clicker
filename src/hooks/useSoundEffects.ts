import useSound from 'use-sound';

const SOUND_URLS = {
  click: '/sounds/click.mp3',
  combo: '/sounds/combo.mp3',
  win: '/sounds/win.mp3',
  lose: '/sounds/click.mp3',
  countdown: '/sounds/countdown.mp3',
  start: '/sounds/start.mp3'
};

export function useSoundEffects() {
  const [playClick] = useSound(SOUND_URLS.click, { 
    volume: 0.2,
    preload: true,
    interrupt: true
  });
  
  const [playCombo] = useSound(SOUND_URLS.combo, { 
    volume: 0.4,
    preload: true,
    interrupt: true
  });
  
  const [playWin] = useSound(SOUND_URLS.win, { 
    volume: 0.5,
    preload: true,
    interrupt: true
  });
  
  const [playLose] = useSound(SOUND_URLS.lose, { 
    volume: 0.5,
    preload: true,
    interrupt: true
  });
  
  const [playCountdown] = useSound(SOUND_URLS.countdown, { 
    volume: 0.5,
    preload: true,
    interrupt: true
  });
  
  const [playStart] = useSound(SOUND_URLS.start, { 
    volume: 0.6,
    preload: true,
    interrupt: true
  });

  return {
    playClick,
    playCombo,
    playWin,
    playLose,
    playCountdown,
    playStart,
  };
}