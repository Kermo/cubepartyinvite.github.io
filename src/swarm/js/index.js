+(function(root) {
    var Vector3D = function Vector3D(x, y, z) {
        this.set(x, y, z);
    }, v3dp = Vector3D.prototype;

    v3dp.dot2d = function(x, y) {
        return ((this.x * x) + (this.y * y));
    };

    v3dp.dot3d = function(x, y, z) {
        return ((this.x * x) + (this.y * y) + (this.z * z));
    };

    v3dp.set = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    };

    v3dp.add = function(other) {
        if(typeof other === "number") {
            this.x += other, this.y += other, this.z += other;
            return this;
        }
        this.x += other.x, this.y += other.y, this.z += other.z;
        return this;
    };

    v3dp.sub = function(other) {
        if(typeof other === "number") {
            this.x -= other, this.y -= other, this.z -= other;
            return this;
        }
        this.x -= other.x, this.y -= other.y, this.z -= other.z;
        return this;
    };

    v3dp.mul = function(other) {
        if(typeof other === "number") {
            this.x *= other, this.y *= other, this.z *= other;
            return this;
        }
        this.x *= other.x, this.y *= other.y, this.z *= other.z;
        return this;
    };

    v3dp.div = function(other) {
        if(typeof other === "number") {
            this.x /= other, this.y /= other, this.z /= other;
            return this;
        }
        this.x /= other.x, this.y /= other.y, this.z /= other.z;
        return this;
    };

    v3dp.move = function(dest) {
        if(dest instanceof Vector3D) {
            dest.x = this.x, dest.y = this.y, dest.z = this.z;
        }
        return this;
    };

    v3dp.within2d = function(bounds) {
        if(this.x > bounds.x) {
            this.x = 0;
            return true;
        }

        if(this.x < 0) {
            this.x = bounds.x;
            return true;
        }

        if(this.y > bounds.y) {
            this.y = 0;
            return true;
        }

        if(this.y < 0) {
            this.y = bounds.y;
            return true;
        }
    };

    v3dp.wrap2d = function(bounds) {
        if(this.x > bounds.x) {
            this.x = 0;
            return true;
        }

        if(this.x < 0) {
            this.x = bounds.x;
            return true;
        }

        if(this.y > bounds.y) {
            this.y = 0;
            return true;
        }

        if(this.y < 0) {
            this.y = bounds.y;
            return true;
        }
    };

    v3dp.eq = function(other) {
        return (other instanceof Vector3D) && this.x === other.x && this.y === other.y && this.z === other.z;
    };

    v3dp.distance = function(other) {
        var dx = (this.x - other.x),
            dy = (this.y - other.y);

        return Math.sqrt(dx * dx + dy * dy);
    };

    v3dp.clone = function() {
        return new Vector3D(this.x, this.y, this.z);
    };

    root.Vector3D = Vector3D;
}(window));

