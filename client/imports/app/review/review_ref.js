
         
            function dist2(p1, p2) {
                var dx = p1[0] - p2[0];
                var dy = p1[1] - p2[1];
                return dx * dx + dy * dy;
            }
            
            window.onload = function() {
                var canvas = document.getElementById("canvas");
                var context = canvas.getContext("2d");
                
                function draw_marker(x, y, r) {
                    context.beginPath();
                    context.arc(x, y, r, 0, Math.PI*2);
                    context.closePath();
                    context.fillStyle = "#00F";
                    context.fill();
                }
                
                function draw_segment(x1, y1, x2, y2) {
                    
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    context.strokeStyle = "#0F0";
                    context.stroke();
                    context.closePath();
                }
                
                function simplify_spline(spold, tolerance) {
                    // Simplifies the source spline by trying to find a smaller set of points
                    // which fit within @tolerance.
                    
                    var tolerance2 = tolerance ? tolerance * tolerance : 10;
                    //var subdivide = [ 1./4, 3./8, 1./2, 5./8, 3./4 ];
                    var ts = [ 0, 1 ];
                    var spnew = numeric.spline(ts, spold.at(ts));
                    
                    for (var j=0; j<6; j++) {
                        for (var i=ts.length-1; i>0; i--) {
                            var mt;
                            var mdd = 0;
                            for (var k in subdivide) {    
                                var t = ts[i] * subdivide[k] + ts[i-1] * (1 - subdivide[k]);
                                
                                var po = spold.at(t);
                                var pn = spnew.at(t);
                                var dd = dist2(po, pn);
                            
                                if (dd > mdd) {
                                    mt = t;
                                    mdd = dd;
                                }
                            }
                            if (mdd > tolerance2) {
                                ts.splice(i, 0, mt);
                            }
                        }
                        spnew = numeric.spline(ts, spold.at(ts));
                    }
                    
                    for (var i=0; i<ts.length; i++) {
                        var xy = spnew.at(ts[i]);
                        //draw_marker(xy[0], xy[1], 5);
                    }
                    return spnew;
                }
                
                function draw_spline(spline, style) {
                    var xys = spline.at(numeric.linspace(0,1,100));
                    context.beginPath();
                    context.moveTo(xys[0][0], xys[0][1]);
                    for (var i=1; i<xys.length; i++) {
                        context.lineTo(xys[i][0], xys[i][1]);
                    }
                    context.strokeStyle = style;
                    context.stroke();
                    context.closePath();
                }
                
                canvas.onmousedown = canvas.ontouchstart = function (e) {
                    
                    var td = 0;
                    var ox = e.clientX || e.touches[0].pageX;
                    var oy = e.clientY || e.touches[0].pageY;
                    var xys = [ [ox, oy] ];
                    var dds = [ 0 ]; 
                    
                    canvas.onmousemove = canvas.ontouchmove = function (e) {
                        e.preventDefault();
                        
                        var nx = e.clientX || e.touches[0].pageX;
                        var ny = e.clientY || e.touches[0].pageY;
                        
                        var dx = nx - ox;
                        var dy = ny - oy;
                        var dd = Math.sqrt(dx*dx + dy*dy);
                        if (dd > 10) {
                            draw_segment(ox, oy, nx, ny);
                            xys.push([nx, ny]);
                            td += dd;
                            dds.push(td);
                            ox = nx;
                            oy = ny;
                        }
                    }
                    
                    canvas.onmouseup = canvas.onmouseout = canvas.ontouchend = function (e) {
                        canvas.onmousemove = canvas.ontouchmove = null;
                        
                        if (dds.length > 1) {
                            var ts = [];
                            for (var i in dds) {
                                ts.push(dds[i]/td);
                            }
                            var ss = numeric.spline(ts, xys);
                            draw_spline(ss, "#F00");
                            
                            var ss2 = simplify_spline(ss);
                            draw_spline(ss2, "#00F");
                        }    
                    };
                    
                }
                
                
            };            
        