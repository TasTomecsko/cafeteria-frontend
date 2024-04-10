import { defineStore } from "pinia";
import english from '@/assets/languages/english.json';
import german from '@/assets/languages/german.json';
import hungarian from '@/assets/languages/hungarian.json';

export const useLanguageStore = defineStore({
    id: 'language',
    state: () => {
        return {
            languageFile: localStorage.getItem('langFile') ? JSON.parse(localStorage.getItem('langFile')!) : hungarian
        }
    },
    actions: {
        setPageLanguage(lang: string) {            
            switch(lang) {
                case('english'): {
                    localStorage.removeItem('langFile');
                    this.languageFile = english;
                    localStorage.setItem('langFile', JSON.stringify(english));
                    break;
                }
                case('hungarian'): {
                    localStorage.removeItem('langFile');
                    this.languageFile = hungarian;
                    localStorage.setItem('langFile', JSON.stringify(hungarian));
                    break;
                }
                case('german'): {
                    localStorage.removeItem('langFile');
                    this.languageFile = german;
                    localStorage.setItem('langFile', JSON.stringify(german));
                    break;
                }
            }
        }
    }
})