+(function(root) {
    var Perlin = function Perlin() {
        this.grad3 = [
            new Vector3D(1,1,0), new Vector3D(-1,1,0), new Vector3D(1,-1,0), new Vector3D(-1,-1,0),
            new Vector3D(1,0,1), new Vector3D(-1,0,1), new Vector3D(1,0,-1), new Vector3D(-1,0,-1),
            new Vector3D(0,1,1), new Vector3D(0,-1,1), new Vector3D(0,1,-1), new Vector3D(0,-1,-1)
        ];

        this.p = [
            0x97, 0xa0, 0x89, 0x5b, 0x5a, 0x0f, 0x83, 0x0d, 0xc9, 0x5f, 0x60, 0x35, 0xc2, 0xe9, 0x07, 0xe1,
            0x8c, 0x24, 0x67, 0x1e, 0x45, 0x8e, 0x08, 0x63, 0x25, 0xf0, 0x15, 0x0a, 0x17, 0xbe, 0x06, 0x94,
            0xf7, 0x78, 0xea, 0x4b, 0x00, 0x1a, 0xc5, 0x3e, 0x5e, 0xfc, 0xdb, 0xcb, 0x75, 0x23, 0x0b, 0x20,
            0x39, 0xb1, 0x21, 0x58, 0xed, 0x95, 0x38, 0x57, 0xae, 0x14, 0x7d, 0x88, 0xab, 0xa8, 0x44, 0xaf,
            0x4a, 0xa5, 0x47, 0x86, 0x8b, 0x30, 0x1b, 0xa6, 0x4d, 0x92, 0x9e, 0xe7, 0x53, 0x6f, 0xe5, 0x7a,
            0x3c, 0xd3, 0x85, 0xe6, 0xdc, 0x69, 0x5c, 0x29, 0x37, 0x2e, 0xf5, 0x28, 0xf4, 0x66, 0x8f, 0x36,
            0x41, 0x19, 0x3f, 0xa1, 0x01, 0xd8, 0x50, 0x49, 0xd1, 0x4c, 0x84, 0xbb, 0xd0, 0x59, 0x12, 0xa9,
            0xc8, 0xc4, 0x87, 0x82, 0x74, 0xbc, 0x9f, 0x56, 0xa4, 0x64, 0x6d, 0xc6, 0xad, 0xba, 0x03, 0x40,
            0x34, 0xd9, 0xe2, 0xfa, 0x7c, 0x7b, 0x05, 0xca, 0x26, 0x93, 0x76, 0x7e, 0xff, 0x52, 0x55, 0xd4,
            0xcf, 0xce, 0x3b, 0xe3, 0x2f, 0x10, 0x3a, 0x11, 0xb6, 0xbd, 0x1c, 0x2a, 0xdf, 0xb7, 0xaa, 0xd5,
            0x77, 0xf8, 0x98, 0x02, 0x2c, 0x9a, 0xa3, 0x46, 0xdd, 0x99, 0x65, 0x9b, 0xa7, 0x2b, 0xac, 0x09,
            0x81, 0x16, 0x27, 0xfd, 0x13, 0x62, 0x6c, 0x6e, 0x4f, 0x71, 0xe0, 0xe8, 0xb2, 0xb9, 0x70, 0x68,
            0xda, 0xf6, 0x61, 0xe4, 0xfb, 0x22, 0xf2, 0xc1, 0xee, 0xd2, 0x90, 0x0c, 0xbf, 0xb3, 0xa2, 0xf1,
            0x51, 0x33, 0x91, 0xeb, 0xf9, 0x0e, 0xef, 0x6b, 0x31, 0xc0, 0xd6, 0x1f, 0xb5, 0xc7, 0x6a, 0x9d,
            0xb8, 0x54, 0xcc, 0xb0, 0x73, 0x79, 0x32, 0x2d, 0x7f, 0x04, 0x96, 0xfe, 0x8a, 0xec, 0xcd, 0x5d,
            0xde, 0x72, 0x43, 0x1d, 0x18, 0x48, 0xf3, 0x8d, 0x80, 0xc3, 0x4e, 0x42, 0xd7, 0x3d, 0x9c, 0xb4
        ];

        this.permutation = new Array(512);
        this.gradP = new Array(512);

        // skew and unskew factors for 2D or 3D, can be modified per state!
        this.F2 = (0.5 * (Math.sqrt(3) - 1));
        this.G2 = ((3 - Math.sqrt(3)) / 6);
        this.F3 = (1 / 3);
        this.G3 = (1 / 6);
    }, pp = Perlin.prototype;


    pp.init = function(prng) {
        if(typeof prng !== "function") {
            throw new TypeError("prng needs to be a function returning an int between 0 and 255");
        }

        for(var i = 0; i < 256; i += 1) {
            var randval = (this.p[i] ^ prng());
            this.permutation[i] = this.permutation[i + 256] = randval;
            this.gradP[i] = this.gradP[i + 256] = this.grad3[randval % this.grad3.length];
        }
    };

    pp.simplex3d = function(x, y, z) {
        var n0, n1, n2, n3, i1, j1, k1, i2, j2, k2,
            x1, y1, z1, x2, y2, z2, x3, y3, z3,
            gi0, gi1, gi2, gi3, t0, t1, t2, t3,
            s = ((x + y + z) * this.F3),
            i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s),
            t = ((i + j + k) * this.G3),
            x0 = (x - i + t), y0 = (y - j + t), z0 = (z - k + t);

        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
        } else {
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
        }

        x1 = (x0 - i1 + this.G3), y1 = (y0 - j1 + this.G3), z1 = (z0 - k1 + this.G3);
        x2 = (x0 - i2 + 2 * this.G3), y2 = (y0 - j2 + 2 * this.G3), z2 = (z0 - k2 + 2 * this.G3);
        x3 = (x0 - 1 + 3 * this.G3), y3 = (y0 - 1 + 3 * this.G3), z3 = (z0 - 1 + 3 * this.G3);

        i &= 255, j &= 255, k &= 255;

        gi0 = this.gradP[i + this.permutation[j + this.permutation[k]]];
        gi1 = this.gradP[i + i1 + this.permutation[j + j1 + this.permutation[k + k1]]];
        gi2 = this.gradP[i + i2 + this.permutation[j + j2 + this.permutation[k + k2]]];
        gi3 = this.gradP[i + 1 + this.permutation[j + 1 + this.permutation[k + 1]]];

        t0 = (0.6 - x0 * x0 - y0 * y0 - z0 * z0);
        t1 = (0.6 - x1 * x1 - y1 * y1 - z1 * z1);
        t2 = (0.6 - x2 * x2 - y2 * y2 - z2 * z2);
        t3 = (0.6 - x3 * x3 - y3 * y3 - z3 * z3);
        n0 = (t0 < 0 ? 0 : (t0 *= t0, t0 * t0 * gi0.dot3d(x0, y0, z0)));
        n1 = (t1 < 0 ? 0 : (t1 *= t1, t1 * t1 * gi1.dot3d(x1, y1, z1)));
        n2 = (t2 < 0 ? 0 : (t2 *= t2, t2 * t2 * gi2.dot3d(x2, y2, z2)));
        n3 = (t3 < 0 ? 0 : (t3 *= t3, t3 * t3 * gi3.dot3d(x3, y3, z3)));

        return (32 * (n0 + n1 + n2 + n3));
    };

    root.Perlin = Perlin;
}(window));

