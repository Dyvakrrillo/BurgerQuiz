var save = {};
save.mayo = 0;
save.ketchup = 0;
save.diapo = 0;
var data = [];
var currentCorrectAnswer = null;

init();

function init(){
	document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(event){
	const reader = new FileReader()
	reader.onload = handleFileLoad;
	reader.readAsText(event.target.files[0])
}

function handleFileLoad(event){
	var csv = event.target.result;
	var lines = csv.split("\n");
	var result = [];
	for(var i=0;i<lines.length;i++){
		result.push(lines[i].split(";"));
	}
	data = result;
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem('data', JSON.stringify(data));
	}
	save.diapo = 0;
	savevars();
	diapo();
}

var data = [
	["V", "generique"],
	["V", "nuggets"],
	["N", "Question Nuggets ?", "Réponse A", "Réponse B", "Réponse C", "Réponse D"],
	["V", "sel-ou-poivre"],
	["S", "Question Sel ou Poivre ?", "Proposition"],
	["V", "menus"],
	["L", "Menu 1 : Titre", "Menu 2 : Titre", "Menu 3 : Titre"],
	["M", "Menu 1 : Titre", "Description"],
	["M", "Titre du menu", "Question ?"],
	["V", "addition"],
	["A", "Titre de l'addition", "Proposition"],
	["V", "burger-mort"],
	["B", "Question"]
];

if (typeof(Storage) !== "undefined") {
	if(localStorage.save != undefined){
		save = JSON.parse(localStorage.getItem('save'));
	}
	if(localStorage.data != undefined){
		data = JSON.parse(localStorage.getItem('data'));
	}
	refresh();
	diapo();
}

function savevars(){
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem('save', JSON.stringify(save));
	}
}

function reset(){
	save.mayo = 0;
	save.ketchup = 0;
	save.diapo = 0;
	savevars();
	refresh();
	diapo();
}

function refresh(){
	if(save.mayo < 10){
		txtmayo = "0" + save.mayo;
	} else {
		txtmayo = save.mayo;
	}
	document.getElementById("score-mayo").src = "img/score-" + txtmayo + ".jpg";
	document.getElementById("txt-mayo").innerHTML = txtmayo;
	if(save.ketchup < 10){
		txtketchup = "0" + save.ketchup;
	} else {
		txtketchup = save.ketchup;
	}
	document.getElementById("score-ketchup").src = "img/score-" + txtketchup + ".jpg";
	document.getElementById("txt-ketchup").innerHTML = txtketchup;
}

function diapo(){
	var i = save.diapo;
	document.getElementById("video-frame").style.display = "none";
	document.getElementById("reponse").style.display = "none";
	document.getElementById("reponses").style.display = "none";
	document.getElementById("image").style.display = "none";
	document.getElementById("menus").style.display = "none";
	document.getElementById("answer-controls").style.display = "none";
	document.getElementById("generique").pause();
	document.getElementById("generique").src = "";
	document.getElementById("menus").innerHTML = "";
	document.getElementById("img").src = "";
	
	// Réinitialiser les styles des réponses
	document.getElementById("reponseA").className = "";
	document.getElementById("reponseB").className = "";
	document.getElementById("reponseC").className = "";
	document.getElementById("reponseD").className = "";
	if(data[i][0] == "V"){
		document.getElementById("generique").src = "videos/" + data[i][1] + ".mp4";
		document.getElementById("video-frame").style.display = "block";
	} else if(data[i][0] == "N"){
		document.getElementById("title").innerHTML = "NUGGETS";
		document.getElementById("question").innerHTML = data[i][1];
		document.getElementById("reponseA").innerHTML = data[i][2];
		document.getElementById("reponseB").innerHTML = data[i][3];
		document.getElementById("reponseC").innerHTML = data[i][4];
		document.getElementById("reponseD").innerHTML = data[i][5];
		document.getElementById("reponses").style.display = "block";
		document.getElementById("answer-controls").style.display = "block";
		
		// Stocker la réponse correcte si elle existe
		if(data[i].length > 6 && data[i][6]){
			currentCorrectAnswer = data[i][6];
		} else {
			currentCorrectAnswer = null;
		}
	} else if(data[i][0] == "S"){
		document.getElementById("title").innerHTML = "SEL OU POIVRE";
		document.getElementById("question").innerHTML = data[i][1];
		document.getElementById("reponse").innerHTML = data[i][2];
		document.getElementById("reponse").style.display = "block";
	} else if(data[i][0] == "I"){
		document.getElementById("title").innerHTML = data[i][1];
		document.getElementById("question").innerHTML = data[i][2];
		document.getElementById("img").src = data[i][3];
		document.getElementById("image").style.display = "block";
	} else if(data[i][0] == "M"){
		document.getElementById("title").innerHTML = "MENUS";
		document.getElementById("question").innerHTML = data[i][1];
		document.getElementById("reponse").innerHTML = data[i][2];
		document.getElementById("reponse").style.display = "block";
	} else if(data[i][0] == "A"){
		document.getElementById("title").innerHTML = "ADDITION";
		document.getElementById("question").innerHTML = data[i][1];
		document.getElementById("reponse").innerHTML = data[i][2];
		document.getElementById("reponse").style.display = "block";
	} else if(data[i][0] == "B"){
		document.getElementById("title").innerHTML = "BURGER DE LA MORT";
		document.getElementById("question").innerHTML = data[i][1];
	} else if(data[i][0] == "L"){
		document.getElementById("title").innerHTML = "MENUS";
		document.getElementById("question").innerHTML = "Les menus :";
		document.getElementById("menus").innerHTML = "<li>" + data[i][1] + "</li><li>" + data[i][2] + "</li><li>" + data[i][3] + "</li>";
		document.getElementById("menus").style.display = "block";
	}
}

