/**
 * AudioSync: Handles audio alignment and time-stretching
 */
class AudioSync {
  constructor(options = {}) {
    this.sampleRate = options.sampleRate || 44100;
  }

  /**
   * Align two audio tracks based on sync parameters
   */
  align(track1, track2, sync1, sync2) {
    const tempoRatio = sync2.bpm / sync1.bpm;
    const timeShift = this.calculateTimeShift(sync1.beats, sync2.beats);
    
    return {
      track1: {
        buffer: track1,
        offset: 0,
        playbackRate: 1.0
      },
      track2: {
        buffer: track2,
        offset: timeShift,
        playbackRate: tempoRatio
      },
      alignment: {
        tempoRatio,
        timeShift,
        phase: this.calculatePhase(sync1.beats, sync2.beats)
      }
    };
  }

  /**
   * Calculate time shift between two beat sequences
   */
  calculateTimeShift(beats1, beats2) {
    if (beats1.length === 0 || beats2.length === 0) {
      return 0;
    }
    
    return beats2[0].time - beats1[0].time;
  }

  /**
   * Calculate phase offset between tracks
   */
  calculatePhase(beats1, beats2) {
    const interval1 = beats1.length > 1 ? beats1[1].time - beats1[0].time : 0;
    const interval2 = beats2.length > 1 ? beats2[1].time - beats2[0].time : 0;
    
    if (interval1 === 0 || interval2 === 0) return 0;
    
    const phase = ((beats2[0].time - beats1[0].time) % interval1) / interval1;
    return Math.max(0, Math.min(1, phase));
  }

  /**
   * Time-stretch audio buffer to match target BPM
   */
  timeStretch(audioBuffer, sourceBpm, targetBpm) {
    const ratio = targetBpm / sourceBpm;
    const newLength = Math.round(audioBuffer.length / ratio);
    const stretched = new Float32Array(newLength);
    
    for (let i = 0; i < newLength; i++) {
      const sourceIndex = Math.floor(i * ratio);
      if (sourceIndex < audioBuffer.length) {
        stretched[i] = audioBuffer[sourceIndex];
      }
    }
    
    return stretched;
  }

  /**
   * Apply crossfade between two audio buffers
   */
  crossfade(buffer1, buffer2, fadeDuration = 2, sampleRate = 44100) {
    const fadeSamples = fadeDuration * sampleRate;
    const output = new Float32Array(buffer1.length);
    
    // Copy and fade first buffer
    for (let i = 0; i < buffer1.length; i++) {
      if (i < fadeSamples) {
        const gain = i / fadeSamples;
        output[i] = buffer1[i] * (1 - gain);
      } else {
        output[i] = buffer1[i];
      }
    }
    
    // Add faded second buffer
    for (let i = 0; i < buffer2.length && i < fadeSamples; i++) {
      const gain = i / fadeSamples;
      const outputIndex = buffer1.length - fadeSamples + i;
      if (outputIndex >= 0 && outputIndex < output.length) {
        output[outputIndex] = (output[outputIndex] || 0) + buffer2[i] * gain;
      }
    }
    
    return output;
  }
}

module.exports = AudioSync;
