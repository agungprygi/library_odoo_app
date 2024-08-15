/** @odoo-module **/
import { registry } from "@web/core/registry";
import {loadJS} from "@web/core/assets";
import { onWillStart, onMounted, useState, useRef, useEffect, onWillUnmount } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
const actionRegistry = registry.category("actions");
import { _t } from "@web/core/l10n/translation";
const { DateTime } = luxon;
import {getColor} from "@web/core/colors/colors"
var op_type;
/* This class represents dashboard in Inventory. */

class KpiCard extends owl.Component{
    setup(){
    }
}

class ChartJSRenderer extends owl.Component{
    setup(){
        this.chartRef = useRef("chart");
        onWillStart(async () => {
            await loadJS("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js")
        })

        useEffect(()=> {
          this.renderChart()
        }, ()=>[this.props.config]);

        onMounted(()=> this.renderChart());

        onWillUnmount(()=>{
          if(this.chartJS){
            this.chartJS.destroy();
          }
        })
    }

    renderChart(){
        if(this.chartJS){
          this.chartJS.destroy();
        }
        this.chartJS = new Chart(
            this.chartRef.el,
            {
              type: this.props.type,
              data: this.props.config.data,
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  title: {
                    display: true,
                    text: this.props.title
                  }
                }
              },
            }
          );
    }
}

class AmJSRenderer extends owl.Component{
    setup(){
        this.amChartRef = useRef("amChart");
        onWillStart(async () => {
            await Promise.all(
                [loadJS('https://cdn.amcharts.com/lib/5/index.js'),
                 loadJS('https://cdn.amcharts.com/lib/5/xy.js'),
                 loadJS('https://cdn.amcharts.com/lib/5/themes/Animated.js')
                ]
            );
        });

        // useEffect(()=> {
        //   this.renderAmChart()
        // }, ()=>[this.props.config]);

        onMounted(()=> this.renderAmChart());
    };

