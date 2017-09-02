// KoGor’s Block http://bl.ocks.org/KoGor/5994804
export default countryNameUrl => {
    /*eslint no-console: 0 */
    const _ = {show: false};
    const countryTooltip = d3.select('body').append('div').attr('class', 'ej-country-tooltip');

    function countryName(d) {
        let cname = '';
        if (_.countryNames) {
            cname = _.countryNames.find(function(x) {
                return x.id==d.id;
            });
        }
        return cname;
    }

    function create() {
        const _this = this;
        this.worldSvg.$countries()
        .on('mouseover', function(d) {
            if (_this._.options.showCountryTooltip) {
                _.show = true;
                const country = countryName(d);
                refresh();
                _.me.show(country, countryTooltip)
                .style('display', 'block')
                .style('opacity', 1);
            }
        })
        .on('mouseout', function() {
            _.show = false;
            countryTooltip.style('opacity', 0)
            .style('display', 'none');
        })
        .on('mousemove', function() {
            if (_this._.options.showCountryTooltip) {
                refresh();
            }
        });
    }

    function refresh(mouse) {
        if (!mouse) {
            mouse = [d3.event.pageX, d3.event.pageY];
        }
        return countryTooltip
        .style('left', (mouse[0] + 7) + 'px')
        .style('top', (mouse[1] - 15) + 'px')
    }

    return {
        name: 'countryTooltipSvg',
        urls: countryNameUrl && [countryNameUrl],
        onReady(err, countryNames) {
            _.countryNames = countryNames;
        },
        onInit(me) {
            _.me = me;
            this._.options.showCountryTooltip = true;
        },
        onCreate() {
            create.call(this);
        },
        onRefresh() {
            if (this._.drag && _.show) {
                refresh(this.mousePlugin.mouse());
            }
        },
        show(props, tooltip) {
            const title = Object.keys(props).map(k => k+': '+props[k]).join('<br/>');
            return tooltip.html(title)
        },
        data(data) {
            if (data) {
                _.countryNames = data;
            } else {
                return _.countryNames;
            }
        },
    }
}
