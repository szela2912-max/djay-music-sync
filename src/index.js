const BeatDetector = require('./beatDetector');
const TempoMatcher = require('./tempoMatcher');
const AudioSync = require('./audioSync');

class MusicSyncEngine {
  constructor() {
    this.beatDetector = new BeatDetector();
    this.tempoMatcher = new TempoMatcher();
    this.audioSync = new AudioSync();
  }

  /**
   * Analyze audio file and extract sync parameters
   */
  async analyzeAudio(audioBuffer) {
    const beats = await this.beatDetector.detect(audioBuffer);
    const bpm = this.beatDetector.calculateBPM(beats);
    return { beats, bpm };
  }

  /**
   * Match tempo between two tracks
   */
  matchTempo(track1BPM, track2BPM) {
    const ratio = this.tempoMatcher.calculateTempoRatio(track1BPM, track2BPM);
    return ratio;
  }

  /**
   * Synchronize two audio tracks
   */
  syncTracks(track1, track2, track1Sync, track2Sync) {
    return this.audioSync.align(track1, track2, track1Sync, track2Sync);
  }
}

module.exports = MusicSyncEngine;
