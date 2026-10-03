// Web Audio API synthesiser for kitchen alerts
// Plays pleasant two-tone barbecue bell / grill chime for incoming live orders
export const playOrderChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration, type = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Smooth decay envelope
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Pleasant high-energy ascending chime (G5 -> C6)
    playTone(784, now, 0.25, 'triangle');
    playTone(1046.5, now + 0.15, 0.45, 'sine');
  } catch (err) {
    console.warn('Audio alert not allowed until user interaction:', err);
  }
};
