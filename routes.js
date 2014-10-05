module.exports = function (app, debugMode) {

	require('./controller/api')(app);

	// ================================================
	// Debug
	// ------------------------------------------------

	console.log("DEBUG MODE: ", debugMode);
	if (debugMode) {
		// Información del cliente (para estadísticas)
		app.get("/info", findAllInfo);
		app.get("/urls", findAllURLs);
		app.get("/urls/:id", findURLById);
		app.get("/stats", findAllStatistics);
		app.get("/stats/:id", findStatisticById);		
	}

	// ================================================
	// API
	// ------------------------------------------------

	// POST: { url: "http://url_larga" }. Crea URL corta y la devuelve
	app.post("/", addURL);

	// DELETE: { url: "http://url_larga", key: "adminKey" }. Borra la url corta
	app.delete("/", deleteURL);

	// POST: { url: "http://url_larga", key: "adminKey" } Devuelve las estadísticas asociadas.
	app.post("/info", urlStatistics);

	// GET: /url_corta. Redirección a la url larga
	app.get("/:url", redirect);
};