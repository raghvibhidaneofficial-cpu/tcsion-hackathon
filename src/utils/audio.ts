import { Language } from '../types/flood';

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  lang: Language,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleanText = text.replace(/[*_#`[\]()]/g, ' ').trim();
  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Set voice and language code
  if (lang === 'hi') {
    utterance.lang = 'hi-IN';
  } else if (lang === 'mr') {
    utterance.lang = 'mr-IN'; // Falls back to hi-IN if mr-IN not installed on device
  } else {
    utterance.lang = 'en-IN';
  }

  utterance.rate = 0.95; // Slightly slower for clear emergency announcements
  utterance.pitch = 1.0;

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  return window.speechSynthesis.speaking;
}
