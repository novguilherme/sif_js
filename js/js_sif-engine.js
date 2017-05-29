/* Ajustar tela - Inicio */
function divSize() {
	$(".tela").removeClass("largura").removeAttr("style");
	
	var base = $(".tela").innerWidth();
	var altura = $(".tela").innerHeight();
	
	if(altura > $(window).height()){
		$(".tela").addClass("largura");
		var altura = $(window).height();
		var base = altura / 2 * 3;
		$(".tela").width(base);
	}
}

divSize();

$(window).resize(function() {
	divSize();
});
/*Ajustar Tela - Fim */

/* Efeito sonoro das notas - Inicio */
sfxNote = document.getElementById('sfxNote');
function playNote() {
	sfxNote.pause();
  sfxNote.currentTime = 0;
	sfxNote.play();
}
/* Efeito Sonoro das notas - Fim */

/* Função Array Replace - Inicio */
function arrayReplace(txt, arrayOriginal, arrayReplace) {
	$.each(arrayOriginal,function(i,v) {
		txt = txt.replace(new RegExp('\\b' + v + '\\b', 'g'),arrayReplace[i]);
	});
	
	return txt;
}
/* Função Array Replace - Fim */

/*Ativar Botoes - Inicio */
$(document).keydown(function(e){	
	getKey = parseInt(arrayReplace(String.fromCharCode(e.which), ["a","b","c","d","e","f","g","h","i"],["1","2","3","4","5","6","7","8","9"]));
	
	if(getKey >= 1 && getKey <= 9) {
		$("#live_btn"+getKey).addClass("ativo");
		
		/* */
		//alert($('.live_note[data-btn="'+getKey+'"]').length);
		/* */
	}
});

$(document).keyup(function(e){
	getKey = parseInt(arrayReplace(String.fromCharCode(e.which), ["a","b","c","d","e","f","g","h","i"],["1","2","3","4","5","6","7","8","9"]));
	
	if(getKey >= 1 && getKey <= 9) {
		$("#live_btn"+getKey).removeClass("ativo");
	}
});
/*Ativar Botoes - Fim */


/* Ativar Música - Inicio */
audio = document.getElementById('audio');
     
audio.addEventListener('play', play_evento , false);
audio.addEventListener('pause', pause_evento , false);
audio.addEventListener('timeupdate', atualizar , false);

function play_evento(){
	$('#barra_progresso').attr("max", audio.duration);
	audio.status = "play";
}

function pause_evento(){
	audio.status = "pause";
}

function atualizar(){
	$('#barra_progresso').attr("value", audio.currentTime);
	$('.musicTimeStr').attr("value", audio.currentTime);
	$('.musicTime').attr("value", strToTime(audio.currentTime));
}

$('#barra_progresso').click(function(e) {
	if(audio.status == "play") {
		audio.pause();
	}
	
	else {
		audio.play();
	}
});
/* Ativar Música - Fim */

/* Converter string do tempo da música em relógio - Inicio */
function strToTime( str_num ) {
	var horas   = Math.floor(str_num / 3600);
	var minutos = Math.floor((str_num - (horas * 3600)) / 60);
	var segundos = (str_num - (horas * 3600) - (minutos * 60)).toFixed(2);
	
	if (horas   < 10)  horas    = "0"+horas;
	if (minutos < 10)  minutos  = "0"+minutos;
	if (segundos < 10) segundos = "0"+segundos;
	
	var tempo    = horas+':'+minutos+':'+segundos;
	
	return tempo;
}
/* Converter string do tempo da música em relógio - Fim */

/* Converter tempo de música em string - Inicio */
function timeToStr( time_num ) {
	var time_num = time_num.split(':');
	var totalArrayTempo = time_num.length;
	var tempo = 0;
	var multiplicadorTempo = 1;
	
	for(posicaoArrayTempo = totalArrayTempo-1; posicaoArrayTempo >= 0; posicaoArrayTempo--) {
		var tempo = tempo + (Number(time_num[posicaoArrayTempo]) * multiplicadorTempo);
		multiplicadorTempo = multiplicadorTempo * 60;
	}
	
	return tempo;
}
/* Converter tempo de música em string - Fim */

/* Teste notas - Inicio *
var tstnotas = [];

tstnotas.push({
	tst: "aaa"
})

tstnotas.push({
	tst: "bbb"
})

alert(tstnotas[0].tst);
tstnotas.shift(); 
alert(tstnotas[0].tst);
/* Teste notas - Fim */

/* Função para adicionar notas para musica - Inicio */
var musicNote = [];
function addMusicNote(note) {
	//Realizar a função apenas se definirem o tempo da música - Inicio
	if(note.time !== undefined || note.time || note.timeStr !== undefined || note.time) {
		//Define o tempo em string, caso não tenha definido desta forma
		if(note.timeStr === undefined || !note.timeStr) note.timeStr = timeToStr(note.time);
		
		//Define o mínimo de 1 segundo de música para o timeStr iniciar
		if(note.timeStr < 1) note.timeStr = 1;
		
		//Seleciona botao aleatorio caso não tenha definido nenhum
		if(parseInt(note.btn,10) <= 0 || parseInt(note.btn,10) > 9 || isNaN(parseInt(note.btn)) ) {
			note.btn = Math.floor(Math.random() * 9 + 1);
		}
		
		//Guardar dados na variavel "musicNote"
		musicNote.push({
			id: musicNote.length,
			timeStr: note.timeStr,
			btn: note.btn,
			start: false
		})
	}
	//Realizar a função apenas se definirem o tempo da música - Fim
}
/* Função para adicionar notas para musica - Fim */