;(function(root) {
    var MouseMonitor = function(element) {
        this.mPosition = new Vector3D(0, 0, 0);
        this.state = {left: false, middle: false, right: false};
        this.element = element;

        var that = this;
        element.addEventListener('mousemove', function(event) {
            var dot;
            var eventDoc;
            var doc;
            var body;
            var pageX;
            var pageY;
            event = event || window.event;

            if(event.pageX == null && event.clientX != null) {
                eventDoc = (event.target && event.target.ownerDocument) || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }

            that.mPosition.x = event.pageX;
            that.mPosition.y = event.pageY;
        });

        element.addEventListener('mousedown', function(event) {
            if(event.which === 1) that.state.left = true;
            if(event.which === 3 ) that.state.right = true;

            return event.preventDefault();
        });

        element.addEventListener('mouseup', function(event) {
            that.state.right = that.state.left = false;

            return event.preventDefault();
        });
    };

    root.MouseMonitor = MouseMonitor;

}(window));

+(function(root) {
    var Particle = function Particle(generator_, bounds_, ctx_, mon_) {
        this.position = new Vector3D();
        this.trailTo = new Vector3D();
        this.velocity = new Vector3D();
        this.generator = generator_;
        this.bounds = bounds_;
        this.ctx = ctx_;
        this.mousemon = mon_;

        this.reset();

    }, pp = Particle.prototype;


    pp.reset = function() {

        // new random location
        this.position.x = this.trailTo.x = Math.floor(this.ctx.random() * this.bounds.x);
        this.position.y = this.trailTo.y = Math.floor(this.ctx.random() * this.bounds.y);

        // reset velocity
        this.velocity.set(1, 1, 0);

        // iteration
        this.iteration = 0;

        // lifetime before particle respawns
        this.lifetime = this.ctx.random(1000, 10000);
    };

    pp.step = function() {

        if (this.iteration++ > this.lifetime) {
            this.reset();
        }

        var xx = (this.position.x / 200);
        var yy = (this.position.y / 200);
        var zz = (Date.now() / 5000);
        var a = (this.ctx.random() * 2 * Math.PI);
        var rnd = (this.ctx.random() / 4);

        this.velocity.x += (rnd * Math.sin(a) + this.generator.simplex3d(xx, yy, -zz)); // sin or cos, no matter
        this.velocity.y += (rnd * Math.cos(a) + this.generator.simplex3d(xx, yy, zz)); // opposite zz's matters

        if (this.mousemon.state.left) {
            this.velocity.add(this.mousemon.position.clone().sub(this.position).mul(.00085));
        }
        if(this.mousemon.state.right && this.position.distance(this.mousemon.position) < this.ctx.random(200, 250)) {
            this.velocity.add(this.position.clone().sub(this.mousemon.position).mul(.02));
        }

        // keep a copy of the current position, for a nice line between then and now and add velocity
        this.position.move(this.trailTo).add(this.velocity.mul(.94)); // slow down the velocity slightly

        // wrap around the edges
        if(this.position.wrap2d(this.bounds)) {
            this.position.move(this.trailTo);
        }
    };

    pp.render = function(context) {
        context.moveTo(this.trailTo.x, this.trailTo.y);
        context.lineTo(this.position.x, this.position.y);
    };

    root.Particle = Particle;
}(window));

window.addEventListener('load', function () {
    var ctx = new SmallPRNG(new Date());
    var p = new Perlin();
    var canvas = document.getElementById("swarm");
    var context = canvas.getContext("2d");
    var monitor = new MouseMonitor(canvas);
    var particles = [];
    var width, height, bounds = new Vector3D(0,0,0);
    var hue = 0;
    var settings = {
        particleNum: 10000,
        fadeOverlay: true,
        staticColor: {r: 0, g: 75, b: 50},
        staticColorString: 'rgba(0, 75, 50, 0.55)'
    };
	
	document.getElementById("audio").play();

    // seed perlin with random bytes from smallprng
    p.init(function() {
        return ctx.random(0, 255);
    });

    var resize = function() {
        canvas.width = width = bounds.x = window.innerWidth;
        canvas.height = height = bounds.y = window.innerHeight;

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, width, height);
    };

    resize();

    window.addEventListener('resize', resize);

    for (var i = 0; i < settings.particleNum; i++) {
        particles.push(new Particle(p, bounds, ctx, monitor));
    }

    +(function render() {
        requestAnimationFrame(render);

        context.beginPath();
        // render each particle and trail
        for(var i = 0; i < particles.length; i++) {
            particles[i].step();
            particles[i].render(context);
        }

        context.globalCompositeOperation = 'source-over';
        context.fillStyle = 'rgba(0, 0, 0, 1)';
        context.fillRect(0, 0, width, height);

        context.globalCompositeOperation = 'lighter';
        context.strokeStyle = 'hsla(' + hue + ', 75%, 50%, .55)';

        context.stroke();
        context.closePath();

        hue = ((hue + .5) % 360);
    }());

    var intro = $("#intro")
        .fadeIn(2000)
        .delay(2000)
        .fadeOut(2000);
});

