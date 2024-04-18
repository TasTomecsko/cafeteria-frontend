import { defineStore } from "pinia";
import english from '@/assets/languages/english.json';
import german from '@/assets/languages/german.json';
import hungarian from '@/assets/languages/hungarian.json';

export const useLanguageStore = defineStore({
    id: 'language',
    state: () => {
        return {
            languageFile: localStorage.getItem('langFile') ? JSON.parse(localStorage.getItem('langFile')!) : hungarian,
            languageId: localStorage.getItem('langId') ? JSON.parse(localStorage.getItem('langId')!) : "hu"
        }
    },
    actions: {
        setPageLanguage(lang: string) {            
            switch(lang) {
                case('english'): {
                    localStorage.removeItem('langFile');
                    localStorage.removeItem('langId');

                    this.languageFile = english;

                    localStorage.setItem('langFile', JSON.stringify(english));
                    localStorage.setItem('langId', JSON.stringify("eng"));
                    break;
                }
                case('hungarian'): {
                    localStorage.removeItem('langFile');
                    localStorage.removeItem('langId');

                    this.languageFile = hungarian;

                    localStorage.setItem('langId', JSON.stringify("hu"));
                    localStorage.setItem('langFile', JSON.stringify(hungarian));
                    break;
                }
                case('german'): {
                    localStorage.removeItem('langFile');
                    localStorage.removeItem('langId');

                    this.languageFile = german;

                    localStorage.setItem('langId', JSON.stringify("ge"));
                    localStorage.setItem('langFile', JSON.stringify(german));
                    break;
                }
            }
        }
    }
})