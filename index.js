google.charts.load('current', {'packages':['treemap']});
google.charts.setOnLoadCallback(function(){
  drawChart(07);
});
function drawChart(year) {

  //When a node is highlighted over this displays a tool tip with current years air pollution index and change from previous year
  function showFullTooltip(row, size, value) {
    return '<div style="background: #cccccc; padding:10px; border-style:solid">' + '<span style="font-family:Helvetica Neue"><b>' + data.getValue(row, 0) +
           ' Air Pollution: </b>' + data.getValue(row,2) + '<br>' + '<b>Change from previous year:</b> ' + data.getValue(row,3) +
      '</div>';
  }

  //Sets the styling for the tree map visualization
  function drawTreeMap(table){
    var options = {
      /*highlightOnMouseOver: true,
      minHighlightColor: '#8c6bb1',
      midHighlightColor: '#9ebcda',
      maxHighlightColor: '#edf8fb', */
      minColor: '#009688',
      midColor: '#f7f7f7',
      maxColor: '#ee8100',
      headerHeight: 0,
      showScale: true,
      height: 700,
      fontSize: 60,
      fontColor: 'black',
      fontFamily: "Impact",
      useWeightedAverageForAggregation: true,
      generateTooltip: showFullTooltip
    };
    data = google.visualization.arrayToDataTable(table);
    tree.draw(data, options);
  }

  //This function fills in the tree map array with the information from the database
  function setChartData(year){
  var data = [];
  $.ajax({
      url: "https://fsl2eevdzc.execute-api.us-west-2.amazonaws.com/prod/airpolution?year=" + year,
      dataType: "json",
    }).done(function(dataCurrent){
      var table = [
        ['Location', 'Parent', 'Air Index', 'Change from Previous'],
        ['Global', null, 0, 0]
        ];

      //First year is blank and has no change so we specify it
      if(year != 07){

        //Get next years data
        year -= 1;
        $.ajax({
          url: "https://fsl2eevdzc.execute-api.us-west-2.amazonaws.com/prod/airpolution?year=" + year,
          dataType: "json",
        }).done(function(dataPast){
          console.log(dataPast);
          console.log(dataCurrent);
          $.each(dataCurrent, function(index, value){
            table.push([value["state"], 'Global', value["value"], value["value"] - dataPast[index]["value"]]);
          });
          drawTreeMap(table);
        });
      } else {
        //otherwise, use 0 for delta
        $.each(dataCurrent, function(index, value){
          table.push([value["state"], 'Global', value["value"], 0]);
        });
        drawTreeMap(table);
      }
    });
  }

  setChartData(year);

  /*Next section draws the actual tree map*/
  tree = new google.visualization.TreeMap(document.getElementById('chart_div'));       
      /*tree.draw(data, {
        minColor: '#f00',
        midColor: '#ddd',
        maxColor: '#0d0',
        headerHeight: 15,
        fontColor: 'black',
        showScale: true
      }); */

}

$(document).ready(function(){
  $('#yearSelect').change(function(){
    var year = $(this).val();
    drawChart(year);
    $("#yearText").text("20" + year);
  });
});