global.MiscFunctions = {};
global.MiscFunctions.distance = function( x1, y1, x2, y2 )
{
    var xs = 0;
    var ys = 0;

    xs = x2 - x1;
    xs = xs * xs;

    ys = y2 - y1;
    ys = ys * ys;

   return Math.sqrt( xs + ys );
}
global.MiscFunctions.rectCollide = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    var e;
    if (x1 > x2) {
        e = x2;
        x2 = x1;
        x1 = e;
    }
    if (y1 > y2) {
        e = y2;
        y2 = y1;
        y1 = e;
    }
    if (x3 > x4) {
        e = x4;
        x4 = x3;
        x3 = e;
    }
    if (y3 > y4) {
        e = y4;
        y4 = y3;
        y3 = e;
    }
    return !(x3 > x2 || 
           x4 < x1 || 
           y3 > y2 ||
           y4 < y1);
}