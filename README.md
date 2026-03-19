# djay Music Sync Engine

A JavaScript library for music synchronization, featuring beat detection, tempo matching, and audio alignment algorithms optimized for DJ remixing.

## Features

- **Beat Detection**: Analyzes audio to identify beats using energy-based peak detection
- **BPM Calculation**: Automatically calculates tempo from detected beats
- **Tempo Matching**: Synchronizes playback speeds between multiple tracks
- **Harmonic BPM Detection**: Finds harmonic relationships between tracks (half-time, double-time)
- **Audio Alignment**: Aligns tracks with phase and time-shift corrections
- **Time-Stretching**: Non-destructive tempo adjustment
- **Crossfading**: Professional audio transitions between tracks

## Installation

```bash
npm install djay-music-sync
```

## Usage

### Basic Synchronization

```javascript
const MusicSyncEngine = require('djay-music-sync');

const syncEngine = new MusicSyncEngine();

// Analyze two audio tracks
const sync1 = await syncEngine.analyzeAudio(audioBuffer1);
const sync2 = await syncEngine.analyzeAudio(audioBuffer2);

console.log(`Track 1 BPM: ${sync1.bpm}`);
console.log(`Track 2 BPM: ${sync2.bpm}`);

// Synchronize tracks
const syncedTracks = syncEngine.syncTracks(
  audioBuffer1,
  audioBuffer2,
  sync1,
  sync2
);
```

### Tempo Matching

```javascript
// Check if two tempos are compatible
const compatible = syncEngine.tempoMatcher.areCompatible(120, 240);
console.log(`Compatible: ${compatible}`); // true (harmonic match)

// Find harmonic matches
const matches = syncEngine.tempoMatcher.findHarmonicMatches(120);
matches.forEach(m => console.log(`${m.bpm} BPM (${m.type}`));
```

### Detecting Tempo Drift

```javascript
// Correct tempo drift
const correctedBeats = syncEngine.tempoMatcher.correctTempoDrift(beats, 120);
```

## API Reference

### MusicSyncEngine

#### `analyzeAudio(audioBuffer)`
- **Parameters**: `audioBuffer` (Float32Array)
- **Returns**: `{ beats: Array, bpm: Number }`
- Analyzes audio and returns detected beats and calculated BPM

#### `matchTempo(track1BPM, track2BPM)`
- **Parameters**: `track1BPM` (Number), `track2BPM` (Number)
- **Returns**: `ratio` (Number)
- Calculates the playback speed ratio needed to sync two tracks

#### `syncTracks(track1, track2, track1Sync, track2Sync)`
- **Parameters**: Audio buffers and sync parameters
- **Returns**: Object with aligned track information and playback parameters

### BeatDetector

#### `detect(audioBuffer)`
- Detects beats in audio using energy analysis

#### `calculateBPM(beats)`
- Calculates BPM from beat array

### TempoMatcher

#### `findHarmonicMatches(bpm, searchRange)`
- Finds harmonic tempo relationships

#### `areCompatible(bpm1, bpm2, harmonicMatch)`
- Checks if two tempos can be synced

### AudioSync

#### `timeStretch(audioBuffer, sourceBpm, targetBpm)`
- Time-stretches audio to target tempo

#### `crossfade(buffer1, buffer2, fadeDuration)`
- Creates smooth transitions between audio

## Configuration

```javascript
const BeatDetector = require('djay-music-sync/src/beatDetector');
const detector = new BeatDetector({
  threshold: 0.3,      // Energy threshold for beat detection (0-1)
  minBPM: 60,          // Minimum BPM
  maxBPM: 200,         // Maximum BPM
  sampleRate: 44100    // Audio sample rate
});
```

## License

MIT

## Contributing

Contributions are welcome! Please submit pull requests or open issues for bugs and feature requests.
