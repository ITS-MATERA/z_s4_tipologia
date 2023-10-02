/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library custZtipo.zTipoLibrary.
 */
sap.ui.define([
	"sap/ui/core/library"
], function () {
	"use strict";

	// delegate further initialization of this library to the Core
	// Hint: sap.ui.getCore() must still be used to support preload with sync bootstrap!
	sap.ui.getCore().initLibrary({
		name: "custZtipo.zTipoLibrary",
		version: "${version}",
		dependencies: [ // keep in sync with the ui5.yaml and .library files
			"sap.ui.core"
		],
		types: [],
		interfaces: [],
		controls: [
			"custZtipo.zTipoLibrary.controls.InputZtipo",
			"custZtipo.zTipoLibrary.controls.InputZsottotipo"
		],
		elements: [],
		noLibraryCSS: false // if no CSS is provided, you can disable the library.css load here
	});


	// controls: [
	// 	"custZtipo.zTipoLibrary.Example"
	// ],	
	// types: [
	// 	"custZtipo.zTipoLibrary.ExampleColor"
	// ],
	// "custZtipo.zTipoLibrary.Example"
	
	
	
	
	
	
	/**
	 * Some description about <code>zTipoLibrary</code>
	 *
	 * @namespace
	 * @name custZtipo.zTipoLibrary
	 * @author Innovates
	 * @version ${version}
	 * @public
	 */
	var thisLib = custZtipo.zTipoLibrary;

	/**
	 * Semantic Colors of the <code>custZtipo.zTipoLibrary.Example</code>.
	 *
	 * @enum {string}
	 * @public
	 */
	// thisLib.ExampleColor = {

	// 	/**
	// 	 * Default color (brand color)
	// 	 * @public
	// 	 */
	// 	Default : "Default",

	// 	/**
	// 	 * Highlight color
	// 	 * @public
	// 	 */
	// 	Highlight : "Highlight"

	// };

	return thisLib;

});
