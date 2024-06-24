import { englishWords } from "./english-words";

const words = [...new Set(englishWords)];

export function replaceWordsToSpeechLanguageSSML(
  str: string,
  language: string
) {
  for (let i = 0; i < words.length; i++) {
    const regex = new RegExp("\\b" + words[i] + "\\b", "gi"); // Cria um novo objeto RegExp para cada palavra
    str = str.replace(
      regex,
      `<lang xml:lang="${language}">${words[i].toLowerCase()}</lang>`
    ); // Substitui a palavra na string
  }
  return str;
}
