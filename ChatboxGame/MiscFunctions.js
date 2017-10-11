CanvasRenderingContext2D.prototype.dashedLine = function(x1, y1, x2, y2, dashLen) {
	if (dashLen == undefined) dashLen = 2;
	this.beginPath();
	this.moveTo(x1, y1);
	var dX = x2 - x1;
	var dY = y2 - y1;
	var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
	var dashX = dX / dashes;
	var dashY = dY / dashes;
	var q = 0;
	while (q++ < dashes) {
		x1 += dashX;
		y1 += dashY;
		if (q%2 == 0) {
			this.moveTo(x1, y1);
		} else {
			this.lineTo(x1, y1);
		}
	}
	if (q%2 == 0) {
		this.moveTo(x2, y2);
	} else {
		this.lineTo(x2, y2);
	}
	this.stroke();
	this.closePath();
};
if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( callback, 1000 / 60 );
		};
	} )();
}
function drawGridImage(blockSize) {
	var gridImage = document.createElement('canvas');
	
	gridImage.width  = blockSize*5;
	gridImage.height = blockSize*5;

	ctx = gridImage.getContext("2d");

	ctx.clearRect ( 0 , 0 , ctx.canvas.width , ctx.canvas.height );
	
	var offsetX = 0;
	var offsetY = 0;
	
	var centerX = Math.round(ctx.canvas.width/2);
	var centerY = Math.round(ctx.canvas.height/2);
	
	ctx.strokeStyle = '#DBDBDB';
	    
	var offsetHorz = Math.round(offsetY-Math.floor(offsetY/blockSize)*blockSize);
	var offsetVert = Math.round(offsetX-Math.floor(offsetX/blockSize)*blockSize);
	for (var i = -Math.floor(centerY/blockSize); i < Math.ceil(ctx.canvas.height/blockSize/2) + 1; i++) {
	    //Draw horz lines
	    ctx.dashedLine(0-offsetVert, i*blockSize-offsetHorz + centerY, ctx.canvas.width+offsetVert, i * blockSize-offsetHorz + centerY, 14);
	}
	for (var i = -Math.floor(centerX/blockSize); i < Math.ceil(ctx.canvas.width/blockSize/2) + 1; i++) {
	    //Draw vert lines
	    ctx.dashedLine(i*blockSize-offsetVert + centerX, 0-offsetHorz, i * blockSize-offsetVert + centerX, ctx.canvas.height+offsetHorz, 14);
	}
	return gridImage;
}

Object.prototype.toType = function() {
	return ({}).toString.call(this).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}