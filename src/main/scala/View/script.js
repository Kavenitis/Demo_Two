const socket = io.connect("http://localhost:8080", {transports: ['websocket']});

socket.on('yourPartyId', function (event) {
 id = event
 console.log(id)
});

socket.on('battleState', function (event) {
JSONData = event
update(JSONData)
document.getElementById("start").style.visibility = "hidden"
});

socket.on('turnReady', function (event) {
console.log(event)
takeTurn(event)
document.getElementById("start").style.visibility = "hidden"
});

socket.on('actionTaken', function (event) {
console.log(JSON.parse(event))
var data = JSON.parse(event)
myAnimate(data.source, data.target, data.deltaHP)
});

socket.on('battleEnded', function (event) {
document.getElementById("display_message").innerHTML = event + " has won the battle!!!";
});

var JSONString = '{"playerParty":{"characters":[{"name":"char1", "hp":50,  "maxHP":70,"battleOptions": ["Attack","Heal","Magic attack","Level attack"]},{"name":"char2", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack2","Magic attack"]},{"name":"char3", "hp":0, "maxHP":70,"battleOptions": ["Attack","Special attack3","Magic attack","Level attack"]},{"name":"char4", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack1","Magic attack"]}]},"enemyParty":{"characters":[{"name":"enem1", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack2","Magic attack"]},{"name":"enem2", "hp":0, "maxHP":70,"battleOptions": ["Attack","Special attack3","Magic attack","Level attack"]},{"name":"enem3", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack2","Magic attack"]},{"name":"enem4", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack1","Magic attack","Level attack"]}]}}'

var charIDList = []
var chosenAction = ""
var chosenChar = ""
var chosenName = ""
var JSONData = ""
var id = ""

function update(data) {
  var json_string = JSON.parse(data);
  for(i = 1; i <= 4; i++) {
    eval("var c" + i + '= ' + 'json_string.playerParty.characters[' + i + '-1].name' + ';');
    eval("var c" + i + 'hp= ' + 'json_string.playerParty.characters[' + i + '-1].hp.toString()' + ';');
    eval("var c" + i + 'Maxhp= ' + 'json_string.playerParty.characters[' + i + '-1].maxHP.toString()' + ';');
    eval("var cs" + i + '= ' + 'document.getElementById("c' + i + '")' + ';');
    eval("cs" + i + '.innerHTML= ' + 'c' + i + '+ "<br>" + c' + i + 'hp + "/" + c' + i + 'Maxhp' + ';');
  }
  for(i = 1; i <= 4; i++) {
    eval("var e" + i + '= ' + 'json_string.enemyParty.characters[' + i + '-1].name' + ';');
    eval("var e" + i + 'hp= ' + 'json_string.enemyParty.characters[' + i + '-1].hp.toString()' + ';');
    eval("var e" + i + 'Maxhp= ' + 'json_string.enemyParty.characters[' + i + '-1].maxHP.toString()' + ';');
    eval("var es" + i + '= ' + 'document.getElementById("e' + i + '")' + ';');
    eval("es" + i + '.innerHTML= ' + 'e' + i + '+ "<br>" + e' + i + 'hp + "/" + e' + i + 'Maxhp' + ';');
  }

  for (var i = 1; i < 5; i++){
    var name = json_string.playerParty.characters[i-1].name
    var battleOptions = json_string.playerParty.characters[i-1].battleOptions
    var style = eval('cs' + i)
    var hp = json_string.playerParty.characters[i-1].hp
    charIDList[i-1] = [name, "c" + i.toString(), battleOptions, style, hp]
  }
  for (var i = 5; i < 9; i++){
    var name = json_string.enemyParty.characters[i-5].name
    var battleOptions = json_string.enemyParty.characters[i-5].battleOptions
    var style = eval('es' + (i-4))
    var hp = json_string.enemyParty.characters[i-5].hp
    charIDList[i-1] = [name, "e" + (i-4).toString(), battleOptions, style, hp]
  }

  for (let i of json_string.playerParty.characters){
    for(j of charIDList){
      if (i.hp <= 0 && i.name == j[0]){
        j[3].style.background = 'gray';
      }
      if (i.hp > 0 && i.name == j[0]){
        j[3].style.background = 'yellow';
      }
    }
  }

  for (let i of json_string.enemyParty.characters){
    for(j of charIDList){
      if (i.hp <= 0 && i.name == j[0]){
        j[3].style.background = 'gray';
      }
      if (i.hp > 0 && i.name == j[0]){
        j[3].style.background = 'lightblue';
      }
    }
  }
}


