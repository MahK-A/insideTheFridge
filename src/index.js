import "./styles.css";

if (window.webkitSpeechRecognition) {
  const funcButton = document.getElementById("func"); //funcボタン
  const clearButton = document.getElementById("clear"); //clearボタン
  const livewords = document.getElementById("live");
  const resultList = document.getElementById("resultList"); //リストが入るエリア

  funcButton.addEventListener("mousedown", startRec); //ボタンを押した時にstartRec
  funcButton.addEventListener("mouseup", stopRec); //ボタンを離した時にstopRec
  clearButton.addEventListener("click", clear); //ボタンを押してデータをクリア

  var data = []; //空の配列

  const deleteItem = ev => {
    const { key } = ev.target; //evのtargetのkeyを取得
    //xボタンの動作
    data.splice(key, 1); //配列からkey番目の要素を消去
    localStorage.removeItem(`itf${key}`); //Storageからkey番目の要素を消去
    console.log(`itf${key} has deleted`);
    console.dir(data); //確認
    getData();
  };

  function getData() {
    //データ読み込みの関数
    let count = 0;
    while (true) {
      const item = localStorage.getItem(`itf${count}`);
      if (item) {
        data.push(item); //データ追加
        console.log(`item detected! : ${count}番目 : ${item}`);
        count += 1;
      } else {
        break;
      }
    }
  }

  getData(); //初回のデータ読み込み

  if (data.lenght !== 0) {
    data.forEach(function(key, index) {
      //keyがアイテム名、indexが番号
      localStorage.setItem(`itf${index}`, key); //ローカルストレージに保存

      console.dir(data);

      const resultItem = document.createElement("li");
      resultItem.id = `item${index}`; //アイテムにidを追加
      resultItem.key = index;
      resultItem.innerText = key;
      resultList.appendChild(resultItem);

      const deleteButton = document.createElement("button"); //xボタンを追加
      deleteButton.innerText = "x";
      deleteButton.id = "xbutton";
      resultItem.appendChild(deleteButton);

      deleteButton.addEventListener("click", deleteItem);
      deleteButton.key = index;
    });
  }

  console.dir(data);

  let isRecording = false; //初期化
  const recognition = new webkitSpeechRecognition(); //API導入
  recognition.continuous = true;

  recognition.onresult = function(event) {
    console.dir(event);
    const result = event.results[0][0].transcript;
    console.log(`result : ${result}`);

    data.push(result);
    resultList.innerHTML = null;
    data.forEach(function(key, index) {
      //keyがアイテム名、indexが番号
      localStorage.setItem(`itf${index}`, key); //ローカルストレージに保存

      console.dir(data);

      const resultItem = document.createElement("li");
      resultItem.id = "item"; //アイテムにidを追加
      resultItem.innerText = key;
      resultList.appendChild(resultItem);
    });
  };

  // const resultItem = document.createElement("li");
  // resultItem.id = "item"; //アイテムにidを追加
  // resultItem.innerText = key;
  // resultList.appendChild(resultItem);

  function startRec() {
    console.log("recording start!");
    isRecording = true;
    recognition.start();
  }

  function stopRec() {
    console.log("recording stop!");
    isRecording = false;
    recognition.stop();
  }

  function clear() {
    localStorage.clear(); //ストレージをクリア
    window.location.reload(); //ページをリロードし表示をクリア
  }
} else {
  console.log("sorry, u cannnot use recognition API");
}
