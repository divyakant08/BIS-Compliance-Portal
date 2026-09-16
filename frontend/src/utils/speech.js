export function getSpeechLang(language) {
  if (language === 'Hindi') return 'hi-IN';
  if (language === 'Marathi') return 'mr-IN';
  return 'en-IN';
}

export function getFemaleVoice(language, voices = []) {
  const targetPrefix = language === 'Hindi' ? 'hi' : language === 'Marathi' ? 'mr' : 'en';
  const femaleKeywords = [
    'female', 'swara', 'heera', 'kalpana', 'google हिन्दी', 'microsoft zira',
    'google uk english female', 'samantha', 'victoria', 'karen', 'zira', 'jenny',
    'aria', 'neerja', 'madhur', 'ananya', 'priya', 'aditi',
  ];

  const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(targetPrefix));
  const femaleMatch = langVoices.find((v) => femaleKeywords.some((k) => v.name.toLowerCase().includes(k)));
  if (femaleMatch) return femaleMatch;
  if (langVoices.length > 0) return langVoices[0];

  if (targetPrefix === 'mr') {
    const hiVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('hi'));
    const femaleHi = hiVoices.find((v) => femaleKeywords.some((k) => v.name.toLowerCase().includes(k)));
    return femaleHi || hiVoices[0] || null;
  }

  return voices.find((v) => v.lang.toLowerCase().startsWith('en') && femaleKeywords.some((k) => v.name.toLowerCase().includes(k)))
    || voices[0]
    || null;
}

export function cleanSpeechText(text = '') {
  return text
    .replace(/\[Doc:[^\]]+\]/g, '')
    .replace(/[*#_`>-]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

export function speakText(text, language, onStart, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanSpeechText(text));
  const voice = getFemaleVoice(language, window.speechSynthesis.getVoices() || []);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = getSpeechLang(language);
  }
  utterance.rate = 1.0;
  utterance.pitch = 1.05;
  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function createSpeechRecognition(language) {
  const SpeechRecognition = typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = getSpeechLang(language);
  return recognition;
}