function myAnimate(name1, name2, dmg){
  for (character of charIDList) {
    if (character[0] == name1) {
      var char1elem = document.getElementById(character[1]);
    }
    else if (character[0] == name2) {
      var char2elem = document.getElementById(character[1]);
    }
  }

  if(dmg > 0) {
    char1elem.style.width = "150px"
    char1elem.style.height = "150px"
    char2elem.style.width = "150px"
    char2elem.style.height = "150px"
    char2elem.style.background = "green"
    setTimeout(() => {
    char1elem.style.width = "100px"
    char1elem.style.height = "100px"
    char2elem.style.width = "100px"
    char2elem.style.height = "100px"
    char2elem.style.background = "yellow"
    update(JSONData)
    }, 1000);
  }
  if (dmg == 0) {
    char1elem.style.width = "150px"
    char1elem.style.height = "150px"
    char2elem.style.width = "150px"
    char2elem.style.height = "150px"
    char2elem.style.background = "orange"
    setTimeout(() => {
    char1elem.style.width = "100px"
    char1elem.style.height = "100px"
    char2elem.style.width = "100px"
    char2elem.style.height = "100px"
    char2elem.style.background = "lightblue"
    update(JSONData)
    }, 1000);
  }
  if (dmg < 0){
    char1elem.style.width = "150px"
    char1elem.style.height = "150px"
    char2elem.style.width = "150px"
    char2elem.style.height = "150px"
    char2elem.style.background = "red"
    setTimeout(() => {
    char1elem.style.width = "100px"
    char1elem.style.height = "100px"
    char2elem.style.width = "100px"
    char2elem.style.height = "100px"
    char2elem.style.background = "lightblue"
    update(JSONData)
    }, 1000);
  }
//  update(JSONData)
}

function takeTurn(name) {

  chosenName = name

  for (character of charIDList) {
    if (character[0] == name) {
      var char1elem = document.getElementById(character[1]);
      char1elem.style.width = "150px"
      char1elem.style.height = "150px"
    }
  }

  var i = 1
  for (character of charIDList) {
      eval("var button" + i + '= ' + 'document.getElementById("' + i + '")' + ';');
      eval("button" + i + ".innerHTML" + '= ' + 'character[0]' + ';');
      i += 1
  }

  for (character of charIDList) {
    if (character[0] == name) {
        for(i = 1; i <= character[2].length; i++) {
          eval("var abutton" + i + '= ' + 'document.getElementById("a' + i + '")' + ';');
          eval("abutton" + i + ".innerHTML" + '= ' + 'character[2][' + i + '-1]' + ';');
          eval("abutton" + i + ".style.visibility" + '= "visible"')
      }
    }
  }
}

function action(Id) {

  var button = document.getElementById(Id)
  chosenAction = button.innerHTML

  if (chosenAction == "Heal") {
    for (i = 1; i <= 4; i++) {
      eval("var button" + i + '= ' + 'document.getElementById("' + i + '")' + ';');
      eval("button" + i + ".style.visibility" + '= "visible"')
    }
  }
  else {
    for (i = 5; i <= 8; i++) {
      if (charIDList[i-1][4] == 0) {
        continue
      }
      eval("var button" + i + '= ' + 'document.getElementById("' + i + '")' + ';');
      eval("button" + i + ".style.visibility" + '= "visible"')
    }
  }

  for (i = 1; i <= 4; i++) {
    eval("var abutton" + i + '= ' + 'document.getElementById("a' + i + '")' + ';');
    eval("abutton" + i + ".style.visibility" + '= "hidden"')
  }
}

