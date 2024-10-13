// NOTE - DOMHandler
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

// NOTE - обробник для range input
DOMHandler.rangeInput.addEventListener('input', function () {
  const value = parseInt(DOMHandler.rangeInput.value, 10);
  const min = parseInt(DOMHandler.rangeInput.min, 10);
  const max = parseInt(DOMHandler.rangeInput.max, 10);
  const percentage = ((value - min) * 100) / (max - min);
  DOMHandler.rangeInput.style.background = `linear-gradient(to right, #A4FFAF ${percentage}%, #18171F ${percentage}%)`;
  DOMHandler.lengthText.textContent = value;
});

// NOTE - CharacterHandler
const CharacterHandler = (() => {
  const symbols = "~!@#$%^&*()_-+={}[]|:;'<>,.?/".split('');
  const numbers = "0123456789".split('');
  const lowercase = "abcdefghijklmnopqrstuvwxyz".split('');
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  function getAvailableCharacters(options) {
    return [
      ...(options.symbols ? symbols : []),
      ...(options.number ? numbers : []),
      ...(options.lowercase ? lowercase : []),
      ...(options.uppercase ? uppercase : [])
    ];
  }

  return { getAvailableCharacters };
})();

// NOTE - PasswordGenerator
const PasswordGenerator = (() => {
  function generatePassword(length, options) {
    const availableCharacters = CharacterHandler.getAvailableCharacters(options);
    if (availableCharacters.length === 0) return '';

    const password = new Array(length);
    const availableLength = availableCharacters.length;
    for (let i = 0; i < length; i++) {
      password[i] = availableCharacters[Math.floor(Math.random() * availableLength)];
    }
    return password.join('');
  }

  return { generatePassword };
})();

// NOTE - основний модуль App
const App = (() => {
  const options = {
    lowercase: false,
    uppercase: false,
    number: false,
    symbols: false
  };

  function updatePassword() {
    for (const input of DOMHandler.inputs) {
      options[input.id] = input.checked;
    }

    if (!Object.values(options).some(Boolean)) {
      DOMHandler.passwordInput.value = '';
      DOMHandler.bars.forEach(bar => bar.className = 'bar');
      DOMHandler.tough.textContent = '';
      return;
    }

    const length = parseInt(DOMHandler.rangeInput.value, 10);
    DOMHandler.lengthText.textContent = length;

    DOMHandler.bars.forEach(bar => bar.className = 'bar');

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
      const strengthLevels = { 'hard': 4, 'medium': 3, 'weak': 2, 'too-weak': 1 };
      DOMHandler.bars.forEach((bar, index) => {
        if (index < strengthLevels[strengthClass]) {
          bar.classList.add(strengthClass);
        }
      });
    }

    DOMHandler.passwordInput.value = PasswordGenerator.generatePassword(length, options);
  }

  function copyPassword() {
    const password = DOMHandler.passwordInput.value;
    if (password) {
      navigator.clipboard.writeText(password).then(() => {
        DOMHandler.copyText.textContent = 'copied';
        DOMHandler.copyText.classList.add('copied');
        setTimeout(() => {
          DOMHandler.copyText.classList.remove('copied');
          DOMHandler.copyText.textContent = '';
        }, 2000);
      }).catch(err => console.error('Failed to copy: ', err));
    }
  }

  function init() {
    DOMHandler.buttonCopy.addEventListener('click', copyPassword);
    DOMHandler.buttonGenerate.addEventListener('click', updatePassword);
  }

  return { init };
})();

App.init();