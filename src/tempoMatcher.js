/**
 * TempoMatcher: Handles tempo synchronization between tracks
 */
class TempoMatcher {
  constructor(options = {}) {
    this.tolerance = options.tolerance || 0.02; // 2% tolerance
  }

  /**
   * Calculate the tempo ratio needed to sync two tracks
   */
  calculateTempoRatio(bpm1, bpm2) {
    if (!bpm1 || !bpm2 || bpm1 === 0 || bpm2 === 0) {
      throw new Error('Invalid BPM values');
    }
    return bpm2 / bpm1;
  }

  /**
   * Find harmonic BPM matches (multiples/divisions)
   */
  findHarmonicMatches(bpm, searchRange = 5) {
    const matches = [];
    
    for (let i = 0.5; i <= 2; i += 0.5) {
      const harmonicBpm = Math.round(bpm * i);
      matches.push({
        bpm: harmonicBpm,
        ratio: i,
        type: i < 1 ? 'half' : i === 1 ? 'same' : 'double'
      });
    }
    
    return matches;
  }

  /**
   * Detect tempo drift and correct it
   */
  correctTempoDrift(beats, targetBpm) {
    if (beats.length < 2) return beats;

    const corrected = [];
    const targetInterval = 60 / targetBpm;
    
    for (let i = 0; i < beats.length; i++) {
      const expectedTime = i * targetInterval;
      corrected.push({
        time: expectedTime,
        energy: beats[i].energy
      });
    }
    
    return corrected;
  }

  /**
   * Check if two BPMs are close enough to sync
   */
  areCompatible(bpm1, bpm2, harmonicMatch = false) {
    const ratio = bpm2 / bpm1;
    
    if (!harmonicMatch) {
      return Math.abs(ratio - 1) < this.tolerance;
    }
    
    // Check for harmonic relationships (0.5, 1, 1.5, 2)
    const harmonics = [0.5, 1, 1.5, 2];
    return harmonics.some(h => Math.abs(ratio - h) < this.tolerance);
  }
}

module.exports = TempoMatcher;
