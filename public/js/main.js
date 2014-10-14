var path = "http://shortnr.es";
// ESTO ES LO NUEVO QUE HEMOS CREADO!!!!!

$(document).ready(function() {

	// Generar URL corta
	$("#btn_generar_url").click(function(ev) {
		ev.stopPropagation();

		$("#box-result-generar").hide();
		$("#error_generar").empty();

		inputUrlIsValid($("#input_url_larga"), function() {

			var long_url = $("#input_url_larga").val();

			$.ajax({
				url: path + "/",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({
					url: long_url
				})
			}).done(function(data) {

				console.log("Data: ", data);
				var shortUrl = path + "/" + data.shortUrl;
				$("#out_url").attr("href", shortUrl).html(shortUrl);
				$("#out_key").html(data.adminKey);
				$("#box-result-generar").show();

			}).fail(function(err) {
				$("#error_generar").html("La url introducida no es válida.");
				console.log("ERROR: ", err);
			});	

		}, function() {
			$("#error_generar").html("La url introducida no es válida.");
			console.log("La url no es válida");			
		});

	});

	// Estadísticas URL
	$("#btn_estadisticas_url").click(function(ev) {
		ev.stopPropagation();

		$("#box-result-administrar").hide();
		$("#error_administrar").empty();

		var url = $("#input_url_larga_admin").val();

		if (url.indexOf(path) == -1) 
			$("#input_url_larga_admin").val(path + "/" + url);

		inputUrlIsValid($("#input_url_larga_admin"), function() {

			$.ajax({
				url: path + "/info",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({
					url: url
				})
			}).done(function(data) {

				console.log("Data: ", data);

				$("#out_visits").html(data.visits);

				var w = 300;

				// Dispositivos
				var data1 = google.visualization.arrayToDataTable([
					['Dispositivos', 'Porcentaje'],
					['Web', data.devices.web],
					['Móvil', data.devices.mobile]
				]);
				var options1 = { title: 'Dispositivo', width: w };
				var chart1 = new google.visualization.PieChart(document.getElementById('piechartDevices'));
				chart1.draw(data1, options1);

				// OS
				var data2 = google.visualization.arrayToDataTable([
					['Sistemas Operativos', 'Porcentaje'],
					['Mac OS', data.os.macOSx],
					['Windows', data.os.windows],
					['Android', data.os.android],
					['iOS', data.os.ios],
					['Otro', data.os.other]
				]);
				var options2 = { title: 'Sistema Operativo', width: w };
				var chart2 = new google.visualization.PieChart(document.getElementById('piechartOS'));
				chart2.draw(data2, options2);

				// Browser
				var data3 = google.visualization.arrayToDataTable([
					['Navegador', 'Porcentaje'],
					['Chrome', data.browser.chrome],
					['Firefox', data.browser.firefox],
					['Otro', data.browser.other]
				]);
				var options3 = { title: 'Navegador', width: w };
				var chart3 = new google.visualization.PieChart(document.getElementById('piechartBrowser'));
				chart3.draw(data3, options3);
/*
				$("#os_macosx").html((data.os.macOSx * 100) + "%");
				$("#os_windows").html((data.os.windows * 100) + "%");
				$("#os_android").html((data.os.android * 100) + "%");
				$("#os_ios").html((data.os.ios * 100) + "%");
				$("#os_other").html((data.os.other * 100) + "%");
				$("#browser_chrome").html((data.browser.chrome * 100) + "%");
				$("#browser_firefox").html((data.browser.firefox * 100) + "%");
				$("#browser_other").html((data.browser.other * 100) + "%");
*/
				$("#box-result-administrar").show();

			}).fail(function(err) {
				$("#error_administrar").html("La url introducida no es válida.");
				console.log("ERROR: ", err);
			});

		}, function() {
			console.log("La url no es válida");
			$("#error_administrar").html("La url introducida no es válida.");
		});
	});

	// Borrar URL
	$("#btn_borrar_url").click(function(ev) {
		ev.stopPropagation();

		$("#box-result-administrar").hide();
		$("#error_administrar").empty();

		var url = $("#input_url_larga_admin").val();
		var key = $("#input_admin_key_admin").val();

		if (url.indexOf(path) == -1) 
			$("#input_url_larga_admin").val(path + "/" + url);

		inputUrlIsValid($("#input_url_larga_admin"), function() {

			if (key.length > 0) {

				if (confirm('¿Seguro que desea borrar la url corta de ' + url + '?')) {
					$.ajax({
						url: path + "/",
						type: "DELETE",
						contentType: "application/json",
						data: JSON.stringify({
							url: url,
							key: key
						})
					}).always(function() {
						$("#input_url_larga_admin").val("");
						$("#input_admin_key_admin").val("");
						$("#box-result-administrar").hide();
					});	
				}
			}
			else {
				$("#error_administrar").html("Para borrar el link es necesario introducir el adminKey asociado.");
			}
		}, function() {
			console.log("La url no es válida");
			$("#error_administrar").html("La url introducida no es válida.");
		});
	});

});

function inputUrlIsValid (input, call, callErr) {
	input = $(input.selector);

	if (input.val().length == 0)
		callErr();

	if (input.val().indexOf("http://") == -1 && input.val().indexOf("https://") == -1)
		input.val("http://" + input.val());

	var url = input.val();

	if (input.val().indexOf(path) != -1) {
		call();
	}
	else {
		var urlregex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
		var isValid = urlregex.test(url);
		if (isValid) {
			call();
/*			$.ajax({
			    type: 'HEAD',
			    url: url,
				success: function() {
				    call();
				},
				error: function() {
				    callErr();
				}
			});*/
		}
		else {
			callErr();
		}	
	}


}