/*  Lang Parser JavaScript Framework, version 0.2.0
 *  2015 Guillem Palomar
 *--------------------------------------------------------------------------*/

var LangParser = (function() {

    'use strict';

    if ( !String.prototype.contains ) {
        String.prototype.contains = function(it) {
            return this.indexOf(it) != -1;
        };
    }

    if ( !String.prototype.capitalizeString ) {
        String.prototype.capitalizeString = function() {
            return this.toLowerCase().charAt(0).toUpperCase() +  this.toLowerCase().slice(1);
        };
    }

    return {
        version: '0.1',

        _defaultLang:   'EN',

        currentLang: 'EN',

        _defaultAttrsByTagName: {
            'INPUT':    't p n v',
            'A':        't tc',
            'BUTTON':   't tc',
            'LABEL':    't tc',
            'SPAN':     't tc',
            'LI':       't tc',
            'P':        'tc',
            'IMG':      'a'
        },

        _langAttrTypes: {
            a:          'alt',
            t:          'title',
            p:          'placeholder',
            n:          'name',
            tc:         'textContent',
            v:          'value'
        },

        _inititalTranslationsLoaded: false,

        setDefaultLanguage: function (lang) {
            this._defaultLang = lang;
            this.currentLang = this._defaultLang;
        },

        langStrFormats: function (type, string) {
            switch(type) {
                case 'cap':
                    return string.capitalizeString();
                case 'lower':
                    return string.toLowerCase();
                case 'upper':
                    return string.toUpperCase();
                case '':
                case 'normal':
                default:
                    return string;
            }
        },

        _getAttributes: function (el) {
            var attrs = el.dataset.lpfAttrs;
            
            if (attrs) {
                attrs = attrs.trim();
                if(!attrs.contains('-')) {
                    attrs = attrs.split(' ').filter(function(el){return el.length !== 0});
                } else {
                    return false;
                }
            } else {
                attrs = this._defaultAttrsByTagName[el.tagName].split(' ').filter(function(e){return e.length !== 0});
            }
            return attrs;
        },

        setDefaultCurrentContainersLang: function() {
            var containers = document.querySelectorAll('[data-lpf-container]');
            for(var i = 0; i < containers.length; i++) {
                containers[i].dataset.lpfContainerCurrLang = LangParser.currentLang;
            }
        },

        _getFormat: function (el) {
            var format = el.dataset.lpfFormat;
            return (format)?format.trim():'';
        },

        translateContent: function(translations, containerName) {
            var elementsToTranslate = [];
            
            if(containerName) {
                var containers = document.querySelectorAll('[data-lpf-container=' + containerName + ']');
                for(var i = 0; i < containers.length; i++) {
                    var els = containers[i].querySelectorAll('[data-lpf-var]');
                    for(var j = 0; j < els.length; j++) {
                        if(!(els[j].dataset.lpfTranslate === 'initial' && this._inititalTranslationsLoaded)) {
                            elementsToTranslate.push(els[j]);
                        }
                    }
                }
            } else {
                elementsToTranslate = document.querySelectorAll('[data-lpf-var]');
            }

            for (var i = 0; i < elementsToTranslate.length; i++) {
                var langVar = elementsToTranslate[i].dataset.lpfVar.trim(),
                    langAttrs = this._getAttributes(elementsToTranslate[i]),
                    langStrFormat = this._getFormat(elementsToTranslate[i]),
                    keyTranslated = translations[langVar];
                if(langAttrs) {
                    if (keyTranslated) {
                        for (var j = 0; j < langAttrs.length; j++) {
                            if (langAttrs[j] !== '') {
                                var attrReplaced = this._langAttrTypes[langAttrs[j]];
                                if (attrReplaced) {
                                    elementsToTranslate[i][attrReplaced] = this.langStrFormats(langStrFormat, keyTranslated);
                                }
                            }
                        }
                    } else {
                        console.log("Translation for " + elementsToTranslate[i].dataset.lpfVar + " key not found.");
                    }
                }
            }
            this._inititalTranslationsLoaded = true;
            //console.log(this.currentLang);
        },
    };
}());