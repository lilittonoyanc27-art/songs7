/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, ChangeEvent } from 'react';
import { 
  Play, 
  Pause, 
  Search, 
  Music2, 
  Volume2, 
  SkipBack, 
  SkipForward, 
  Filter,
  ListMusic,
  Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Song {
  id: string;
  title: string;
  style: string;
  number: number;
  audioUrl: string;
  coverUrl?: string;
}

// Professional collection dataset - ready for user customization
const INITIAL_SONGS: Song[] = [
  { 
    id: '1', 
    title: 'Песня 1', 
    style: 'поп', 
    number: 1, 
    audioUrl: 'https://raw.githubusercontent.com/lilittonoyanc27-art/songs6/main/hey%20Shalom2%20copy.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253361-bee87380cf40?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '2', 
    title: 'Песня 2', 
    style: 'поп', 
    number: 2, 
    audioUrl: 'https://raw.githubusercontent.com/lilittonoyanc27-art/songs6/main/hey%20Shalom2%20%2810%29.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '3', 
    title: 'Песня 3', 
    style: 'поп', 
    number: 3, 
    audioUrl: 'https://raw.githubusercontent.com/lilittonoyanc27-art/songs6/main/hey%20Shalom2%20%2811%29.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '4', 
    title: 'Песня 4', 
    style: 'поп', 
    number: 4, 
    audioUrl: 'https://raw.githubusercontent.com/lilittonoyanc27-art/songs6/main/hey%20Shalom2%20%2813%29.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '5', 
    title: 'Песня 5', 
    style: 'поп', 
    number: 5, 
    audioUrl: 'https://raw.githubusercontent.com/lilittonoyanc27-art/songs6/main/hey%20Shalom2%20%2814%29.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '6', 
    title: 'Песня 6', 
    style: 'поп', 
    number: 6, 
    audioUrl: 'https://raw.githubusercontent.com/lilittonoyanc27-art/songs6/main/hey%20Shalom2%20%288%29.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400'
  }
];

export default function App() {
  const [songs] = useState<Song[]>(INITIAL_SONGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioError, setAudioError] = useState<string | null>(null);

  const currentSong = useMemo(() => 
    songs.find(s => s.id === currentSongId), 
    [currentSongId, songs]
  );

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStyle = !selectedStyle || song.style === selectedStyle;
      return matchesSearch && matchesStyle;
    });
  }, [songs, searchQuery, selectedStyle]);

  const styles = useMemo(() => 
    Array.from(new Set(songs.map(s => s.style))), 
    [songs]
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSongId && isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Playback error:', error.message || error);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [currentSongId, isPlaying]);

  const togglePlay = (id?: string) => {
    setAudioError(null);
    if (id && id !== currentSongId) {
      setCurrentSongId(id);
      setIsPlaying(true);
      return;
    }
    
    if (!currentSongId && songs.length > 0) {
      setCurrentSongId(songs[0].id);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const val = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(val) ? 0 : val);
    }
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (nextProgress / 100) * audioRef.current.duration;
      setProgress(nextProgress);
    }
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSongId);
    if (currentIndex < songs.length - 1) {
      setCurrentSongId(songs[currentIndex + 1].id);
    } else {
      setCurrentSongId(songs[0].id);
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSongId);
    if (currentIndex > 0) {
      setCurrentSongId(songs[currentIndex - 1].id);
    } else {
      setCurrentSongId(songs[songs.length - 1].id);
    }
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen relative bg-[#0a0502] text-gray-100 font-sans selection:bg-amber-500/30">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="immersive-glow immersive-glow-top" />
        <div className="immersive-glow immersive-glow-bottom" />
        
        {/* Stylized Instrument Strings */}
        <div className="instrument-strings">
          <div className="string-line" />
          <div className="string-line" />
          <div className="string-line" />
          <div className="string-line" />
          <div className="string-line" />
        </div>
      </div>
      
      <main className="relative z-10 container mx-auto px-8 py-10 pb-40">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-3xl font-light tracking-widest uppercase text-amber-500 mb-1">
              Song Collection
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Digital Archive v2.4</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search by title..." 
                className="bg-white/5 border border-white/10 rounded-full py-2.5 px-6 w-full md:w-72 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm backdrop-blur-md transition-all group-focus-within:bg-white/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
            </div>
          </div>
        </header>

        {/* Filter Bar */}
        <nav className="flex flex-wrap gap-3 mb-12">
          <button 
            onClick={() => setSelectedStyle(null)}
            className={`btn-pill ${!selectedStyle ? 'btn-pill-active' : 'btn-pill-inactive'}`}
          >
            All
          </button>
          {styles.map(style => (
            <button 
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`btn-pill ${selectedStyle === style ? 'btn-pill-active' : 'btn-pill-inactive'}`}
            >
              {style}
            </button>
          ))}
        </nav>

        {/* Main Gallery Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSongs.map((song, index) => (
              <motion.div 
                layout
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group relative glass-morphism rounded-2xl p-6 backdrop-blur-xl flex flex-col hover:bg-white/10 transition-all duration-500 min-h-[220px] ${currentSongId === song.id ? 'ring-1 ring-amber-500/50 bg-white/10' : ''}`}
                onClick={() => togglePlay(song.id)}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[40px] font-light leading-none tracking-tighter transition-colors duration-500 ${currentSongId === song.id ? 'text-amber-500/20' : 'text-white/10'}`}>
                    {song.number.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded border border-amber-500/30 text-amber-500 uppercase tracking-widest font-semibold">
                    {song.style}
                  </span>
                </div>
                
                <h3 className="text-xl font-medium mb-1 truncate text-white">
                  {song.title}
                </h3>
                <p className="text-xs text-gray-500 mb-6 uppercase tracking-wider">
                  {currentSongId === song.id && isPlaying ? 'Now Playing' : 'Standard Collection'}
                </p>

                <div className="mt-auto flex flex-col gap-4">
                  <button 
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 shadow-lg cursor-pointer ${
                      currentSongId === song.id && isPlaying 
                      ? 'bg-white text-black shadow-white/10' 
                      : 'bg-amber-600 hover:bg-amber-500 text-black shadow-amber-600/20'
                    }`}
                  >
                    {currentSongId === song.id && isPlaying ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    )}
                  </button>
                  
                  {song.audioUrl && (
                    <audio 
                      controls 
                      preload="none"
                      src={song.audioUrl} 
                      className="w-full h-8 opacity-40 hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {filteredSongs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500 italic">
            <p className="text-lg tracking-widest uppercase opacity-40">Archive Empty</p>
          </div>
        )}
      </main>

      {/* Persistence Audio Element */}
      <audio 
        key={currentSongId || 'none'}
        ref={audioRef}
        src={currentSong?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onError={(e) => {
          const target = e.target as HTMLAudioElement;
          console.error('Audio execution error for source:', target.src);
          setAudioError('Failed to load audio source. The link may be broken or restricted.');
          setIsPlaying(false);
        }}
        onPlay={() => setAudioError(null)}
        preload="auto"
      />

      {/* Persistent Audio Player */}
      <AnimatePresence>
        {currentSong && (
          <motion.footer 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            className="fixed bottom-0 inset-x-0 z-50 h-28 bg-black/80 backdrop-blur-3xl border-t border-white/10 px-8 py-2 flex flex-col md:flex-row items-center gap-4 transition-all"
          >
            <div className="flex items-center gap-4 w-full md:w-1/4 relative">
              <div className={`w-14 h-14 bg-amber-900/30 rounded-lg flex items-center justify-center border border-amber-500/20 flex-shrink-0 transition-all duration-500 ${isPlaying ? 'scale-105 border-amber-500/50 shadow-lg shadow-amber-500/10' : ''}`}>
                <Music2 className={`w-8 h-8 ${isPlaying ? 'text-amber-500' : 'text-amber-500/40'}`} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-widest truncate">{currentSong.style}</p>
              </div>
              <AnimatePresence>
                {audioError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-14 left-0 right-[-100px] md:right-0 bg-red-950/90 border border-red-500/50 text-red-200 text-[10px] py-2 px-3 rounded-xl backdrop-blur-xl shadow-2xl z-[60]"
                  >
                    <p className="font-bold mb-0.5">Playback Error</p>
                    <p className="opacity-80 leading-tight">The source link might be private or restricted.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 flex flex-col items-center w-full max-w-xl mx-auto space-y-3">
              <div className="flex items-center gap-8">
                <button onClick={handlePrev} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                  <SkipBack size={20} fill="currentColor" />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
                >
                  {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={handleNext} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                  <SkipForward size={20} fill="currentColor" />
                </button>
              </div>
              <div className="w-full flex items-center gap-3 px-4">
                <span className="text-[10px] text-gray-500 font-mono w-8 text-right">
                  {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ":" + Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : "0:00"}
                </span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full relative group cursor-pointer">
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%`, marginLeft: '-6px' }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-mono w-8">
                   {audioRef.current && !isNaN(audioRef.current.duration) ? Math.floor(audioRef.current.duration / 60) + ":" + Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0') : "0:00"}
                </span>
              </div>
            </div>

            <div className="hidden md:flex w-1/4 justify-end items-center gap-4">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <div className="w-24 h-1.5 bg-white/10 rounded-full relative group">
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="h-full bg-white/60 rounded-full transition-all"
                  style={{ width: `${volume * 100}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${volume * 100}%`, marginLeft: '-5px' }}
                />
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}