/* Teste de animação 3 - Inicio */
function checkNote() {
	jQuery.each( musicNote, function( i, notaAtual ) {
		if(notaAtual.start == false) {
			//verificar se é o tempo definido
			if(audio.currentTime > notaAtual.timeStr - 1) {
				notaAtual.start = true;
				//alert(notaAtual.timeStr);
				goNote(notaAtual.btn, notaAtual.id);
			}
		}
		
		if(audio.currentTime >= 2) {
			//stopNote();
		}
	})
}
audio.addEventListener('timeupdate', checkNote, false);

function goNote(btn, id) {
	//Cria uma nova nota e a adiciona na div "live_note_area"
	$( ".live_note_area" ).prepend(
		$('<div>', {
			class: 'live_note live_note'+id,
			"data-btn": btn
		})
	);
	
	centroTop = $(".live_note_ref").position().top / $(".live_note_ref").closest(".tela").height() * 100;
	centroLeft = $(".live_note_ref").position().left / $(".live_note_ref").closest(".tela").width() * 100; 
	//elemento = "#live_btn"+Math.floor(Math.random() * 9 + 1);
	elemento = "#live_btn" + btn;
	elementoTop = $(elemento).position().top / $(elemento).parent().height() * 100;
	elementoLeft = $(elemento).position().left / $(elemento).parent().width() * 100; 
	
	//distancia = 0.68; //Good I 100
	//distancia = 0.78; //Good F 100
	//distancia = 0.89;//Great   150
	//distancia = 1.11;//Perfect 300
	//distancia = 1.21;//Great   150
	//distancia = 1.31; //Good   100
	
	
	distancia = 1.32;
	
	notaTopFinal = (centroTop + (distancia * (elementoTop - centroTop)));
	notaLeftFinal = (centroLeft + (distancia * (elementoLeft - centroLeft)));
	
	duracao = 1000;
	
	window.setTimeout('playNote()', duracao);
	
	$(".live_note"+id).animate({
		opacity: "1",
	},{queue: false, duration: duracao/4});
	
	$(".live_note"+id).animate({
		top: notaTopFinal+"%",
		left: notaLeftFinal+"%"
	},{
		duration: duracao*distancia,
		easing: "linear",
		complete: function(){
			//$(this).remove();
		}
	});
	/*$(".live_note"+id).css({
		top:notaTopFinal+"%",
		left: notaLeftFinal+"%"
	});*/
}
/* Teste de animação 3 - Fim */


/* Teste de animação 2 - Inicio *
var notaAtual = 1;
function goNote() {
	if(audio.status == "play") {
		//Cria uma nova nota e a adiciona na div "live_note_area"
		$( ".live_note_area" ).prepend(
			$('<div>', {
				class: 'live_note live_note'+notaAtual
			})
		);
			
		$(".live_note"+notaAtual).animate({
			opacity: "1",
		},{queue: false, duration: 1000});
		//alert("aaa");
		centroTop = $(".live_note_ref").position().top / $(".live_note_ref").closest(".tela").height() * 100;
		centroLeft = $(".live_note_ref").position().left / $(".live_note_ref").closest(".tela").width() * 100; 
		elemento = "#live_btn"+Math.floor(Math.random() * 9 + 1);
		//elemento = "#live_btn3";
		elementoTop = $(elemento).position().top / $(elemento).parent().height() * 100;
		elementoLeft = $(elemento).position().left / $(elemento).parent().width() * 100; 
		distancia = 1.32;
		
		notaTopFinal = (centroTop + (distancia * (elementoTop - centroTop)))+"%";
		notaLeftFinal = (centroLeft + (distancia * (elementoLeft - centroLeft)))+"%";
		
		$(".live_note"+notaAtual).animate({
			top: notaTopFinal,
			left: notaLeftFinal
		},1800, function(){
			$(this).remove();
		});
		
		notaAtual++;
	}
}
audio.addEventListener('timeupdate', goNote, false);
/* Teste de animação 2 - Fim */

//goNote()
/* Teste de Animacao - Inicio *
function goNote() {
	//if(audio.status == "play") {
		window.setTimeout('$(".live_note").css("backgroundColor","rgba(0,0,255,0.5)")', 925);
		window.setTimeout('$(".live_note").css("backgroundColor","rgba(0,255,255,0.5)")', 1061);
		window.setTimeout('$(".live_note").css("backgroundColor","rgba(0,0,255,0.5)")', 1405);
		//window.setTimeout('stopNote()', 925);
		//window.setTimeout('stopNote()', 1061);
		//window.setTimeout('stopNote()', 1405);
		//window.setTimeout('stopNote()', 1218);
		
		$(".live_note").animate({
			opacity: "1",
		},{queue: false, duration: 1000});
		
		centroTop = $(".live_note").position().top / $(".live_note").parent().height() * 100;
		centroLeft = $(".live_note").position().left / $(".live_note").parent().width() * 100; 
		elemento = "#live_btn"+Math.floor(Math.random() * 9 + 1);
		//elemento = "#live_btn4";
		elementoTop = $(elemento).position().top / $(elemento).parent().height() * 100;
		elementoLeft = $(elemento).position().left / $(elemento).parent().width() * 100; 
		distancia = 1.32;
		
		notaTopFinal = (centroTop + (distancia * (elementoTop - centroTop)))+"%";
		notaLeftFinal = (centroLeft + (distancia * (elementoLeft - centroLeft)))+"%";
		
		$(".live_note").animate({
			top: notaTopFinal,
			left: notaLeftFinal
		},1800, function(){
			$(".live_note").removeAttr("style");
			goNote();
		});
	//}
}

/* Teste de Animacao - Fim */

function stopNote(){
	$(".live_note").stop(false,false);
	audio.pause();
}