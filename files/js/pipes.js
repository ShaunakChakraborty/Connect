(function () {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true, pipes,
        current = 0,
    animEndEventNames = {
        'WebkitAnimation': 'webkitAnimationEnd',
        'OAnimation': 'oAnimationEnd',
        'msAnimation': 'MSAnimationEnd',
        'animation': 'animationend'
    },
   animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
		// support css animations
		support = Modernizr.cssanimations,
    $pages = $('.pt-page'),
    pagesCount = $pages.length,
    isAnimating = false,
    endCurrPage = false,
    endNextPage = false;


    // Main
    resize();
    initAnimation();
    addListeners();
    function initHeader(numpts) {
        console.log(numpts);
        if (typeof numpts === "undefined") { numpts = 20; }
        width = window.innerWidth;
        height = window.innerHeight + 10;
        target = { x: width / 2, y: height / 2 };

        largeHeader.style.height = height + 'px';

        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for (var x = 0; x < width; x = x + width / numpts) {
            for (var y = 0; y < height; y = y + height / (numpts * 2)) {
                var px = x + Math.random() * width / 20;
                var py = y + Math.random() * height / 20;
                var p = { x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for (var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for (var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if (!(p1 == p2)) {
                    var placed = false;
                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }
        var peter = 'rgba(52, 152, 219,1)'
        var alizarin = 'rgba(231, 76, 60,1)'
        var amethyist = 'rgba(155, 89, 182,1)'
        var midnight = 'rgba(46, 204, 113,1)'
        var pumpkin = 'rgba(44, 62, 80,1)'

        var colors = [peter, alizarin, amethyist, midnight, pumpkin, peter, alizarin, amethyist, midnight, pumpkin];
        // assign a circle to each point
        for (var i in points) {
            var c = new Circle(points[i], 2 + Math.random() * 2, colors[parseInt(Math.random() * 10)]);
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if (!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if ($("html").scrollTop() > (height / 2))
            animateHeader = false;
        else
            animateHeader = true;
    }

    function resize() {
        largeHeader = document.getElementById('large-header');
        width = window.innerWidth;
        height = window.innerHeight + 10;
        largeHeader.style.height = height + 'px';
        canvas = document.getElementById('pipes-canvas');
        canvas.width = width;
        canvas.height = height;
        if (width >= 900)
            initHeader(15);
        else
            initHeader(8);
        initAnimation();
    }

    // animation
    function initAnimation() {
        animate();
        for (var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if (animateHeader) {
            ctx.clearRect(0, 0, width, height);
            for (var i in points) {
                // detect points in range
                if (Math.abs(getDistance(target, points[i])) < 3000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 1;
                } else if (Math.abs(getDistance(target, points[i])) < 10000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.7;
                } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.4;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1 + 1 * Math.random(), {
            x: p.originX - 50 + Math.random() * 100,
            y: p.originY - 50 + Math.random() * 100, ease: Circ.easeInOut,
            onComplete: function () {
                shiftPoint(p);
            }
        });
    }

    // Canvas manipulation
    function drawLines(p) {
        if (!p.active) return;
        for (var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(52, 152, 219,' + p.active + ')';
            ctx.stroke();
        }
    }

    function Circle(pos, rad, color) {
        var _this = this;

        // constructor
        (function () {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function () {
            if (!_this.active) return;
            ctx.beginPath();
            ctx.globalAlpha = _this.active;
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.globalAlpha = 1;
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    //$('a[href*=#]:not([href=#])').click(function () {
    //    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    //        var target = $(this.hash);
    //        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    //        if (target.length) {

    //            return false;
    //        }
    //    }
    //});

})();