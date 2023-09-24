const appDiv = document.getElementById('app');
    class weightedText {
      constructor(text, times, weight, notBefore, type) {
        this.text = text;
        this.times = times;
        this.weight = weight;
        this.notBefore = notBefore;
        this.type = type;
      }
    }

    //Variable initialization
    let texts2 = new Array();
    let turn = 0;
    let arrCollection = new Array();
    let maxWeight = 0;
    function load() {
      console.log(texts2);
      texts2.forEach((t) => {


        let textSeparate = t.split('\t');

        console.log(textSeparate);
        arrCollection.push(
          new weightedText(
            textSeparate[0],
            Number(textSeparate[1]),
            Number(textSeparate[2]),
            Number(textSeparate[3]),
            textSeparate[4]
          )

        );
        maxWeight = maxWeight + Number(textSeparate[2]);
        console.log(maxWeight);
      });
      document.getElementById("myForm").hidden = true;

    }

    function showRandom() {
      if (maxWeight <= 0) {
        return;
      }

      let randomNumber = Math.random() * maxWeight;
      console.log(randomNumber);

      for (let i = 0; i < arrCollection.length; i++) {
        randomNumber = randomNumber - arrCollection[i].weight;

        if (randomNumber <= 0) {
          pickAndProcess(arrCollection[i], i);
          i = arrCollection.length + 1;
        }
      }
    }


    function pickAndProcess(weightedText, index) {

      if (weightedText.notBefore > turn) {
        showRandom();
        console.log("TOOEARLY " + weightedText.text + " too early, notbefore is " + weightedText.notBefore + ", turn is" + turn);
        return;
      }
      turn++;
      createTextOnPage(weightedText);
      reduceTime();
      console.log("Picked text" + weightedText.text);
      if (weightedText.times > 1) {
        weightedText.times--;
      }
      else {
        arrCollection.splice(index, 1);
        maxWeight = maxWeight - weightedText.weight;
        console.log(arrCollection);
      }
    }

    function reduceTime(){
      let arrTimes=[0,0,1,1,2,3];
      let picked= arrTimes[Math.floor(Math.random()*arrTimes.length)];
      let timer=document.getElementById("timer");
      timer.value=Math.max(20,timer.value-picked);
      showReducedTime(picked);
    }

    function showReducedTime(time){
      let placeSpot=document.getElementById("timeRemoved");

      var j = document.createElement("p");

      j.innerHTML="-" + time;

      placeSpot.append(j);
      setTimeout(function(){j.innerHTML=""},5000);
      setTimeout(function(){j.remove()},7000);
    }

    function changeTime(upOrDown){
      let timer=document.getElementById("timer");

      if(upOrDown=="up"){
        timer.value++;
      }
      else{
        timer.value--;
      }
    }
    

    function createTextOnPage(weightedText) {
      var p = document.createElement("p");
      p.classList.add(weightedText.type)
      if (weightedText.weight <= 0.5) {
        p.classList.add("rare");
      }
      p.innerHTML = turn + ": " + weightedText.text;
      appDiv.append(p);
    }

    const CSVToArray = (data, omitFirstRow = false) =>
      data
        .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
        .replaceAll("\r", "")
        .split('\n')
      ;



    const fileInput = document.getElementById('csv')

    const readFile = () => {
      const reader = new FileReader()
      reader.onload = () => {
        texts2 = CSVToArray(reader.result, true);
        load();
      }
      // start reading the file. When it is done, calls the onload event defined above.
      reader.readAsBinaryString(fileInput.files[0])
    }

    fileInput.addEventListener('change', readFile)

