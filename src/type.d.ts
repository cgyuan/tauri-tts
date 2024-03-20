interface Voice {
  id: string;
  name: string;
}

interface Language {
  lang: string;
  name: string;
  voices: Voice[];
}