/*  Lang Parser JavaScript Framework, version 0.1.0
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

        _defaultAttrsByTagName: {
            'INPUT':    't p n v',
            'A':        't tc',
            'BUTTON':   't tc',
            'LABEL':    't tc',
            'SPAN':     't tc',
            'IMG':      'a img t',
            'LI':       't tc',
            'P':        'tc',
        },

        _langAttrTypes: {
            a:          'alt',
            t:          'title',
            p:          'placeholder',
            n:          'name',
            tc:         'textContent',
            v:          'value'
        },

        setDefaultLanguage: function (lang) {
            this._defaultLang = lang;
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
                if(!attrs.contains('-')) {
                    attrs = attrs.split(' ').filter(function(el){return el.length !== 0});
                } else {
                    return false;
                }
            } else {
                attrs = this._defaultAttrsByTagName[el.tagName].split(' ').filter(function(e){return e.length !== 0});
            }
            console.log(el.dataset.lpfVar, el.dataset.lpfAttrs, attrs);
            return attrs;
        },

        translateContent: function(translations, containerName) {
            var elementsToTranslate = [];
            
            if(containerName) {
                var containers = document.querySelectorAll('[data-lpf-container=' + containerName + ']');
                for(var i = 0; i < containers.length; i++) {
                    var els = containers[i].querySelectorAll('[data-lpf-var]');
                    elementsToTranslate = elementsToTranslate.concat(Array.prototype.slice.call(els));
                }
            } else {
                elementsToTranslate = document.querySelectorAll('[data-lpf-var]');
            }

            for (var i = 0; i < elementsToTranslate.length; i++) {
                var langVar = elementsToTranslate[i].dataset.lpfVar,
                    langAttrs = this._getAttributes(elementsToTranslate[i]),
                    langStrFormat = elementsToTranslate[i].dataset.lpfFormat,
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
        },
    };
}());