function addmayo(){
	if(save.mayo < 25){
		save.mayo++;
		if(save.mayo < 10){
			txtmayo = "0" + save.mayo;
		} else {
			txtmayo = save.mayo;
		}
		document.getElementById("score-mayo").src = "img/score-" + txtmayo + ".jpg";
		document.getElementById("txt-mayo").innerHTML = txtmayo;
		savevars();
	}
}

function submayo(){
	if(save.mayo > 0){
		save.mayo--;
		if(save.mayo < 10){
			txtmayo = "0" + save.mayo;
		} else {
			txtmayo = save.mayo;
		}
		document.getElementById("score-mayo").src = "img/score-" + txtmayo + ".jpg";
		document.getElementById("txt-mayo").innerHTML = txtmayo;
		savevars();
	}
}

function addketchup(){
	if(save.ketchup < 25){
		save.ketchup++;
		if(save.ketchup < 10){
			txtketchup = "0" + save.ketchup;
		} else {
			txtketchup = save.ketchup;
		}
		document.getElementById("score-ketchup").src = "img/score-" + txtketchup + ".jpg";
		document.getElementById("txt-ketchup").innerHTML = txtketchup;
		savevars();
	}
}

function subketchup(){
	if(save.ketchup > 0){
		save.ketchup--;
		if(save.ketchup < 10){
			txtketchup = "0" + save.ketchup;
		} else {
			txtketchup = save.ketchup;
		}
		document.getElementById("score-ketchup").src = "img/score-" + txtketchup + ".jpg";
		document.getElementById("txt-ketchup").innerHTML = txtketchup;
		savevars();
	}
}

function prevdiapo(){
	if(save.diapo > 0){
		save.diapo--;
		savevars();
		diapo();
	}
}

function nextdiapo(){
	if(save.diapo < data.length-1){
		save.diapo++;
		savevars();
		diapo();
	}
}

function gohelp(){
	window.open("help.html");
}

function showCorrectAnswer(){
	if(currentCorrectAnswer){
		// Réinitialiser tous les styles
		document.getElementById("reponseA").className = "";
		document.getElementById("reponseB").className = "";
		document.getElementById("reponseC").className = "";
		document.getElementById("reponseD").className = "";
		
		// Appliquer le style à la bonne réponse
		var correctElement = null;
		switch(currentCorrectAnswer.toUpperCase()){
			case 'A':
				correctElement = document.getElementById("reponseA");
				break;
			case 'B':
				correctElement = document.getElementById("reponseB");
				break;
			case 'C':
				correctElement = document.getElementById("reponseC");
				break;
			case 'D':
				correctElement = document.getElementById("reponseD");
				break;
		}
		
		if(correctElement){
			correctElement.className = "correct-answer";
		}
	}
}

document.body.addEventListener('keyup',  function(event){
	event.preventDefault();
	if(event.keyCode == 82){ //R
		if(confirm("Etes-vous certain de vouloir tout réinitialiser ?")){
			reset();
		}
	} else if(event.keyCode == 72){ //H
		gohelp();
	} else if(event.keyCode == 76){ //L
		submayo();
	} else if(event.keyCode == 77){ //M
		addmayo();
	} else if(event.keyCode == 74){ //J
		subketchup();
	} else if(event.keyCode == 75){ //K
		addketchup();
	} else if(event.keyCode == 39){ //FlecheDroite
		nextdiapo();
	} else if(event.keyCode == 37){ //FlecheGauche
		prevdiapo();
	} else if(event.keyCode == 80){ //P
		document.getElementById("generique").currentTime = 0;
		document.getElementById("generique").play();
	} else if(event.keyCode == 70){ //F
		document.getElementById('fileInput').click();
	} else if(event.keyCode == 32){ //Espace
		showCorrectAnswer();
	}
});