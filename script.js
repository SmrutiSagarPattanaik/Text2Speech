const main = document.querySelector('main');
const voicesSelect = document.getElementById('voices');
const textarea = document.getElementById('text');
const readBtn = document.getElementById('read');
const toggleBtn = document.getElementById('toggle');
const closeBtn = document.getElementById('close');

const data = [
    {
        image: 'images/drinking.jpg',
        text: 'I am thirsty'
    },
    {
        image: 'images/hungry.jpg',
        text: 'I am hungry'
    },
    {
        image: 'images/tired.jpg',
        text: 'I am tired'
    },
    {
        image: 'images/hurt.jpg',
        text: 'I am hurt'
    },
    {
        image: 'images/happy.jpg',
        text: 'I am happy'
    },
    {
        image: 'images/angry.jpg',
        text: 'I am angry'
    },
    {
        image: 'images/sad.jpg',
        text: 'I am sad'
    },
    {
        image: 'images/scared.jpg',
        text: 'I am scared'
    },
    {
        image: 'images/outside.jpg',
        text: 'I want to go outside'
    },
];

data.forEach(createBox);

// create speech boxes
function createBox(item) {
    const box = document.createElement('div');
    const {image, text} = item;
    box.classList.add('box');
    box.innerHTML = `
        <img src="${image}" alt="${text}">
        <p class="info">${text}</p>
    `;

    box.addEventListener('click',()=> {
        setTextMessage(text);
        speakText();

        // add active class to box you selected
        box.classList.add('active');
        setTimeout(()=>box.classList.remove('active'),800);
    })
    main.appendChild(box);
}

// get voices then set voices in dropdown
function getVoices() {
    return new Promise(
        function (resolve, reject) {
            let synth = window.speechSynthesis;
            let id;

            id = setInterval(() => {
                if (synth.getVoices().length !== 0) {
                    resolve(synth.getVoices());
                    clearInterval(id);
                }
            }, 10);
        }
    )
}

let voicesPromise; //This will store promise
function setVoices() {
    voicesPromise = getVoices();
    voicesPromise.then(voicesArr => {
        voicesArr.forEach(voice=> {
            const option = document.createElement('option');
            option.value = voice.name;
            option.innerText = `${voice.name} ${voice.lang}`;
            voicesSelect.appendChild(option);
        })
    })
}

// initialize speech synthesis utterance
const message = new SpeechSynthesisUtterance();
function setTextMessage(text) {
    message.text = text;
}

// speak text
function speakText() {
    window.speechSynthesis.speak(message);
}

// changing voice from dropdown
function voiceChoice(event) {
    voicesPromise.then(voicesArr => message.voice = voicesArr.find(voice => voice.name === event.target.value));
}

// Read text button and speak the custom text
readBtn.addEventListener('click',()=> {
    setTextMessage(textarea.value);
    speakText();
})

// voices changed
window.speechSynthesis.addEventListener('voiceschanged',setVoices);

// toggle text box
toggleBtn.addEventListener('click',()=> document.getElementById('text-box').classList.add('show'));

// close button
closeBtn.addEventListener('click',()=> document.getElementById('text-box').classList.remove('show'));

voicesSelect.addEventListener('change', voiceChoice);

// setting voices in dropdown list
setVoices();