    renderAmChart(){
        var ref = this.amChartRef.el;
        var chartType = this.props.type || 'column-chart';
        var chartData = this.props.config;
        am5.ready(function() {

            // Create root element
            var root = am5.Root.new(ref);
            
            // Set themes
            root.setThemes([
              am5themes_Animated.new(root)
            ]);
            
            //Here to rule the chart type
            switch (chartType) {
                case 'column-chart':
                  var chart = root.container.children.push(am5xy.XYChart.new(root, {
                    panX: false,
                    panY: false,
                    paddingLeft: 0,
                    wheelX: "panX",
                    wheelY: "zoomX",
                    layout: root.verticalLayout
                  }));
                  
                  
                  // Add legend
                  // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
                  var legend = chart.children.push(
                    am5.Legend.new(root, {
                      centerX: am5.p50,
                      x: am5.p50
                    })
                  );
                  
                  var data = chartData;
                  
                  var xRenderer = am5xy.AxisRendererX.new(root, {
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9,
                    minorGridEnabled: true
                  })
                  
                  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                    categoryField: "date",
                    renderer: xRenderer,
                    tooltip: am5.Tooltip.new(root, {})
                  }));
                  
                  xRenderer.grid.template.setAll({
                    location: 1
                  })
                  
                  xAxis.data.setAll(data);
                  
                  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                    renderer: am5xy.AxisRendererY.new(root, {
                      strokeOpacity: 0.1
                    })
                  }));
                  
                  function makeSeries(name, fieldName) {
                    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                      name: name,
                      xAxis: xAxis,
                      yAxis: yAxis,
                      valueYField: fieldName,
                      categoryXField: "date"
                    }));
                  
                    series.columns.template.setAll({
                      tooltipText: "{name}, {categoryX}:{valueY}",
                      width: am5.percent(90),
                      tooltipY: 0,
                      strokeOpacity: 0
                    });
                  
                    series.data.setAll(data);
                  
                    // Make stuff animate on load
                    // https://www.amcharts.com/docs/v5/concepts/animations/
                    series.appear();
                
                  
                    legend.data.push(series);
                  }
                  
                  makeSeries("Quotations", "quotation")
                  makeSeries("Orders", "order")
                  
                  
                  
                  // Make stuff animate on load
                  // https://www.amcharts.com/docs/v5/concepts/animations/
                  chart.appear(1000, 100);
                    break;
                case 'combo-chart':
                  var chart = root.container.children.push(
                    am5xy.XYChart.new(root, {
                      panX: false,
                      panY: false,
                      wheelX: "panX",
                      wheelY: "zoomX",
                      paddingLeft: 0,
                      layout: root.verticalLayout
                    })
                  );
                  
                  var data = chartData;
                  
                  var yRenderer = am5xy.AxisRendererY.new(root, {
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9,
                    minorGridEnabled: true
                  });
                  
                  yRenderer.grid.template.set("location", 1);
                  
                  var yAxis = chart.yAxes.push(
                    am5xy.CategoryAxis.new(root, {
                      categoryField: "partnerId",
                      renderer: yRenderer,
                      tooltip: am5.Tooltip.new(root, {})
                    })
                  );
                  
                  yAxis.data.setAll(data);
                  
                  var xAxis = chart.xAxes.push(
                    am5xy.ValueAxis.new(root, {
                      min: 0,
                      renderer: am5xy.AxisRendererX.new(root, {
                        strokeOpacity: 0.1,
                        minGridDistance:70
                      })
                    })
                  );

                  var xAxis2 = chart.xAxes.push(
                    am5xy.ValueAxis.new(root, {
                      min: 0,
                      renderer: am5xy.AxisRendererX.new(root, {
                        opposite: true,
                      })
                    })
                  );
                  
                  
                  // Add series
                  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
                  var series1 = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: "Total Amount",
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueXField: "totalAmount",
                    categoryYField: "partnerId",
                    sequencedInterpolation: true,
                    tooltip: am5.Tooltip.new(root, {
                      pointerOrientation: "horizontal",
                      labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
                    })
                  }));
                  
                  series1.columns.template.setAll({
                    height: am5.percent(70)
                  });
                  
                  
                  var series2 = chart.series.push(am5xy.LineSeries.new(root, {
                    name: "Order Quantity",
                    xAxis: xAxis2,
                    yAxis: yAxis,
                    valueXField: "orderQty",
                    categoryYField: "partnerId",
                    sequencedInterpolation: true,
                    tooltip: am5.Tooltip.new(root, {
                      pointerOrientation: "horizontal",
                      labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
                    })
                  }));
                  
                  series2.strokes.template.setAll({
                    strokeWidth: 2,
                  });
                  
                  series2.bullets.push(function () {
                    return am5.Bullet.new(root, {
                      locationY: 0.5,
                      sprite: am5.Circle.new(root, {
                        radius: 5,
                        stroke: series2.get("stroke"),
                        strokeWidth: 2,
                        fill: root.interfaceColors.set("fill", am5.color("#D5ED9F"))
                      })
                    });
                  });
                  
                  
                  // Add legend
                  // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
                  var legend = chart.children.push(am5.Legend.new(root, {
                    centerX: am5.p50,
                    x: am5.p50
                  }));
                  
                  legend.data.setAll(chart.series.values);
                  
                  // Add cursor
                  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
                  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                    behavior: "zoomY"
                  }));
                  cursor.lineX.set("visible", false);
                  
                  series1.data.setAll(data);
                  series2.data.setAll(data);
                  series1.set("fill", am5.color("#8DECB4"));
                  series2.set("stroke", am5.color("#008080"));
                  series2.set("fill", am5.color("#008080"));
                  
                  // Make stuff animate on load
                  // https://www.amcharts.com/docs/v5/concepts/animations/
                  series1.appear();
                  series2.appear();
                  chart.appear(1000, 100);
                    break;
            
                default:
                  console.log("undefine chart")
                  break;
            }
            });
    }


}

class Dashboard extends owl.Component{
    async getTopProducts(){

      let domain = [['state', 'in', ['sale', 'done']]];
      if(this.state.period > 0){
        domain.push(['date','>', this.state.current_date])
      }

      const data = await this.orm.readGroup("sale.report", domain, ['product_id', 'price_total'], ['product_id'], {limit: 5, orderby : "price_total desc"});

      this.state.topProducts = {
        data: {
          labels: data.map(d=>d.product_id[1]),
            datasets: [{
              label: 'Total',
              data: data.map(d=>d.price_total),
              hoverOffset: 4, 
              backgroundColor: data.map((_, index) => getColor(index, "bright"))
            },
            {
              label: 'Count',
              data: data.map(d=>d.product_id_count),
              hoverOffset: 4,
              backgroundColor: data.map((_, index) => getColor(index, "bright"))
            },
          ]
        },
      }
    }

