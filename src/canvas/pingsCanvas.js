export default () => {
    const _ = {dataPings: null, pings: []};

    let start = 0;
    function interval(timestamp) {
        if ((timestamp - start) > 40) {
            start = timestamp;
            if (!this._.drag && this._.options.showPings) {
                let center;
                const proj = this._.proj;
                if (_.pings.length <= 7) {
                    center = this._.proj.invert(this._.center);
                    const visible = _.dataPings.features.filter(function(d) {
                        return d3.geoDistance(d.geometry.coordinates, center) <= 1.57
                    })
                    const d = visible[Math.floor(Math.random() * (visible.length-1))];
                    _.pings.push({r: 2.5, l: d.geometry.coordinates});
                }
                const p = _.pings[0];
                if (d3.geoDistance(p.l, this._.proj.invert(this._.center)) > 1.57) {
                    _.pings.shift();
                } else {
                    if (!this._.options.spin) {
                        this._.refresh(/anvas/);
                    }
                    this.canvasPlugin.render(function(context) {
                        context.beginPath();
                        context.fillStyle = '#F80';
                        context.arc(
                            proj(p.l)[0],
                            proj(p.l)[1], p.r,0,2*Math.PI);
                        context.fill();
                        context.closePath();
                        p.r = p.r + 0.2;
                        if (p.r>5) {
                            _.pings.shift();
                        } else if (_.pings.length>1) {
                            const d = _.pings.shift();
                            _.pings.push(d);
                        }
                    }, _.drawTo);
                }
            }
        }
    }

    return {
        name: 'pingsCanvas',
        onInit(me) {
            _.me = me;
            this._.options.showPings = true;
        },
        onInterval(t) {
            interval.call(this, t);
        },
        data(data) {
            if (data) {
                _.dataPings = data;
            } else {
                return _.dataPings;
            }
        },
        drawTo(arr) {
            _.drawTo = arr;
        },
    }
}
