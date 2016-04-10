/*
Copyright 2008-2013 Concur Technologies, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License. You may obtain
a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations
under the License.
*/
(function (global) {
  'use strict';

  var languages = {};

  global.setupLanguages = setupLanguages;
  global.activateLanguage = activateLanguage;

  function scrollElmVert(el,num) { // to scroll up use a negative number
    var re=/html$/i;
    while(!re.test(el.tagName) && (1 > el.scrollTop)) el=el.parentNode;
    if(0 < el.scrollTop) el.scrollTop += num;
  }

  function activateLanguage(languageTag) {
    if (!languageTag) return;
    if (languageTag === "") return;

    $(".lang-selector a").removeClass('active');
    $(".lang-selector a[data-language-name='" + languageTag + "']").addClass('active');
    $.each(languages, function (tag, lang) {
        $(lang.selector).hide();
    });
    if (languages[languageTag]) {
        $(languages[languageTag].selector).show();
    }

    global.toc.calculateHeights();

    // scroll to the new location of the position
    if ($(window.location.hash).get(0)) {
      $(window.location.hash).get(0).scrollIntoView();
      scrollElmVert($(window.location.hash).get(0), -130);
    }
  }

  // parseURL and stringifyURL are from https://github.com/sindresorhus/query-string
  // MIT licensed
  // https://github.com/sindresorhus/query-string/blob/7bee64c16f2da1a326579e96977b9227bf6da9e6/license
  function parseURL(str) {
    if (typeof str !== 'string') {
      return {};
    }

    str = str.trim().replace(/^(\?|#|&)/, '');

    if (!str) {
      return {};
    }

    return str.split('&').reduce(function (ret, param) {
      var parts = param.replace(/\+/g, ' ').split('=');
      var key = parts[0];
      var val = parts[1];

      key = decodeURIComponent(key);
      // missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
      val = val === undefined ? null : decodeURIComponent(val);

      if (!ret.hasOwnProperty(key)) {
        ret[key] = val;
      } else if (Array.isArray(ret[key])) {
        ret[key].push(val);
      } else {
        ret[key] = [ret[key], val];
      }

      return ret;
    }, {});
  };

  function stringifyURL(obj) {
    return obj ? Object.keys(obj).sort().map(function (key) {
      var val = obj[key];

      if (Array.isArray(val)) {
        return val.sort().map(function (val2) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
        }).join('&');
      }

      return encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }).join('&') : '';
  };

  // gets the language set in the query string
  function getLanguageFromQueryString() {
    if (location.search.length >= 1) {
      var language = parseURL(location.search).language
      if (language) {
        return language;
      } else if (jQuery.inArray(location.search.substr(1), languages) != -1) {
        return location.search.substr(1);
      }
    }

    return false;
  }

  // returns a new query string with the new language in it
  function generateNewQueryString(language) {
    var url = parseURL(location.search);
    if (url.language) {
      url.language = language;
      return stringifyURL(url);
    }
    return language;
  }

  // if a button is clicked, add the state to the history
  function pushURL(codeTab) {
    if (!history) { return; }
    var hash = window.location.hash;
    if (hash) {
      hash = hash.replace(/^#+/, '');
    }
    history.pushState({}, '', '?' + generateNewQueryString(codeTab) + '#' + hash);

    // save language as next default
    localStorage.setItem("language", codeTab);
  }

  function setupLanguages(l) {
    var defaultLanguage = localStorage.getItem("language");

    $.each(l, function (k, lang) {
        if (!defaultLanguage) {
            defaultLanguage = lang.tag;
        }
        languages[lang.tag] = {label: lang.label, selector: lang.selector};
    })

    var presetLanguage = getLanguageFromQueryString();
    if (presetLanguage) {
      // the language is in the URL, so use that language!
      activateLanguage(presetLanguage);

      localStorage.setItem("language", presetLanguage);
  } else if ((defaultLanguage !== null) && languages[defaultLanguage] !== undefined) {
      // the language was the last selected one saved in localstorage, so use that language!
      activateLanguage(defaultLanguage);
    }
  }

  // if we click on a language tab, activate that language
  $(function() {
    var langSelector = $('.lang-selector')[1];
    var els = $('pre, blockquote, section');
    var validEls = [];

    $.each(els, function(k, el) {
     if( !$(el).prev().is('pre') && !$(el).prev().is('blockquote') && !$(el).prev().is('section') && !$(el).prev().is('aside')) {
       validEls.push(el)
     }
    })

    $.each(validEls, function(k, el) {
       $(el).before($(langSelector).clone().css('float', 'right').css('position', 'relative'));
    });

    $(langSelector).remove()

    $(".lang-selector a").on("click", function() {
      var languageTag = $(this).data("language-name");
      pushURL(languageTag);
      activateLanguage(languageTag);
      return false;
    });
    window.onpopstate = function() {
      activateLanguage(getLanguageFromQueryString());
    };
  });
})(window);
