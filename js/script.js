//NOTE - DOMHandler
const DOMHandler = (() => {
  function $(selector) {
    return document.querySelector(selector);
  }
  function $$(selector) {
    return document.querySelectorAll(selector);
  }

  return {
    rangeInput: $('#length'),
    passwordInput: $('#password'),
    buttonCopy: $('.copy'),
    lengthText: $('.length'),
    buttonGenerate: $('.gener'),
    tough: $('.tough'),
    copyText: $('.copy-text'),
    inputs: $$('input[type="checkbox"]'),
    bars: $$('.bar')
  };
})();

//NOTE - обробник для range input
DOMHandler.rangeInput.addEventListener('input', function () {
  const value = parseInt(DOMHandler.rangeInput.value, 10);
  const min = parseInt(DOMHandler.rangeInput.min, 10);
  const max = parseInt(DOMHandler.rangeInput.max, 10);
  const percentage = ((value - min) * 100) / (max - min);
  DOMHandler.rangeInput.style.background = 'linear-gradient(to right, #A4FFAF ' + percentage + '%, #18171F ' + percentage + '%)';
  DOMHandler.lengthText.textContent = value;
});

//NOTE - CharacterHandler
const CharacterHandler = (() => {
  const symbols = [
    "~", "", "!", "@", "#", "$", "%", "^", "&", "*",
    "(", ")", "_", "-", "+", "=", "{", "}", "[", "]",
    "|", ":", ";", "'", "<", ">", ",", ".", "?", "/"
  ];
  const numbers = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
  ];
  const lowercase = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z"
  ];
  const uppercase = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
  ];

  function getAvailableCharacters(options) {
    let result = [];
    if (options.symbols) {
      for (let i = 0; i < symbols.length; i++) {
        result.push(symbols[i]);
      }
    }
    if (options.number) {
      for (let i = 0; i < numbers.length; i++) {
        result.push(numbers[i]);
      }
    }
    if (options.lowercase) {
      for (let i = 0; i < lowercase.length; i++) {
        result.push(lowercase[i]);
      }
    }
    if (options.uppercase) {
      for (let i = 0; i < uppercase.length; i++) {
        result.push(uppercase[i]);
      }
    }
    return result;
  }

  return { getAvailableCharacters };
})();

//NOTE - PasswordGenerator
const PasswordGenerator = (() => {
  function generatePassword(length, options) {
    const availableCharacters = CharacterHandler.getAvailableCharacters(options);
    if (availableCharacters.length === 0) return '';

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableCharacters.length);
      password += availableCharacters[randomIndex];
    }
    return password;
  }

  return { generatePassword };
})();

//NOTE - основний модуль App
const App = (() => {
  const options = {
    lowercase: false,
    uppercase: false,
    number: false,
    symbols: false
  };

  function updatePassword() {
    for (let i = 0; i < DOMHandler.inputs.length; i++) {
      const input = DOMHandler.inputs[i];
      options[input.id] = input.checked;
    }

    if (!options.lowercase && !options.uppercase && !options.number && !options.symbols) {
      DOMHandler.passwordInput.value = '';
      for (let i = 0; i < DOMHandler.bars.length; i++) {
        DOMHandler.bars[i].className = 'bar'; 
      }
      DOMHandler.tough.textContent = '';
      return;
    }

    const length = parseInt(DOMHandler.rangeInput.value, 10);
    DOMHandler.lengthText.textContent = length;

    for (let i = 0; i < DOMHandler.bars.length; i++) {
      DOMHandler.bars[i].className = 'bar';
    }

    let strengthClass = '';
    let strengthText = '';
    if (length >= 17) {
      strengthClass = 'hard';
      strengthText = 'Hard';
    } else if (length >= 13) {
      strengthClass = 'medium';
      strengthText = 'Medium';
    } else if (length >= 9) {
      strengthClass = 'weak';
      strengthText = 'Weak';
    } else if (length >= 6) {
      strengthClass = 'too-weak';
      strengthText = 'Too Weak';
    }

    DOMHandler.tough.textContent = strengthText;
    if (strengthClass) {
      const strengthLevelsMap = { 'hard': 4, 'medium': 3, 'weak': 2, 'too-weak': 1 };
      for (let i = 0; i < strengthLevelsMap[strengthClass]; i++) {
        DOMHandler.bars[i].classList.add(strengthClass);
      }
    }

    DOMHandler.passwordInput.value = PasswordGenerator.generatePassword(length, options);
  }

  function copyPassword() {
    const password = DOMHandler.passwordInput.value;
    if (password) {
      navigator.clipboard.writeText(password).then(function () {
        DOMHandler.copyText.textContent = 'copied';
        DOMHandler.copyText.classList.add('copied');
        setTimeout(function () {
          DOMHandler.copyText.classList.remove('copied');
          DOMHandler.copyText.textContent = '';
        }, 2000);
      }).catch(function (err) {
        console.error('Failed to copy: ', err);
      });
    }
  }

  function init() {
    DOMHandler.buttonCopy.addEventListener('click', copyPassword);
    DOMHandler.buttonGenerate.addEventListener('click', updatePassword);
  }

  return { init };
})();

App.init();