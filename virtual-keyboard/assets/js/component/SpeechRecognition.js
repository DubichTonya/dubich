 
export default function speech(btn, stop, output, language){

  window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
  var recognizer = new SpeechRecognition();

  recognizer.interimResults = true;
  let fullText = '';
  let text = '';
 

  recognizer.addEventListener('result', function(event){
    const transcript = Array.from(event.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('')


    output.textContent = transcript;
    if(event.results[0].isFinal){
      text += transcript + ' ';
      output.textContent = text;
      output.selectionStart = output.textContent.length;
    }
  })


  function speechRec () {
     // Какой язык будем распознавать?
    if(language == 'ru') {
      recognizer.lang = 'ru-Ru';
    } else if ('en'){
      recognizer.lang = 'en-Us';
    }
    recognizer.start();
    output.focus();
    fullText += text;

    recognizer.addEventListener('end', recognizer.start)
  }
  
  function stopSpeak () {
    recognizer.stop();
    recognizer.removeEventListener('end', recognizer.start)
  }

  btn.addEventListener('click', speechRec)
  stop.addEventListener('click', stopSpeak)
}