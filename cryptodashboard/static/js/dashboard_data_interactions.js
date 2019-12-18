var table_data = [];
var user_assets = [];

function generate_table() {
  // get the reference for the body
  var tbl = document.getElementById("dataTable");

  // creates all table elements
  var tblHead = document.createElement("thead");
  var tblFoot = document.createElement("tfoot");
  var tblBody = document.createElement("tbody");
  //create header and footer
  var headers = ['#', 'Name', 'Price $', 'Change(24h)', 'Change(7d)', 'Market-Cap.', 'Circulation-Supply', 'Volume.(24h)']
  var headRow = document.createElement("tr");
  for (var head in headers) {
    var cell = document.createElement("th");
    var cellText = document.createTextNode(headers[head]);
    cell.appendChild(cellText);
    headRow.appendChild(cell);
  }
  var footRow = headRow.cloneNode(true);
  tblHead.appendChild(headRow);
  tblFoot.appendChild(footRow);

  // creating table body cells
  for (var coin in table_data) { // coin is the key which is numeric and ordered from 0 up
      // creates a table row
      var row = document.createElement("tr");
      //create table rows (change case number for order of cells)
      for (var j = 0; j < 8; j++) {
          // path in data ['quote.USD.price', 'quote.USD.percent_change_24h', 'quote.USD.percent_change_7d'];
          var text = "";
          switch (j) {
              case 0:
                text = (parseInt(coin) + 1).toString();
                break;
              case 1:
                text = table_data[coin].name;
                break;
              case 5:
                text = convertNumberStr(table_data[coin].quote.USD.market_cap);
                break;
              case 6:
                text = convertNumberStr(table_data[coin].circulating_supply);
                break;
              case 7:
                text = convertNumberStr(table_data[coin].quote.USD.volume_24h);
                break;
              case 2:
                text = '$'.concat(convertNumberStr(table_data[coin].quote.USD.price));
                break;
              case 3:
                text = convertNumberStr(table_data[coin].quote.USD.percent_change_24h);
                if(!text.includes('-')) {
                    text = '+'.concat(text)
                }
                break;
              case 4:
                text = convertNumberStr(table_data[coin].quote.USD.percent_change_7d);
                if(!text.includes('-')) {
                    text = '+'.concat(text)
                }
                break;
              default:
                text = "No value found!";
          }

          cell = document.createElement("td");
          cellText = document.createTextNode(text);
          if(text.toString().includes('-')) {
            cell.style.color = "#D94040";
          }
          else if(text.toString().includes('+')) {
            cell.style.color = "#00AABB";
          }
          cell.appendChild(cellText);
          row.appendChild(cell);
      }
      tblBody.appendChild(row)
  }
  tbl.appendChild(tblHead);
  tbl.appendChild(tblFoot);
  tbl.appendChild(tblBody);
}

function convertNumberStr(text) {
    var str = parseFloat(text).toFixed(2).replace('.', ',').split("").reverse().join("").match(/.{1,3}/g);
    var convStr = str[0] + str[1];
    for(var i=2; i<str.length; i++) {
        convStr = convStr + "." + str[i]
    }
    return convStr.split("").reverse().join("");
}

function tableLoad() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(this.responseText);
          table_data = data['data'];
          generate_table();
      }
    };
    request.open("GET", 'http://127.0.0.1:1337/dataload', true);
    request.send();
    return false
}


function getAssetsOfUser() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          user_assets = JSON.parse(this.responseText);
      }
    };
    request.open("GET", 'http://127.0.0.1:1337/assetload_by_user', true);
    request.send();
    return false
}

function deleteAsset(asset) {
    var assetArgs = asset.substring(6, asset.length-1).split(', ');
    assetArgs.forEach(function(arg, idx, assetArgs){
        assetArgs[idx] = arg.substring(1, arg.length-1);
        //alert(arg.substring(1, arg.length-1) + '\n' + arg)
    });

    var request = new XMLHttpRequest();
    request.open("POST", 'http://127.0.0.1:1337/asset/delete', true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(assetArgs[0]); // send asset-id

    document.getElementById('assetHistNo'+assetArgs[0]).remove();
    var sum = document.getElementById('assetSum').textContent;
    document.getElementById('assetSum').textContent = parseFloat(sum) - parseFloat(assetArgs[2]);
    return false
}

function createPortfolioPieChart() {
    var ctx = document.getElementById("portfolioPieChart");
    var portfolioPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Direct", "Referral", "Social"],
        datasets: [{
          data: [55, 30, 15],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        },
        cutoutPercentage: 75,
      },
    });
}

function assetPopUpDisplay() {
    //TODO use this function which gets called with the asset button to generate the asset table, plus event listener for coin type field to reload table
}

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
// onload start!!!
$(document).ready(function() {


    tableLoad();
    getAssetsOfUser();
     // maybe use async wait to create table after data got loaded-------------------

    // setTimeout(function(){ alert(table_data[1].name); }, 2000);


    // compute chart values from assets
    // Asset('9ca64354-0a21-11ea-9342-408d5cffb2b2', 'btc', '0.02', '6f622346-086d-11ea-b150-408d5cffb2b2', '2019-11-18 17:36:46.657184')
    /*
    var labels = [];
    var data_percentages = [];
    assets.forEach(function(asset, idx, assetArgs){
        if(!labels.includes(asset.type)) {
          labels.push(asset.type)
        }
        //TODO get current value of assets to get share of portfolio
    });
    */

    // TODO redo asset table in pop up in js to show assets specific for the coin type
});