function choose(Id, chosenAction) {
  var button = document.getElementById(Id)
  chosenChar = button.innerHTML

  for (i = 1; i <= 8; i++) {
    eval("var button" + i + '= ' + 'document.getElementById("' + i + '")' + ';');
    eval("button" + i + ".style.visibility" + '= "hidden"')
  }
  data = JSON.parse(JSONString)
  if (chosenAction == "Heal") {
//    myAnimate(chosenName, chosenChar, 10)
    console.log("Attack method: ", chosenAction, " Target: ", chosenChar)
//    for(character of data.playerParty.characters) {
//      if (character.name == chosenChar){
//        character.hp += 10
//        JSONString = JSON.stringify(data)
//      }
//    }
  }
  else {
//    myAnimate(chosenName, chosenChar, -25)
    console.log("Action method: ", chosenAction, " Target: ", chosenChar, "Attacker: ", chosenName)
//    for(character of data.enemyParty.characters) {
//      if (character.name == chosenChar){
//        character.hp -= 25
//        JSONString = JSON.stringify(data)
//      }
//    }
    var dict = {
        "action": chosenAction,
        "source": chosenName,
        "target": chosenChar};
    JSONDic = JSON.stringify(dict)
  }
  setTimeout(() => {socket.emit("battleAction", JSONDic)}, 1001);

}

function startBattle() {
    var array = id.split("_")
    if (parseInt(array[1]) % 2 == 0) {
    var enemyID = parseInt(array[1]) - 1
    socket.emit("startBattle", "party_" + enemyID.toString())
    }
    else {
    var enemyID = parseInt(array[1]) + 1
    socket.emit("startBattle", "party_" + enemyID.toString())
    }
}

function lose() {
let JSONStringLose = '{"playerParty":{"characters":[{"name":"char1", "hp":0,  "maxHP":70,"battleOptions": ["Attack","Special attack1","Magic attack","Level attack"]},{"name":"char2", "hp":0, "maxHP":70,"battleOptions": ["Attack","Special attack2","Magic attack"]},{"name":"char3", "hp":0, "maxHP":70,"battleOptions": ["Attack","Special attack3","Magic attack","Level attack"]},{"name":"char4", "hp":0, "maxHP":70,"battleOptions": ["Attack","Special attack1","Magic attack"]}]},"enemyParty":{"characters":[{"name":"enem1", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack2","Magic attack"]},{"name":"enem2", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack3","Magic attack","Level attack"]},{"name":"enem3", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack2","Magic attack"]},{"name":"enem4", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack1","Magic attack","Level attack"]}]}}'
  update(JSONStringLose)
}

function win() {
let JSONStringWin = '{"playerParty":{"characters":[{"name":"char1", "hp":50,  "maxHP":70,"battleOptions": ["Attack","Special attack1","Magic attack","Level attack"]},{"name":"char2", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack2","Magic attack"]},{"name":"char3", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack3","Magic attack","Level attack"]},{"name":"char4", "hp":50, "maxHP":70,"battleOptions": ["Attack","Special attack1","Magic attack"]}]},"enemyParty":{"characters":[{"name":"enem1", "hp":0, "maxHP":70,"battleOptions": ["Attack","Special attack2","Magic attack"]},{"name":"enem2", "hp":0, "maxHP":70,"battleOptions": ["Attack","Special attack3","Magic attack","Level attack"]},{"name":"enem3", "hp":0, "maxHP":70,"battleOptions": ["Attack","Special attack2","Magic attack"]},{"name":"enem4", "hp":0, "maxHP":70,"battleOptions": ["Attack","Special attack1","Magic attack","Level attack"]}]}}'
  update(JSONStringWin)
}

function refresh() {
  update(JSONString)
}