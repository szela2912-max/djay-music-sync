/**
 * BeatDetector: Analyzes audio to detect beats and calculate BPM
 */
class BeatDetector {
  constructor(options = {}) {
    this.threshold = options.threshold || 0.3;
    this.minBPM = options.minBPM || 60;
    this.maxBPM = options.maxBPM || 200;
    this.sampleRate = options.sampleRate || 44100;
  }

  /**
   * Detect beats in audio buffer using energy-based analysis
   */
  async detect(audioBuffer) {
    const energySpectrum = this.calculateEnergySpectrum(audioBuffer);
    const beats = this.findPeaks(energySpectrum);
    return beats;
  }

  /**
   * Calculate energy spectrum of audio using frequency bands
   */
  calculateEnergySpectrum(audioBuffer) {
    const frameSize = 2048;
    const spectrum = [];
    
    for (let i = 0; i < audioBuffer.length - frameSize; i += frameSize / 2) {
      const frame = audioBuffer.slice(i, i + frameSize);
      const energy = this.calculateFrameEnergy(frame);
      spectrum.push({ time: i / this.sampleRate, energy });
    }
    
    return spectrum;
  }

  /**
   * Calculate energy of a single frame
   */
  calculateFrameEnergy(frame) {
    let sum = 0;
    for (let i = 0; i < frame.length; i++) {
      sum += frame[i] * frame[i];
    }
    return Math.sqrt(sum / frame.length);
  }

  /**
   * Find peaks in energy spectrum to identify beats
   */
  findPeaks(spectrum) {
    const peaks = [];
    const smoothed = this.smoothSpectrum(spectrum);
    const threshold = this.threshold * Math.max(...smoothed.map(s => s.energy));

    for (let i = 1; i < smoothed.length - 1; i++) {
      const prev = smoothed[i - 1].energy;
      const curr = smoothed[i].energy;
      const next = smoothed[i + 1].energy;

      if (curr > prev && curr > next && curr > threshold) {
        peaks.push({
          time: smoothed[i].time,
          energy: curr
        });
      }
    }

    return peaks;
  }

  /**
   * Smooth spectrum using moving average
   */
  smoothSpectrum(spectrum, windowSize = 5) {
    const smoothed = [];
    for (let i = 0; i < spectrum.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - windowSize); j <= Math.min(spectrum.length - 1, i + windowSize); j++) {
        sum += spectrum[j].energy;
        count++;
      }
      smoothed.push({
        time: spectrum[i].time,
        energy: sum / count
      });
    }
    return smoothed;
  }

  /**
   * Calculate BPM from detected beats
   */
  calculateBPM(beats) {
    if (beats.length < 2) return null;

    const intervals = [];
    for (let i = 1; i < beats.length; i++) {
      const interval = beats[i].time - beats[i - 1].time;
      intervals.push(interval);
    }

    const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    const bpm = Math.round((60 / avgInterval));

    return Math.max(this.minBPM, Math.min(this.maxBPM, bpm));
  }
}

module.exports = BeatDetector;