    async getTopSalesPeople(){
      let domain = [['state', 'in', ['sale', 'done']]];
      if(this.state.period > 0){
        domain.push(['date','>', this.state.current_date])
      }

      const data = await this.orm.readGroup("sale.report", domain, ['user_id', 'price_total'], ['user_id'], {limit: 5, orderby : "price_total desc"});

      this.state.topSalesPeople = {
        data: {
          labels: data.map(d=>d.user_id[1]),
            datasets: [{
              label: 'Total',
              data: data.map(d=>d.price_total),
              hoverOffset: 4, 
              backgroundColor: data.map((_, index) => getColor(index, "bright"))
            },
          ]
        },
      }
    }

    async getMonthlySales(){
      
      let domain = [['state', 'in', ['draft','sent','sale', 'done']]];
      if(this.state.period > 0){
        domain.push(['date','>', this.state.current_date])
      }

      const data = await this.orm.readGroup("sale.report", domain, ['date', 'state', 'price_total'], ['date', 'state'], {orderby : "date", lazy:false});
      
      let sales_data = {
        labels: [...new Set(data.map(d=>d.date))],
        datasets: [{
          label: 'Qoutations',
          data: data.filter(d=> d.state == 'draft' || d.state == 'sent').map(d=>d.price_total),
        },
        {
          label: 'Orders',
          data: data.filter(d=> ['sale', 'done'].includes(d.state)).map(d=>d.price_total),
        },]
      }

      function restructureData(data) {
        const result = [];
        const { labels, datasets } = data;
        let orderIndex = 0;
      
        for (let i = 0; i < datasets[0].data.length; i += 2) {
          const date = labels[orderIndex];
          const quotation = datasets[0].data[i] + datasets[0].data[i + 1];
          const order = datasets[1].data[orderIndex];
          result.push({ date, quotation, order });
          orderIndex++;
        }
      
      return result;
      }
    
      const restructuredData = restructureData(sales_data)
    
  
      this.state.monthlySales = restructuredData;
    }

    async getPartnerOrders(){
      let domain = [['state', 'in', ['draft','sent','sale', 'done']]];
      if(this.state.period > 0){
        domain.push(['date','>', this.state.current_date])
      }

      const data = await this.orm.readGroup("sale.report", domain, ['partner_id', 'price_total', 'product_uom_qty'], ['partner_id'], {orderby : "partner_id", lazy:false});
      
      let partnerData = {
        labels: data.map(d=>d.partner_id[1]),
        datasets: [{
          label: 'Total Amount',
          data: data.map(d=>d.price_total),
        },
        {
          label: 'Ordered Qty',
          data: data.map(d=>d.product_uom_qty),
        },]
      }

      function restructureData(data) {
        const result = [];
        const { labels, datasets } = data;
        let orderIndex = 0;
      
        for (let i = 0; i < labels.length; i ++) {
          const partnerId = labels[i];
          const totalAmount = datasets[0].data[i];
          const orderQty = datasets[1].data[i]
          result.push({ partnerId, totalAmount, orderQty });
        }
      
      return result;
      }
    
      const restructuredData = restructureData(partnerData);

      this.state.partnerOrders = restructuredData;
    }

    setup(){
        this.state = useState({
          period:0
        });
        this.orm = useService("orm");
        this.actionService = useService("action")

        onWillStart(async ()=>{
            this.getDates();
            await this.getQuotations();
            await this.getOrders();
            await this.getTopProducts();
            await this.getTopSalesPeople();
            await this.getMonthlySales();
            await this.getPartnerOrders();
        })
    }

    async setPeriod(){
      this.getDates();
      await this.getQuotations();
      await this.getOrders()
      await this.getTopProducts();
      await this.getTopSalesPeople();
      await this.getMonthlySales();
      await this.getPartnerOrders();
    }

    getDates(){
      this.state.current_date = DateTime.now().minus({days: this.state.period}).toISODate();
      this.state.prev_date = DateTime.now().minus({days: this.state.period * 2}).toISODate();
    }

    async getQuotations(){
      let domain = [['state', 'in', ['sent', 'draft']]];
      if(this.state.period > 0){
        domain.push(['date_order','>', this.state.current_date])
      }
      const data = await this.orm.searchCount("sale.order", domain);
      // this.state.quotations.value = data;

      //previous date
      let prev_domain = [['state', 'in', ['sent', 'draft']]];
      if(this.state.period > 0){
        prev_domain.push(['date_order','>', this.state.prev_date], ['date_order','<=', this.state.current_date])
      }
      const prev_data = await this.orm.searchCount("sale.order", prev_domain);
      const percentage = ((data - prev_data)/prev_data) * 100;
      // this.state.quotations.percentage = percentage.toFixed(2);

      this.state.quotations = {
        value: data,
        percentage : percentage.toFixed(2)
      };
    }

    async getOrders(){
      let domain = [['state', 'in', ['sale', 'done']]];
      if(this.state.period > 0){
        domain.push(['date_order','>', this.state.current_date])
      }
      const data = await this.orm.searchCount("sale.order", domain);
      

      //previous date
      let prev_domain = [['state', 'in', ['sale', 'done']]];
      if(this.state.period > 0){
        prev_domain.push(['date_order','>', this.state.prev_date], ['date_order','<=', this.state.current_date]);
      }
      const prev_data = await this.orm.searchCount("sale.order", prev_domain);
      const percentage = ((data - prev_data)/prev_data) * 100;

      // revenue order
      const current_revenue  = await this.orm.readGroup("sale.order", domain, ["amount_total:sum"],[]);
      const prev_revenue  = await this.orm.readGroup("sale.order", prev_domain, ["amount_total:sum"],[]);
      const rev_percentage = ((current_revenue[0].amount_total - prev_revenue[0].amount_total)/prev_revenue[0].amount_total) * 100;
      
      // revenue order
      const current_avg  = await this.orm.readGroup("sale.order", domain, ["amount_total:avg"],[]);
      const prev_avg  = await this.orm.readGroup("sale.order", prev_domain, ["amount_total:avg"],[]);
      const avg_percentage = ((current_avg[0].amount_total - prev_avg[0].amount_total)/prev_avg[0].amount_total) * 100;

      this.state.orders = {
        value: data,
        percentage: percentage.toFixed(2),
        revenue: `$${(current_revenue[0].amount_total/1000).toFixed(2)}K`,
        rev_percentage: rev_percentage.toFixed(2),
        avg: `$${(current_avg[0].amount_total/1000).toFixed(2)}K`,
        avg_percentage: avg_percentage.toFixed(2),
      };
    }

    async viewQuotations(){
      let domain = [['state', 'in',['sent', 'draft']]];
      if (this.state.period > 0){
        domain.push(['date_order', '>', this.state.current_date]);
      }
      let list_view = await this.orm.searchRead("ir.model.data", [['name', '=', 'view_quotation_tree_with_onboarding']], ['res_id'])

      this.actionService.doAction({
        type: "ir.actions.act_window",
        name: "Quotations",
        res_model: "sale.order",
        domain,
        views : [
          [list_view.length > 0 ? list_view[0].res_id : false, "list"],
          [false, "form"]
        ]
      });
    };

    viewOrders(){
      let domain = [['state', 'in',['sale', 'done']]];
      if (this.state.period > 0){
        domain.push(['date_order', '>', this.state.current_date]);
      }
      

      this.actionService.doAction({
        type: "ir.actions.act_window",
        name: "Quotations",
        res_model: "sale.order",
        domain,
        context: {group_by: ['date_order']},
        views : [
          [false, "list"],
          [false, "form"]
        ]
      });
    };

    viewRevenues(){
      let domain = [['state', 'in',['sale', 'done']]];
      if (this.state.period > 0){
        domain.push(['date_order', '>', this.state.current_date]);
      }
      

      this.actionService.doAction({
        type: "ir.actions.act_window",
        name: "Quotations",
        res_model: "sale.order",
        domain,
        context: {group_by: ['date_order']},
        views : [
          [false, "pivot"],
          [false, "form"]
        ]
      });
    };
};
Dashboard.template = "Dashboard";
KpiCard.template = "KpiCard";
ChartJSRenderer.template = "ChartJSRenderer";
AmJSRenderer.template = "AmChartRenderer";
Dashboard.components = {KpiCard, ChartJSRenderer, AmJSRenderer};
actionRegistry.add('sales_dashboard_tag', Dashboard);
